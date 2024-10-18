using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

public class Property
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required]
    [StringLength(500, ErrorMessage = "Tiêu đề không vượt quá 200 ký tự.")]
    public string Title { get; set; } = string.Empty; 

    [Required]
    [StringLength(200, ErrorMessage = "Địa chỉ không vượt quá 200 ký tự.")]
    public string Address { get; set; } = string.Empty;  

    [Required]
    [StringLength(1000, ErrorMessage = "Mô tả không vượt quá 1000 ký tự.")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    public Guid OwnerId { get; set; }

    // Sử dụng Id thay vì object đầy đủ cho Province, District, và Ward
    public int? ProvinceId { get; set; } 

    public int? DistrictId { get; set; } 

    public int? WardId { get; set; }

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
    public string PropertyType { get; set; } = string.Empty; 

    [Required]
    [StringLength(100, ErrorMessage = "Loại hình sử dụng không vượt quá 100 ký tự.")]
    public string Interior { get; set; } = string.Empty; 

    [Required]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime PostedDate { get; set; } = DateTime.Now; // Thời gian thực tế
    public bool IsHidden { get; set; } = false;

    [JsonIgnore]
    public virtual Province? Province { get; set; } 

    [JsonIgnore]
    public virtual District? District { get; set; }  

    [JsonIgnore]
    public virtual Ward? Ward { get; set; }
    
    [JsonIgnore]
    public virtual ICollection<Rental> Rentals { get; set; } = new List<Rental>();

    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
