using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstateApi.Data; 
using RealEstateApi.Models; 
using Microsoft.EntityFrameworkCore;


namespace RealEstateApi.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly RealEstateContext _context; 
        private readonly IHubContext<CommentHub> _hubContext;

        public CommentsController(RealEstateContext context, IHubContext<CommentHub> hubContext)
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
                        UserName = u.UserName, // Lấy tên người dùng từ bảng Users
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
                // Tạo bình luận mới
                var comment = new Comment
                {
                    PropertyId = commentDto.PropertyId,
                    UserId = commentDto.UserId,
                    Content = commentDto.Content,
                    CreatedAt = DateTime.Now
                };

                // Thêm bình luận vào cơ sở dữ liệu
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                // Lấy tên người dùng từ bảng Users
                var user = await _context.Users.FindAsync(comment.UserId);

                // Chuẩn bị phản hồi
                var result = new CommentDto
                {
                    Id = comment.Id,
                    PropertyId = comment.PropertyId,
                    UserId = comment.UserId,
                    UserName = user?.UserName, // Trả về tên người dùng
                    Content = comment.Content,
                    CreatedAt = comment.CreatedAt
                };

                // Gửi bình luận đến tất cả client
                await _hubContext.Clients.All.SendAsync("ReceiveComment", result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

    }
}
