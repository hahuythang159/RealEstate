using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstateApi.Models;
using Microsoft.EntityFrameworkCore;


namespace RealEstateApi.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly RealEstateContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public CommentsController(RealEstateContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("{propertyId}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(Guid propertyId)
        {
            var comments = await _context.Comments
            .Where(c => c.PropertyId == propertyId)
            .Join(_context.Users,
                c => c.UserId,
                u => u.Id,
                (c, u) => new CommentDto
                {
                    Id = c.Id,
                    PropertyId = c.PropertyId,
                    UserId = c.UserId,
                    AvatarUrl = u.AvatarUrl,
                    UserName = u.UserName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                })
            .ToListAsync();

            return Ok(comments);
        }

        [HttpPost]
        public async Task<IActionResult> PostComment([FromBody] CommentDto commentDto)
        {
            if (commentDto == null || commentDto.PropertyId == Guid.Empty || string.IsNullOrWhiteSpace(commentDto.Content))
            {
                return BadRequest("Invalid comment data.");
            }

            try
            {
                var comment = new Comment
                {
                    PropertyId = commentDto.PropertyId,
                    UserId = commentDto.UserId,
                    Content = commentDto.Content,
                    CreatedAt = DateTime.Now
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                var user = await _context.Users.FindAsync(comment.UserId);

                var result = new CommentDto
                {
                    Id = comment.Id,
                    PropertyId = comment.PropertyId,
                    UserId = comment.UserId,
                    AvatarUrl = user?.AvatarUrl,
                    UserName = user?.UserName,
                    Content = comment.Content,
                    CreatedAt = comment.CreatedAt
                };

                await _hubContext.Clients.All.SendAsync("ReceiveComment", result);

                var property = await _context.Properties.FindAsync(commentDto.PropertyId);
                if (property == null)
                {
                    return NotFound("Property not found.");
                }

                var owner = await _context.Users.FindAsync(property.OwnerId);
                if (owner == null)
                {
                    return NotFound("Owner not found.");
                }

                var notification = new Notification
                {
                    UserId = owner.Id,
                    Message = $"Có bình luận mới từ: {user.UserName} về bất động sản của bạn với nội dung: {commentDto.Content}",
                    CreatedAt = DateTime.Now,
                    IsRead = false,
                };

                _context.Notifications.Add(notification);
                await _context.SaveChangesAsync();

                await _hubContext.Clients.User(owner.Id.ToString()).SendAsync("ReceiveNotification", notification);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

    }
}
