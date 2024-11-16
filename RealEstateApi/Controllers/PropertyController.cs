using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Security.Claims;


[Route("api/[controller]")]
[ApiController]
public class PropertiesController : ControllerBase
{
    private readonly RealEstateContext _context;

    public PropertiesController(RealEstateContext context)
    {
        _context = context;
    }

    // GET: api/properties
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Property>>> GetProperties(
    [FromQuery] decimal? minPrice,
    [FromQuery] decimal? maxPrice,
    [FromQuery] int? bedrooms,
    [FromQuery] int? bathrooms,
    [FromQuery] int? provinceId,
    [FromQuery] int? districtId,
    [FromQuery] int? wardId,
    [FromQuery] string? interior
)
    {
        var query = _context.Properties
            .Include(p => p.Province)
            .Include(p => p.District)
            .Include(p => p.Ward)
            .Include(p => p.Rentals)
            .Where(p => !p.Rentals.Any(r => r.Status == RentalStatus.Approved))
            .AsQueryable();

        // Apply filters
        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
        if (bedrooms.HasValue) query = query.Where(p => p.Bedrooms == bedrooms.Value);
        if (bathrooms.HasValue) query = query.Where(p => p.Bathrooms == bathrooms.Value);
        if (provinceId.HasValue) query = query.Where(p => p.ProvinceId == provinceId.Value);
        if (districtId.HasValue) query = query.Where(p => p.DistrictId == districtId.Value);
        if (wardId.HasValue) query = query.Where(p => p.WardId == wardId.Value);
        if (!string.IsNullOrEmpty(interior)) query = query.Where(p => p.Interior == interior);

        var properties = await query.ToListAsync();

        var propertyIds = properties.Select(p => p.Id).ToList();
        var images = await _context.PropertyImages
            .Where(pi => propertyIds.Contains(pi.PropertyId))
            .ToListAsync();

        var propertiesWithImages = properties.Select(p => new
        {
            p.Id,
            p.Title,
            p.Address,
            p.Description,
            p.Price,
            p.OwnerId,
            p.ProvinceId,
            p.DistrictId,
            p.WardId,
            p.Bedrooms,
            p.Bathrooms,
            p.Area,
            p.PropertyType,
            p.Interior,
            p.PostedDate,
            p.IsHidden,
            Province = p.Province?.Name,
            District = p.District?.Name,
            Ward = p.Ward?.Name,
            Images = images.Where(i => i.PropertyId == p.Id)
        });

        return Ok(propertiesWithImages);
    }


    // GET: api/properties/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Property>> GetProperty(Guid id)
    {
        // Truy vấn bất động sản từ bảng Properties
        var property = await _context.Properties
            .Include(p => p.Province)
            .Include(p => p.District)
            .Include(p => p.Ward)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (property == null)
        {
            return NotFound();
        }

        var images = await _context.PropertyImages
            .Where(pi => pi.PropertyId == id)
            .Select(pi => new
            {
                pi.Id,
                pi.ImageUrl
            })
            .ToListAsync();

        var propertyResponse = new
        {
            property.Id,
            property.Title,
            property.Address,
            property.Description,
            property.Price,
            property.OwnerId,
            property.ProvinceId,
            property.DistrictId,
            property.WardId,
            property.Bedrooms,
            property.Bathrooms,
            property.Area,
            property.PropertyType,
            property.Interior,
            property.PostedDate,
            property.IsHidden,
            Province = property.Province?.Name,
            District = property.District?.Name,
            Ward = property.Ward?.Name,
            Images = images
        };

        return Ok(propertyResponse);
    }

