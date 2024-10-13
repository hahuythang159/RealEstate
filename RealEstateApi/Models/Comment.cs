using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace RealEstateApi.Models
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid  PropertyId { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        [ForeignKey("User")] // Ràng buộc khóa ngoại tới thực thể User
        public Guid UserId { get; set; }
        
        [JsonIgnore]
        public virtual User? User { get; set; }


        [Required]
        [StringLength(500, ErrorMessage = "Nội dung bình luận không được vượt quá 500 ký tự.")]
        public string? Content { get; set; } 

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
    }
}
