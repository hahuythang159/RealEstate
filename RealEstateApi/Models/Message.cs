// using System;
// using System.ComponentModel.DataAnnotations;

// public class Message
// {
//     public int Id { get; set; } // Định danh duy nhất

//     [Required]
//     public int SenderId { get; set; } // Khóa ngoại đến người gửi

//     [Required]
//     public int ReceiverId { get; set; } // Khóa ngoại đến người nhận

//     [Required]
//     [StringLength(1000, ErrorMessage = "Nội dung tin nhắn không vượt quá 1000 ký tự")]
//     public string Content { get; set; } // Nội dung tin nhắn

//     [Required]
//     public DateTime Timestamp { get; set; } = DateTime.UtcNow; // Thời gian gửi

//     public User Sender { get; set; } // Tham chiếu đến người gửi
//     public User Receiver { get; set; } // Tham chiếu đến người nhận

//     // Optional: thêm thuộc tính trạng thái
//     public bool IsRead { get; set; } = false; // Trạng thái đã đọc
// }