    [HttpPost]
    public async Task<ActionResult<Property>> PostProperty([FromForm] PropertyRequest request)
    {
        try
        {
            // Kiểm tra các lỗi validation
            if (!ModelState.IsValid)

            {
                foreach (var error in ModelState)
                {
                    foreach (var subError in error.Value.Errors)
                    {
                        Console.WriteLine($"Error in {error.Key}: {subError.ErrorMessage}");
                    }
                }

                return BadRequest(new
                {
                    Title = "One or more validation errors occurred.",
                    Status = 400,
                    Errors = ModelState.ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    )
                });
            }

            var owner = await _context.Users.FindAsync(request.Property.OwnerId);
            if (owner == null)
            {
                return BadRequest("Owner not found.");
            }

            if (request.Property.ProvinceId != 0 && !await _context.Provinces.AnyAsync(p => p.Id == request.Property.ProvinceId))
            {
                return BadRequest("Province not found.");
            }
            if (request.Property.DistrictId != 0 && !await _context.Districts.AnyAsync(d => d.Id == request.Property.DistrictId))
            {
                return BadRequest("District not found.");
            }
            if (request.Property.WardId != 0 && !await _context.Wards.AnyAsync(w => w.Id == request.Property.WardId))
            {
                return BadRequest("Ward not found.");
            }
            if (request.Images == null || request.Images.Count == 0)
            {
                return BadRequest("No images uploaded.");
            }

            _context.Properties.Add(request.Property);
            await _context.SaveChangesAsync();

            foreach (var image in request.Images)
            {
                if (image != null && image.Length > 0)
                {
                    var imageUrl = await SaveImageAsync(image);

                    var propertyImage = new PropertyImage
                    {
                        PropertyId = request.Property.Id,
                        ImageUrl = imageUrl
                    };

                    _context.PropertyImages.Add(propertyImage);
                }
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProperty), new { id = request.Property.Id }, request.Property);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error: " + ex.Message });
        }
    }


    [HttpGet("provinces")]
    public async Task<IActionResult> GetProvinces()
    {
        var provinces = await _context.Provinces.ToListAsync();
        return Ok(provinces);
    }

    // Lấy danh sách huyện theo tỉnh Id
    [HttpGet("provinces/{provinceId}/districts")]
    public async Task<IActionResult> GetDistrictsByProvince(int provinceId)
    {
        var districts = await _context.Districts
                                      .Where(d => d.ProvinceId == provinceId)
                                      .ToListAsync();
        return Ok(districts);
    }

    // Lấy danh sách xã/phường theo huyện Id
    [HttpGet("districts/{districtId}/wards")]
    public async Task<IActionResult> GetWardsByDistrict(int districtId)
    {
        var wards = await _context.Wards
                                  .Where(w => w.DistrictId == districtId)
                                  .ToListAsync();
        return Ok(wards);
    }

    // PUT: api/properties/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProperty(Guid id, Property property)
    {
        if (id != property.Id)
        {
            return BadRequest();
        }

        var existingProperty = await _context.Properties.FindAsync(id);
        if (existingProperty == null)
        {
            return NotFound();
        }

        existingProperty.Description = property.Description;
        existingProperty.Price = property.Price;
        existingProperty.Interior = property.Interior;

        _context.Entry(existingProperty).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PropertyExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }


    // DELETE: api/properties/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProperty(Guid id)
    {
        var property = await _context.Properties.FindAsync(id);
        if (property == null)
        {
            return NotFound();
        }

        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    // GET: api/properties/my-properties?userId=some-guid
    [HttpGet("my-properties")]
    public async Task<IActionResult> GetMyProperties([FromQuery] string userId)
    {
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid parsedUserId))
        {
            return BadRequest("UserId không hợp lệ.");
        }

        var properties = await _context.Properties
                                        .Where(p => p.OwnerId == parsedUserId)
                                        .ToListAsync();

        if (properties == null || !properties.Any())
        {
            return NotFound("Người dùng không có bất động sản nào.");
        }

        return Ok(properties);
    }
    // PUT: api/properties/{id}/hide
    [HttpPut("{id}/hide")]
    public async Task<IActionResult> HideProperty(Guid id)
    {
        var property = await _context.Properties.FindAsync(id);
        if (property == null)
        {
            return NotFound();
        }

        property.IsHidden = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/properties/average-price-by-type
    [HttpGet("average-price-by-type")]
    public async Task<ActionResult<IEnumerable<PropertyTypeAveragePrice>>> GetAveragePriceByPropertyType()
    {
        var averagePrices = await _context.Properties
            .GroupBy(p => p.PropertyType)
            .Select(g => new PropertyTypeAveragePrice
            {
                PropertyType = g.Key,
                AveragePrice = g.Average(p => p.Price)
            })
            .ToListAsync();

        return Ok(averagePrices);
    }

    private bool PropertyExists(Guid id)
    {
        return _context.Properties.Any(e => e.Id == id);
    }

    // Hàm log lỗi ModelState
    private void LogModelStateErrors(ModelStateDictionary modelState)
    {
        foreach (var entry in modelState)
        {
            foreach (var error in entry.Value.Errors)
            {
                Console.WriteLine($"Field: {entry.Key}, Error: {error.ErrorMessage}");
            }
        }
    }
    private async Task<string> SaveImageAsync(IFormFile image)
    {
        try
        {
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            Directory.CreateDirectory(uploadsFolderPath);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
            var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return Path.Combine("images", uniqueFileName).Replace("\\", "/");
        }
        catch (Exception ex)
        {
            throw new Exception("Error saving image: " + ex.Message);
        }
    }
}
