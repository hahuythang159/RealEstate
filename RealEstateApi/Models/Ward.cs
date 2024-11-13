using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


public class Ward
{
    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [ForeignKey("District")]
    public int DistrictId { get; set; }
    public virtual District District { get; set; } = null!;

    public virtual ICollection<Property> Properties { get; set; } = new List<Property>();

}
