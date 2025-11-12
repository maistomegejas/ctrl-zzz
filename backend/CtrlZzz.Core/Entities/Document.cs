namespace CtrlZzz.Core.Entities;

public class Document : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
