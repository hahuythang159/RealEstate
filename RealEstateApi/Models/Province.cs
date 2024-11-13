using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Province
{
    [Key]
    public int Id { get; set; }
    [StringLength(100)]
    public string? Name { get; set; }

    public virtual ICollection<District> Districts { get; set; } = new List<District>();
    public virtual ICollection<Property> Properties { get; set; } = new List<Property>();

}