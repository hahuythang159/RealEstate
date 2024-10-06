using System.ComponentModel.DataAnnotations;

namespace RealEstateApi.Models
{
    public class Tenant
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid  UserId { get; set; } // Khóa ngoại đến người dùng

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } // Tên đầy đủ của người thuê

        [Required]
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; } // Số điện thoại của người thuê

        // Thêm các thuộc tính khác nếu cần
    }
}
