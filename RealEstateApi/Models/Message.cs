// using System;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;

// public class Message
// {
//     [Key]
//     public Guid Id { get; set; } = Guid.NewGuid();

//     public string Content { get; set; } = string.Empty;

//     public Guid SenderId { get; set; }
//     public Guid ReceiverId { get; set; } 

//     [ForeignKey("SenderId")]
//     public virtual User? Sender { get; set; }

//     [ForeignKey("ReceiverId")]
//     public virtual User? Receiver { get; set; }

//     public DateTime SentAt { get; set; } = DateTime.Now;
// }
