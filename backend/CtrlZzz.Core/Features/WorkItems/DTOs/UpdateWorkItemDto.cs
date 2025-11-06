using CtrlZzz.Core.Enums;

namespace CtrlZzz.Core.Features.WorkItems.DTOs;

public class UpdateWorkItemDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public WorkItemStatus Status { get; set; }
    public Priority Priority { get; set; }
    public int? StoryPoints { get; set; }
    public int? OriginalEstimateMinutes { get; set; }
    public int? RemainingEstimateMinutes { get; set; }
    public int? TimeLoggedMinutes { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? SprintId { get; set; }
}
