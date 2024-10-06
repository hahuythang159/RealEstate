using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

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
    public async Task<ActionResult<Rental>> PostRental([FromBody] Rental rentalDto)
    {
        if (rentalDto == null)
        {
            return BadRequest("Invalid rental data.");
        }

        // Lấy ID người dùng từ token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(); // Người dùng chưa xác thực
        }

        Guid tenantId = Guid.Parse(userIdClaim.Value);

        // Tìm kiếm Property theo PropertyId
        var property = await _context.Properties.FindAsync(rentalDto.PropertyId);
        if (property == null)
        {
            return NotFound("Property not found.");
        }

        // Tạo Rental mới
        var rental = new Rental
        {
            PropertyId = rentalDto.PropertyId,
            Property = property, // Thêm thông tin property
            TenantId = tenantId, // Gán ID người dùng vào TenantId
            StartDate = rentalDto.StartDate,
            EndDate = rentalDto.EndDate,
        };

        _context.Rentals.Add(rental);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRental), new { id = rental.Id }, rental);
    }

    // PUT: api/rentals/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRental(Guid id, Rental rental)
    {
        if (id != rental.Id)
        {
            return BadRequest();
        }

        _context.Entry(rental).State = EntityState.Modified;

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
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/rentals/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRental(Guid id)
    {
        var rental = await _context.Rentals.FindAsync(id);
        if (rental == null)
        {
            return NotFound();
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
