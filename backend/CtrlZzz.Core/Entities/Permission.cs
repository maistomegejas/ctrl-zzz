namespace CtrlZzz.Core.Entities;

public class Permission : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Resource { get; set; } = string.Empty; // e.g., "Project", "WorkItem", "User"
    public string Action { get; set; } = string.Empty; // e.g., "Create", "Edit", "Delete"

    // Navigation properties
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
