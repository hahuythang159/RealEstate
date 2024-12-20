using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using RealEstateApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;


public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string AvatarUrl { get; set; } = string.Empty;

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

    public bool IsTwoFactorEnabled { get; set; } = false;

    public bool IsActive { get; set; } = true;

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public string OwnerIntroduction { get; set; } = string.Empty;
    public string OwnerAdditionalInfo { get; set; } = string.Empty;


    public virtual ICollection<Rental>? Rentals { get; set; }
    public virtual ICollection<Comment>? UserComments { get; set; }
    public virtual ICollection<Favorite>? UserFavorites { get; set; }
    public virtual ICollection<Review> ReviewsWritten { get; set; } = new List<Review>();
    public virtual ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();

    [JsonIgnore]
    public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
}
