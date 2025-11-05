using CtrlZzz.Core.Enums;

namespace CtrlZzz.Core.Features.WorkItems.DTOs;

public class CreateWorkItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkItemType Type { get; set; }
    public Priority Priority { get; set; }
    public int? StoryPoints { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? ParentId { get; set; }
}
