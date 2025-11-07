namespace CtrlZzz.Core.Features.Projects.DTOs;

public class CreateProjectDto
{
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string? Description { get; set; }
}
