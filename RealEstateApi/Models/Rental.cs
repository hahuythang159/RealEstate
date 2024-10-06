using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RealEstateApi.Models; 

public class Rental
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid  PropertyId { get; set; } // Khóa ngoại đến bất động sản

    [ForeignKey("PropertyId")]
    public virtual Property Property { get; set; } // Điều hướng đến Property

    [Required]
    public Guid  TenantId { get; set; } // Khóa ngoại đến người thuê (người dùng)

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime StartDate { get; set; } // Ngày bắt đầu thuê

    [Required]
    [DataType(DataType.DateTime)]
    [Range(typeof(DateTime), "01/01/2020", "12/31/2030", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu.")]
    public DateTime EndDate { get; set; } // Ngày kết thúc thuê

    [Required]
    [StringLength(20)]
    public string Status { get; set; } // Trạng thái thuê
    
    // Đây là thuộc tính điều hướng đến đối tượng Tenant
    public User Tenant { get; set; } // Đối tượng liên kết đến User/Tenant
}
