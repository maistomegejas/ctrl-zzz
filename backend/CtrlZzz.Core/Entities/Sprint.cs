namespace CtrlZzz.Core.Entities
{
    public class Sprint : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Goal { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsCompleted { get; set; }

        // Relationships
        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        public ICollection<WorkItem> WorkItems { get; set; } = new List<WorkItem>();
    }
}
