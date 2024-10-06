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

    // GET: api/favorites/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Favorite>> GetFavorite(Guid id)
    {
        var favorite = await _context.Favorites.FindAsync(id);
        if (favorite == null)
        {
            return NotFound();
        }

        return favorite;
    }

    // POST: api/favorites
    [HttpPost]
    public async Task<ActionResult<Favorite>> PostFavorite(Favorite favorite)
    {
        if (favorite == null)
        {
            return BadRequest("Favorite cannot be null.");
        }

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFavorite), new { id = favorite.Id }, favorite);
    }

    // DELETE: api/favorites/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFavorite(Guid id)
    {
        var favorite = await _context.Favorites.FindAsync(id);
        if (favorite == null)
        {
            return NotFound();
        }

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FavoriteExists(Guid id)
    {
        return _context.Favorites.Any(e => e.Id == id);
    }
}
