using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;


public class Booking
{   
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();  // Tạo UUID tự động khi khởi tạo Property

    [Required]
    public Guid  PropertyId { get; set; } // Khóa ngoại đến bất động sản

    [Required]
    public Guid  UserId { get; set; } // Khóa ngoại đến người dùng

    [Required]
    public DateTime BookingDate { get; set; } // Ngày đặt

    [Required]
    [DataType(DataType.Date)]
    public DateTime StartDate { get; set; } // Ngày bắt đầu thuê

    [Required]
    [DataType(DataType.Date)]
    public DateTime EndDate { get; set; } // Ngày kết thúc thuê

    [Required]
    [StringLength(20)]
    public string Status { get; set; } // Trạng thái đặt (confirmed/cancelled)
}

