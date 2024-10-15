using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealEstateApi.Models
{
    public class CommentDto
    {
        
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Property ID is required.")]
        public Guid PropertyId { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        
        public Guid UserId { get; set; }

        public string? UserName { get; set; } 
        public string? Avatar { get; set; } 


        [Required(ErrorMessage = "Content is required.")]
        [StringLength(500, ErrorMessage = "Content cannot exceed 500 characters.")]
        public string? Content { get; set; }

        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        }
}
