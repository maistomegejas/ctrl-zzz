namespace CtrlZzz.Core.Features.Sprints.DTOs;

public class UpdateSprintDto
{
    public string Name { get; set; } = string.Empty;
    public string? Goal { get; set; }
    public DateTime? EndDate { get; set; }
}
