using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Property
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(200, ErrorMessage = "Địa chỉ không vượt quá 200 ký tự.")]
    public string Address { get; set; } = string.Empty;  // Số nhà hoặc tên đường

    [Required]
    [StringLength(1000, ErrorMessage = "Mô tả không vượt quá 1000 ký tự.")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    public Guid OwnerId { get; set; }

    [Required]
    [ForeignKey("Province")]
    public int ProvinceId { get; set; }  // Liên kết với tỉnh
    public virtual Province Province { get; set; }

    [Required]
    [ForeignKey("District")]
    public int DistrictId { get; set; }  // Liên kết với huyện
    public virtual District District { get; set; }

    [Required]
    [ForeignKey("Ward")]
    public int WardId { get; set; }  // Liên kết với xã
    public virtual Ward Ward { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "URL hình ảnh không vượt quá 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    [Range(0, int.MaxValue)]
    public int Bedrooms { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Bathrooms { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public double Area { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Loại hình bất động sản không vượt quá 100 ký tự.")]
    public string PropertyType { get; set; } = string.Empty; // Căn hộ, nhà phố, đất nền, v.v.

    [Required]
    [StringLength(100, ErrorMessage = "Loại hình sử dụng không vượt quá 100 ký tự.")]
    public string UsageType { get; set; } = string.Empty; // Loại hình sử dụng (Ví dụ: cho thuê, bán)

    public virtual ICollection<Rental>? Rentals { get; set; } // Thuộc tính điều hướng cho Rental

    // Thêm các trường tên tỉnh, huyện, xã
    [NotMapped]
    public string ProvinceName { get; set; } = string.Empty; // Tên tỉnh

    [NotMapped]
    public string DistrictName { get; set; } = string.Empty; // Tên huyện

    [NotMapped]
    public string WardName { get; set; } = string.Empty; // Tên xã
}
