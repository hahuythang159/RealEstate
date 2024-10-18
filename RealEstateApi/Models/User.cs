using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using RealEstateApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Avatar { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên người dùng phải từ 3 đến 50 ký tự")]
    public string UserName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string PhoneNumber { get; set; } = string.Empty;

    public bool IsTwoFactorEnabled { get; set; } = false; // 2FA

    public bool IsActive { get; set; } = true;

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; } = DateTime.Now;


    public virtual ICollection<Rental>? Rentals { get; set; } = new List<Rental>(); 
    public virtual ICollection<Comment>? UserComments { get; set; } = new List<Comment>(); // Đặt tên rõ ràng
    public virtual ICollection<Favorite> UserFavorites { get; set; } = new List<Favorite>(); // Danh sách yêu thích



    // Thêm mối quan hệ nếu cần
    public ICollection<Review> Reviews { get; set; } = new List<Review>(); // Đánh giá của người dùng
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>(); // Đặt chỗ của người dùng

}
