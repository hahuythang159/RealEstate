using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RealEstateApi.Data; 
using RealEstateApi.Models; 
using Microsoft.EntityFrameworkCore;


namespace RealEstateApi.Controllers // Namespace cho CommentsController
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

        [HttpGet("{propertyId}")] // Lấy bình luận theo PropertyId
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(Guid  propertyId)
        {
            var comments = await _context.Comments
                .Where(c => c.PropertyId == propertyId)
                .Select(c => new CommentDto // Chuyển đổi thành CommentDto
                {
                    Id  = c.Id,
                    PropertyId = c.PropertyId,
                    UserId = c.UserId,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost] // Đánh dấu phương thức này để xử lý yêu cầu POST
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
                    CreatedAt = DateTime.UtcNow // Thay đổi thời gian tạo nếu cần
                };

                // Thêm bình luận vào cơ sở dữ liệu
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                // Gửi bình luận đến tất cả client
                await _hubContext.Clients.All.SendAsync("ReceiveComment", commentDto.PropertyId, commentDto.UserId, commentDto.Content);
                return Ok(comment); // Trả về bình luận đã được thêm
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có vấn đề trong khi gửi bình luận
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
