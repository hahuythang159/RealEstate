using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;

using Newtonsoft.Json;

[Route("api/[controller]")]
[ApiController]
public class PropertiesController : ControllerBase
{
    private readonly RealEstateContext _context;
    private readonly HttpClient _httpClient;

    public PropertiesController(RealEstateContext context, HttpClient httpClient)
    {
        _context = context;
        _httpClient = httpClient;
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
        // Kiểm tra dữ liệu có hợp lệ không
        if (!ModelState.IsValid)
        {
            // Log các lỗi trong ModelState
            LogModelStateErrors(ModelState);
            return BadRequest(ModelState);
        }

        // Kiểm tra OwnerId có tồn tại không
        var owner = await _context.Users.FindAsync(property.OwnerId);
        if (owner == null)
        {
            return BadRequest("Owner not found.");
        }

        // Lưu Province, District, và Ward từ API
        await SaveProvinceDistrictWard(property);

        // Thêm property vào database
        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
    }

    private async Task SaveProvinceDistrictWard(Property property)
    {
        property.Province = new Province
        {
            Id = property.ProvinceId,
            Name = await GetProvinceName(property.ProvinceId)
        };

        property.District = new District
        {
            Id = property.DistrictId,
            Name = await GetDistrictName(property.DistrictId),
            ProvinceId = property.ProvinceId
        };

        property.Ward = new Ward
        {
            Id = property.WardId,
            Name = await GetWardName(property.WardId),
            DistrictId = property.DistrictId
        };
    }

    // Lấy tên tỉnh từ API
    private async Task<string> GetProvinceName(int provinceId)
    {
        var response = await _httpClient.GetAsync($"https://provinces.open-api.vn/api/provinces/{provinceId}");
        if (response.IsSuccessStatusCode)
        {
            var provinceData = JsonConvert.DeserializeObject<Province>(await response.Content.ReadAsStringAsync());
            return provinceData?.Name ?? "Unknown Province";
        }
        return "Unknown Province"; // Hoặc xử lý lỗi
    }

    // Lấy tên huyện từ API
    private async Task<string> GetDistrictName(int districtId)
    {
        var response = await _httpClient.GetAsync($"https://provinces.open-api.vn/api/districts/{districtId}");
        if (response.IsSuccessStatusCode)
        {
            var districtData = JsonConvert.DeserializeObject<District>(await response.Content.ReadAsStringAsync());
            return districtData?.Name ?? "Unknown District";
        }
        return "Unknown District"; // Hoặc xử lý lỗi
    }

    // Lấy tên xã từ API
    private async Task<string> GetWardName(int wardId)
    {
        var response = await _httpClient.GetAsync($"https://provinces.open-api.vn/api/wards/{wardId}");
        if (response.IsSuccessStatusCode)
        {
            var wardData = JsonConvert.DeserializeObject<Ward>(await response.Content.ReadAsStringAsync());
            return wardData?.Name ?? "Unknown Ward";
        }
        return "Unknown Ward"; // Hoặc xử lý lỗi
    }

    // PUT: api/properties/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProperty(Guid id, Property property)
    {
        if (id != property.Id)
        {
            return BadRequest();
        }

        _context.Entry(property).State = EntityState.Modified;

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
