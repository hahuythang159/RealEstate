using System;
using System.ComponentModel.DataAnnotations;

public class Review
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid  PropertyId { get; set; } // Khóa ngoại đến bất động sản

    [Required]
    public Guid  UserId { get; set; } // Khóa ngoại đến người dùng

    [Range(1, 5, ErrorMessage = "Điểm đánh giá phải từ 1 đến 5")]
    public int Rating { get; set; } // Điểm đánh giá (1-5)

    [StringLength(500, ErrorMessage = "Nhận xét không vượt quá 500 ký tự")]
    public string Comment { get; set; } // Nhận xét

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Thời gian tạo nhận xét

    public Property Property { get; set; } // Tham chiếu đến bất động sản
    public User User { get; set; } // Tham chiếu đến người dùng

}
