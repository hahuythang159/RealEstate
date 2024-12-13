using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RealEstateApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class NotificationsController : ControllerBase
{
    private readonly RealEstateContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public NotificationsController(RealEstateContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // GET: api/notifications?page=1&limit=10
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        // Tính toán phân trang
        var notifications = await _context.Notifications
            .OrderByDescending(n => n.CreatedAt) // Sắp xếp theo thời gian tạo
            .Skip((page - 1) * limit) // Bỏ qua các mục trước đó
            .Take(limit) // Lấy số lượng giới hạn
            .ToListAsync();

        return Ok(notifications);
    }

    // POST: api/notifications
    [HttpPost]
    public async Task<ActionResult<Notification>> PostNotification([FromBody] Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNotifications), new { id = notification.Id }, notification);
    }

    // PUT: api/notifications/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNotificationStatus(Guid id, [FromBody] NotificationStatusDto statusDto)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null)
        {
            return NotFound("Notification not found.");
        }

        notification.IsRead = statusDto.IsRead;
        await _context.SaveChangesAsync();

        return Ok(notification);
    }


    // POST: api/notifications/on-comment
    [HttpPost("on-comment")]
    public async Task<IActionResult> OnCommentReceived([FromBody] CommentDto commentDto)
    {
        if (commentDto == null || commentDto.PropertyId == Guid.Empty)
        {
            return BadRequest("Invalid comment data.");
        }

        try
        {
            // Lấy thông tin chủ sở hữu bất động sản
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

            // Lấy thông tin người gửi bình luận từ userId
            var user = await _context.Users.FindAsync(commentDto.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Tạo notification
            var notification = new Notification
            {
                UserId = owner.Id,
                Message = $"Có bình luận mới từ: {user.UserName} về bất động sản của bạn với nội dung: {commentDto.Content}",
                CreatedAt = DateTime.Now,
                IsRead = false,
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Phát tín hiệu tới tất cả client (có thể là người chủ bất động sản)
            await _hubContext.Clients.User(owner.Id.ToString()).SendAsync("ReceiveNotification", notification);

            return Ok(notification);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error: " + ex.Message);
        }
    }
}
