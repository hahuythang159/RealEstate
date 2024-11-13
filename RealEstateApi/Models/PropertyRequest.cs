public class PropertyRequest
{
    public Property Property { get; set; } = null!;
    
    public List<IFormFile> Images { get; set; } = new List<IFormFile>();
}
