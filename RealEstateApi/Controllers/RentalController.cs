using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using RealEstateApi.Models;

[Route("api/[controller]")]
[ApiController]
public class RentalsController : ControllerBase
{
    private readonly RealEstateContext _context;

    public RentalsController(RealEstateContext context)
    {
        _context = context;
    }

    // GET: api/rentals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rental>>> GetRentals()
    {
        return await _context.Rentals.Include(r => r.Property).Include(r => r.Tenant).ToListAsync();
    }

    // GET: api/rentals/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Rental>> GetRental(Guid id)
    {
        var rental = await _context.Rentals
            .Include(r => r.Property)
            .Include(r => r.Tenant)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rental == null)
        {
            return NotFound();
        }

        return rental;
    }

    // POST: api/rentals
    [HttpPost]
    public async Task<ActionResult<Rental>> PostRental( Rental rental)
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

            // Thêm property vào database
            _context.Rentals.Add(rental);
            await _context.SaveChangesAsync();

            // Trả về kết quả CreatedAtAction khi thêm thành công
            return CreatedAtAction(nameof(GetRental), new { id = rental.Id }, rental);
        }
        catch (Exception ex)
        {
            // Xử lý lỗi không mong muốn
            return StatusCode(500, new { message = "Internal server error: " + ex.Message });
        }
    }

    // PUT: api/rentals/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Owner, Manager")] // Chỉ admin hoặc quản lý có quyền sửa rental
    public async Task<IActionResult> PutRental(Guid id,  Rental rental)
    {
        if (id != rental.Id)
        {
            return BadRequest();
        }

        var existingrental = await _context.Rentals.FindAsync(id);
        if (existingrental == null)
        {
            return NotFound();
        }

        // Chỉ cập nhật các trường cần thiết
        // existingrental.Description = rental.Description; // Cập nhật mô tả
        // existingrental.Price = rental.Price; // Cập nhật giá

        _context.Entry(existingrental).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RentalExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/rentals/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Owner, Manager")] // Chỉ admin hoặc quản lý có quyền xóa rental
    public async Task<IActionResult> DeleteRental(Guid id)
    {
        var rental = await _context.Rentals.FindAsync(id);
        if (rental == null)
        {
            return NotFound("Rental not found.");
        }

        _context.Rentals.Remove(rental);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RentalExists(Guid id)
    {
        return _context.Rentals.Any(e => e.Id == id);
    }
}
