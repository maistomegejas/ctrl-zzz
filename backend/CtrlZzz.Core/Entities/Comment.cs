namespace CtrlZzz.Core.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid WorkItemId { get; set; }
    public WorkItem WorkItem { get; set; } = null!;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
