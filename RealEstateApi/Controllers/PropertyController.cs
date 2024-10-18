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
        [FromQuery] int? bathrooms)
    {
        var query = _context.Properties
            .Include(p => p.Province)
            .Include(p => p.District)
            .Include(p => p.Ward)
            .Include(p => p.Rentals) 
            .Where(p => !p.Rentals.Any(r => r.Status == RentalStatus.Approved))
            .AsQueryable();

        // Lọc theo giá
        if (minPrice.HasValue)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }
        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        // Lọc theo số phòng ngủ
        if (bedrooms.HasValue)
        {
            query = query.Where(p => p.Bedrooms == bedrooms.Value);
        }

        // Lọc theo số phòng tắm
        if (bathrooms.HasValue)
        {
            query = query.Where(p => p.Bathrooms == bathrooms.Value);
        }
        

        // Trả về danh sách bất động sản đã lọc
        return await query.ToListAsync();
    }


    // GET: api/properties/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Property>> GetProperty(Guid id)
    {
        var property = await _context.Properties
            .Include(p => p.Province)
            .Include(p => p.District)
            .Include(p => p.Ward)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (property == null)
        {
            return NotFound();
        }

        return property;
    }

    // POST: api/properties
    [HttpPost]
    public async Task<ActionResult<Property>> PostProperty(Property property)
    {
        try
        {
            // Kiểm tra tính hợp lệ của dữ liệu model
            if (!ModelState.IsValid)
            {
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

            // Kiểm tra OwnerId hợp lệ
            var owner = await _context.Users.FindAsync(property.OwnerId);
            if (owner == null)
            {
                return BadRequest("Owner not found.");
            }

            // Kiểm tra ProvinceId, DistrictId, WardId hợp lệ
            // var province = await _context.Provinces.FindAsync(property.ProvinceId);
            // if (province == null)
            // {
            //     return BadRequest("Province not found.");
            // }

            // var district = await _context.Districts.FindAsync(property.DistrictId);
            // if (district == null)
            // {
            //     return BadRequest("District not found.");
            // }

            // var ward = await _context.Wards.FindAsync(property.WardId);
            // if (ward == null)
            // {
            //     return BadRequest("Ward not found.");
            // }

            // Thêm property vào database
            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            // Trả về kết quả CreatedAtAction khi thêm thành công
            return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
        }
        catch (Exception ex)
        {
            // Xử lý lỗi không mong muốn
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

        existingProperty.Description = property.Description; // Cập nhật mô tả
        existingProperty.Price = property.Price; // Cập nhật giá
        existingProperty.Interior = property.Interior; // Cập nhật giá


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
        // Kiểm tra nếu userId null hoặc không hợp lệ
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid parsedUserId))
        {
            return BadRequest("UserId không hợp lệ.");
        }

        // Lấy danh sách bất động sản của người dùng
        var properties = await _context.Properties
                                        .Where(p => p.OwnerId == parsedUserId)
                                        .ToListAsync();

        // Kiểm tra nếu người dùng không có bất động sản
        if (properties == null || properties.Count == 0)
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
}
