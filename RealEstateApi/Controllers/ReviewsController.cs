using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
    public async Task<ActionResult<IEnumerable<Review>>> GetReviews([FromQuery] Guid? propertyId)
    {
        if (propertyId.HasValue)
        {
            return await _context.Reviews
                .Include(r => r.Reviewer)
                .Include(r => r.TargetUser)
                .ToListAsync();
        }

        return await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.TargetUser)
            .ToListAsync();
    }

    // GET: api/reviews/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(Guid id)
    {
        var review = await _context.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.TargetUser)
            .FirstOrDefaultAsync(r => r.Id == id);

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

        if (string.IsNullOrWhiteSpace(review.Comment))
        {
            return BadRequest("Comment cannot be empty.");
        }

        if (review.TargetUserId == Guid.Empty || review.ReviewerId == Guid.Empty)
        {
            return BadRequest("Invalid user information.");
        }

        review.Id = Guid.NewGuid();
        review.CreatedAt = DateTime.Now;

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
    }


    // GET: api/reviews/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetReviewsForUser(Guid userId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.TargetUserId == userId)
            .Include(r => r.Reviewer)
            .Include(r => r.TargetUser)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                ReviewerName = r.Reviewer.UserName,
                ReviewerAvatarUrl = r.Reviewer.AvatarUrl,

                OwnerIntroduction = r.TargetUser.Role == "Owner" ? r.TargetUser.OwnerIntroduction : null,
                OwnerAdditionalInfo = r.TargetUser.Role == "Owner" ? r.TargetUser.OwnerAdditionalInfo : null
            })
            .ToListAsync();

        if (!reviews.Any())
        {
            return NotFound("No reviews found for the specified user.");
        }

        return Ok(reviews);
    }

    // GET: api/reviews/user/{userId}/average
    [HttpGet("user/{userId}/average")]
    public async Task<ActionResult<double>> GetAverageRatingForUser(Guid userId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.TargetUserId == userId)
            .ToListAsync();

        if (!reviews.Any())
        {
            return NotFound("No reviews found for the specified user.");
        }

        double averageRating = reviews.Average(r => r.Rating);
        return Ok(averageRating);
    }
}
