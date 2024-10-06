using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using RealEstateApi.Models; // Đảm bảo sử dụng namespace đúng


namespace RealEstateApi.Data // Namespace cho CommentHub
{
    public class CommentHub : Hub
    {
        private readonly RealEstateContext _context;

        public CommentHub(RealEstateContext context)
        {
            _context = context;
        }

        public async Task SendComment(string propertyId, Guid userId, string comment)
        {
            var newComment = new Comment
            {
                PropertyId = Guid.Parse(propertyId),
                UserId = userId,
                Content = comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(newComment);
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("ReceiveComment", propertyId, userId, comment);
        }
    }
}
