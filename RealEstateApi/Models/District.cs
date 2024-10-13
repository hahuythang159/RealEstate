using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class District
{
    [Key]
    public int Id { get; set; }  // Id quận/huyện
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [ForeignKey("Province")]
    public int ProvinceId { get; set; }
    public virtual Province Province { get; set; } = null!;

    public virtual ICollection<Ward> Wards { get; set; } = new List<Ward>();
    public virtual ICollection<Property> Properties { get; set; } = new List<Property>();

}

