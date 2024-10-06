using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly RealEstateContext _context;

    public ReviewsController(RealEstateContext context)
    {
        _context = context;
    }

    // GET: api/reviews
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
    {
        return await _context.Reviews.ToListAsync();
    }

    // GET: api/reviews/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound();
        }

        return review;
    }

    // POST: api/reviews
    [HttpPost]
    public async Task<ActionResult<Review>> PostReview(Review review)
    {
        if (review == null)
        {
            return BadRequest("Review cannot be null.");
        }

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
    }

    // PUT: api/reviews/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutReview(Guid id, Review review)
    {
        if (id != review.Id)
        {
            return BadRequest();
        }

        _context.Entry(review).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ReviewExists(id))
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

    // DELETE: api/reviews/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound();
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ReviewExists(Guid id)
    {
        return _context.Reviews.Any(e => e.Id == id);
    }
}
