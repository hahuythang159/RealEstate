using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class FavoritesController : ControllerBase
{
    private readonly RealEstateContext _context;

    public FavoritesController(RealEstateContext context)
    {
        _context = context;
    }

    // GET: api/favorites
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Favorite>>> GetFavorites()
    {
        return await _context.Favorites.ToListAsync();
    }

    // GET: api/favorites/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Property>>> GetFavoritesByUser(Guid userId)
    {
        var favorites = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Property)
            .ToListAsync();

        if (favorites == null || !favorites.Any())
        {
            return NotFound(new { message = "Không có bất động sản nào trong danh sách yêu thích." });
        }

        // Trả về danh sách bất động sản từ danh sách yêu thích
        var properties = favorites.Select(f => f.Property).ToList();

        return Ok(properties);
    }


     // POST/PUT: api/favorites/toggle
    [HttpPost("toggle")]
    public async Task<IActionResult> ToggleFavorite(Favorite favorite)
    {
        if (favorite == null)
        {
            return BadRequest("Favorite cannot be null.");
        }

        // Kiểm tra người dùng tồn tại
        var userExists = await _context.Users.AnyAsync(u => u.Id == favorite.UserId);
        if (!userExists)
        {
            return NotFound("User not found.");
        }

        // Kiểm tra nếu người dùng đã yêu thích bất động sản này
        var existingFavorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == favorite.UserId && f.PropertyId == favorite.PropertyId);

        if (existingFavorite != null)
        {
            // Nếu bất động sản đã có trong danh sách yêu thích, xóa nó
            _context.Favorites.Remove(existingFavorite);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã bỏ khỏi danh sách yêu thích." });
        }
        else
        {
            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã thêm vào danh sách yêu thích." });
        }
    }
    // GET: api/favorites/user/{userId}/{propertyId}
    [HttpGet("user/{userId}/{propertyId}")]
    public async Task<IActionResult> CheckFavoriteStatus(Guid userId, Guid propertyId)
    {
        var isFavorited = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);

        return Ok(new { isFavorited });
    }

    private bool FavoriteExists(Guid id)
    {
        return _context.Favorites.Any(e => e.Id == id);
    }
}
