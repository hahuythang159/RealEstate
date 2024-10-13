using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using RealEstateApi.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên người dùng phải từ 3 đến 50 ký tự")]
    public string UserName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty; // Lưu mật khẩu dưới dạng mã hóa

    [Required]
    public string Role { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    public string PhoneNumber { get; set; } = string.Empty;

    public bool IsTwoFactorEnabled { get; set; } = false; // 2FA

    public bool IsActive { get; set; } = true;

    public virtual ICollection<Rental>? Rentals { get; set; } = new List<Rental>(); 
    public virtual ICollection<Comment>? Comment { get; set; } 



    // Các mối quan hệ với Message
    // public ICollection<Message> SentMessages { get; set; } = new List<Message>(); // Tin nhắn đã gửi
    // public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>(); // Tin nhắn đã nhận

    // Thêm mối quan hệ nếu cần
    public ICollection<Review> Reviews { get; set; } = new List<Review>(); // Đánh giá của người dùng
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>(); // Đặt chỗ của người dùng
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>(); // Danh sách yêu thích

}
