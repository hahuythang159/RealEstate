using System.ComponentModel.DataAnnotations;

public class Favorite
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid  UserId { get; set; } // Khóa ngoại đến người dùng

    [Required]
    public Guid  PropertyId { get; set; } // Khóa ngoại đến bất động sản
}
