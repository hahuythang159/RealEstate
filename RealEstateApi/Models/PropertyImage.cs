using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

public class PropertyImage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(500, ErrorMessage = "URL hình ảnh không vượt quá 500 ký tự.")]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    public Guid PropertyId { get; set; }

    [JsonIgnore]
    public virtual Property Property { get; set; } = null!;
}
