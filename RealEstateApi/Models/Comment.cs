using System;
using System.ComponentModel.DataAnnotations;

namespace RealEstateApi.Models
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();  // Định danh duy nhất

        [Required]
        public Guid  PropertyId { get; set; } // Khóa ngoại đến bất động sản

        [Required]
        public Guid  UserId { get; set; } // Khóa ngoại đến người dùng

        [Required]
        [StringLength(500, ErrorMessage = "Nội dung bình luận không được vượt quá 500 ký tự.")]
        public string Content { get; set; } // Nội dung bình luận

        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Thời gian tạo bình luận
        
    }
}
