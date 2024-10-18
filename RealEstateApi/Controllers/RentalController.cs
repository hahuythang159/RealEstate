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
    public async Task<ActionResult<Rental>> PostRental(Rental rentalDto)
    {
        try
        {
            var property = await _context.Properties.FindAsync(rentalDto.PropertyId);
            if (property == null)
            {
                return NotFound(new { message = "Bất động sản không tồn tại." });
            }

            // Kiểm tra tenant có tồn tại hay không
            var tenant = await _context.Users.FindAsync(rentalDto.TenantId);
            if (tenant == null)
            {
                return NotFound(new { message = "Người thuê không tồn tại." });
            }

            // Tạo rental mới
            var rental = new Rental
            {
                PropertyId = rentalDto.PropertyId,
                TenantId = rentalDto.TenantId,
                StartDate = rentalDto.StartDate,
                EndDate = rentalDto.EndDate,
                Status = RentalStatus.PendingApproval // Mặc định trạng thái là PendingApproval
            };

            _context.Rentals.Add(rental);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRental), new { id = rental.Id }, rental);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi máy chủ: " + ex.Message);
        }
    }

    // PUT: api/rentals/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Owner, Manager")] 
    public async Task<IActionResult> PutRental(Guid id, Rental rental)
    {
        if (id != rental.Id)
        {
            return BadRequest();
        }

        var existingRental = await _context.Rentals.FindAsync(id);
        if (existingRental == null)
        {
            return NotFound();
        }

        existingRental.StartDate = rental.StartDate;
        existingRental.EndDate = rental.EndDate;
        existingRental.Status = rental.Status;

        _context.Entry(existingRental).State = EntityState.Modified;

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
    [Authorize(Roles = "Owner, Manager")] // Chỉ Owner hoặc Manager có quyền xóa rental
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

    // GET: api/rentals/pending
    [HttpGet("pending")]
    [Authorize(Roles = "Owner, Manager, Tenant")] // Tất cả các vai trò đều có thể xem rental chờ phê duyệt
    public async Task<ActionResult<IEnumerable<Rental>>> GetPendingRentals()
    {
        var pendingRentals = await _context.Rentals
            .Where(r => r.Status == RentalStatus.PendingApproval)
            .Include(r => r.Property)
            .Include(r => r.Tenant)
            .ToListAsync();

        return pendingRentals;
    }

    // PATCH: api/rentals/{id}/approve
    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveRental(Guid id)
    {
        var rental = await _context.Rentals.FindAsync(id);
        if (rental == null)
        {
            return NotFound(new { message = "Hợp đồng không tìm thấy." });
        }

        if (rental.Status != RentalStatus.PendingApproval)
        {
            return BadRequest(new { message = "Hợp đồng không thể được duyệt vì không ở trạng thái chờ phê duyệt." });
        }

        try
        {
            // Cập nhật trạng thái thành Approved
            rental.Status = RentalStatus.Approved;
            _context.Entry(rental).State = EntityState.Modified;

            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi duyệt hợp đồng: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi duyệt hợp đồng: " + ex.ToString() });
        }

        return NoContent();
    }


}
