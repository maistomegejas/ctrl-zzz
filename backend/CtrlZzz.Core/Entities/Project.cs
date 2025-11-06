namespace CtrlZzz.Core.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty; // e.g., "PROJ", "TEST"
    public string? Description { get; set; }

    // Owner
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    // Navigation properties
    public ICollection<WorkItem> WorkItems { get; set; } = new List<WorkItem>();
    public ICollection<ProjectMember> ProjectMembers { get; set; } = new List<ProjectMember>();
}
