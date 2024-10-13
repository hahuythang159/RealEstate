using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RealEstateApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


public class Rental
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid PropertyId { get; set; }

    [ForeignKey("PropertyId")]
    public virtual Property? Property { get; set; }

    [Required]
    public Guid TenantId { get; set; }

    [Required]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime StartDate { get; set; } = DateTime.Now;

    [Required]
    [DataType(DataType.DateTime)]
    [Range(typeof(DateTime), "01/01/2020", "12/31/2030", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu.")]
    public DateTime EndDate { get; set; } // Ngày kết thúc thuê

    [Required]
    [StringLength(20)]
    public RentalStatus Status { get; set; } = RentalStatus.Active;

    [Required]
    [StringLength(100)]
    public string? PaymentMethod { get; set; }

    [NotMapped]
    public decimal RentPrice => Property?.Price ?? 0;

    // Đây là thuộc tính điều hướng đến đối tượng Tenant
    public virtual User Tenant { get; set; }
}

[JsonConverter(typeof(StringEnumConverter))]

public enum RentalStatus
{
    Active,
    Inactive,
    Completed
}

