using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;


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
    public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
    {
        return await _context.Properties
            .Include(p => p.Province)
            .Include(p => p.District)
            .Include(p => p.Ward)
            .ToListAsync(); 
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
            var province = await _context.Provinces.FindAsync(property.ProvinceId);
            if (province == null)
            {
                return BadRequest("Province not found.");
            }

            var district = await _context.Districts.FindAsync(property.DistrictId);
            if (district == null)
            {
                return BadRequest("District not found.");
            }

            var ward = await _context.Wards.FindAsync(property.WardId);
            if (ward == null)
            {
                return BadRequest("Ward not found.");
            }

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



    // Cập nhật GetProvinceName, GetDistrictName, GetWardName
    private async Task<string> GetProvinceName(int provinceId)
    {
        var province = await _context.Provinces.FindAsync(provinceId);
        return province != null ? province.Name : "Unknown";
    }

    private async Task<string> GetDistrictName(int districtId)
    {
        var district = await _context.Districts.FindAsync(districtId);
        return district != null ? district.Name : "Unknown";
    }

    private async Task<string> GetWardName(int wardId)
    {
        var ward = await _context.Wards.FindAsync(wardId);
        return ward != null ? ward.Name : "Unknown";
    }

    // GET: api/provinces
    [HttpGet("provinces")]
    public async Task<ActionResult<IEnumerable<Province>>> GetProvinces()
    {
        return await _context.Provinces.ToListAsync();
    }

    // GET: api/districts/{provinceId}
    [HttpGet("districts/{provinceId}")]
    public async Task<ActionResult<IEnumerable<District>>> GetDistricts(int provinceId)
    {
        return await _context.Districts
                            .Where(d => d.ProvinceId == provinceId)
                            .ToListAsync();
    }

    // GET: api/wards/{districtId}
    [HttpGet("wards/{districtId}")]
    public async Task<ActionResult<IEnumerable<Ward>>> GetWards(int districtId)
    {
        return await _context.Wards
                            .Where(w => w.DistrictId == districtId)
                            .ToListAsync();
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
