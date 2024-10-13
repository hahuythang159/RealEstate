using System;
using System.ComponentModel.DataAnnotations;

namespace RealEstateApi.Models
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid  PropertyId { get; set; }

        [Required]
        public Guid  UserId { get; set; } 

        [Required]
        [StringLength(500, ErrorMessage = "Nội dung bình luận không được vượt quá 500 ký tự.")]
        public string Content { get; set; } 

        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
    }
}
