using CtrlZzz.Core.Enums;

namespace CtrlZzz.Core.Entities;

public class WorkItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkItemType Type { get; set; }
    public WorkItemStatus Status { get; set; }
    public Priority Priority { get; set; }

    // Story points for estimation
    public int? StoryPoints { get; set; }

    // Time tracking
    public int? OriginalEstimateMinutes { get; set; }
    public int? RemainingEstimateMinutes { get; set; }
    public int? TimeLoggedMinutes { get; set; }

    // Project relation
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    // Assignee
    public Guid? AssigneeId { get; set; }
    public User? Assignee { get; set; }

    // Parent-child relationship for subtasks
    public Guid? ParentId { get; set; }
    public WorkItem? Parent { get; set; }
    public ICollection<WorkItem> Children { get; set; } = new List<WorkItem>();
}
