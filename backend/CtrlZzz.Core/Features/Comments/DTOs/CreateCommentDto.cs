namespace CtrlZzz.Core.Features.Comments.DTOs;

public class CreateCommentDto
{
    public string Content { get; set; } = string.Empty;
    public Guid WorkItemId { get; set; }
}
