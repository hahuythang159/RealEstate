using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Province
{
    [Key]
    public int Id { get; set; }  // Id tỉnh
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public virtual ICollection<District> Districts { get; set; } = new List<District>();  // Đảm bảo là ICollection
}