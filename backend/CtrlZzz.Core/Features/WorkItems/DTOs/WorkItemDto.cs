using CtrlZzz.Core.Enums;

namespace CtrlZzz.Core.Features.WorkItems.DTOs;

public class WorkItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkItemType Type { get; set; }
    public WorkItemStatus Status { get; set; }
    public Priority Priority { get; set; }
    public int? StoryPoints { get; set; }
    public int? OriginalEstimateMinutes { get; set; }
    public int? RemainingEstimateMinutes { get; set; }
    public int? TimeLoggedMinutes { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? ReporterId { get; set; }
    public Guid? ParentId { get; set; }
    public Guid? SprintId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
