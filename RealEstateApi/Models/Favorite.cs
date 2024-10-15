using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

public class Favorite
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [ForeignKey("User")]
    public Guid UserId { get; set; } 

    [Required]
    [ForeignKey("Property")] 
    public Guid PropertyId { get; set; } 

    [JsonIgnore]
    public virtual User? User { get; set; }

    [JsonIgnore]
    public virtual Property? Property { get; set; }
}
