using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

public class Review
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid TargetUserId { get; set; } 

    [Required]
    public Guid ReviewerId { get; set; }
    [Required]

    [Range(1, 5, ErrorMessage = "Điểm đánh giá phải từ 1 đến 5")]
    public int Rating { get; set; }

    [StringLength(500, ErrorMessage = "Nhận xét không vượt quá 500 ký tự")]
    public string? Comment { get; set; }
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public virtual User? Reviewer { get; set; }

    [JsonIgnore]
    public virtual User? TargetUser { get; set; }

}
