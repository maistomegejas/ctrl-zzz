namespace CtrlZzz.Core.Entities;

public class Group : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? ProjectId { get; set; } // Null = company-wide group
    public Project? Project { get; set; }

    // Navigation properties
    public ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();
}
