using System;
using System.ComponentModel.DataAnnotations;

namespace RealEstateApi.Models
{
    public class CommentDto
    {
        
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Property ID is required.")]
        public Guid PropertyId { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Content is required.")]
        [StringLength(500, ErrorMessage = "Content cannot exceed 500 characters.")]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Gán giá trị mặc định cho CreatedAt
    }
}
