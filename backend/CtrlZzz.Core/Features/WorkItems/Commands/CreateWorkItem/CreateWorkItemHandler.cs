using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.CreateWorkItem;

public class CreateWorkItemHandler : IRequestHandler<CreateWorkItemCommand, Result<WorkItemDto>>
{
    private readonly IRepository<WorkItem> _workItemRepository;
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Sprint> _sprintRepository;

    public CreateWorkItemHandler(
        IRepository<WorkItem> workItemRepository,
        IRepository<Project> projectRepository,
        IRepository<User> userRepository,
        IRepository<Sprint> sprintRepository)
    {
        _workItemRepository = workItemRepository;
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _sprintRepository = sprintRepository;
    }

    public async Task<Result<WorkItemDto>> Handle(CreateWorkItemCommand request, CancellationToken cancellationToken)
    {
        // Validate project exists
        var projectExists = await _projectRepository.ExistsAsync(request.ProjectId, cancellationToken);
        if (!projectExists)
        {
            return Result.Fail<WorkItemDto>("Project not found");
        }

        // Validate assignee exists if provided
        if (request.AssigneeId.HasValue)
        {
            var assigneeExists = await _userRepository.ExistsAsync(request.AssigneeId.Value, cancellationToken);
            if (!assigneeExists)
            {
                return Result.Fail<WorkItemDto>("Assignee user not found");
            }
        }

        // Validate reporter exists if provided
        if (request.ReporterId.HasValue)
        {
            var reporterExists = await _userRepository.ExistsAsync(request.ReporterId.Value, cancellationToken);
            if (!reporterExists)
            {
                return Result.Fail<WorkItemDto>("Reporter user not found");
            }
        }

        // Validate parent exists if provided
        if (request.ParentId.HasValue)
        {
            var parentExists = await _workItemRepository.ExistsAsync(request.ParentId.Value, cancellationToken);
            if (!parentExists)
            {
                return Result.Fail<WorkItemDto>("Parent work item not found");
            }
        }

        // Validate sprint exists if provided
        if (request.SprintId.HasValue)
        {
            var sprintExists = await _sprintRepository.ExistsAsync(request.SprintId.Value, cancellationToken);
            if (!sprintExists)
            {
                return Result.Fail<WorkItemDto>("Sprint not found");
            }
        }

        // Create work item
        var workItem = new WorkItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            Status = WorkItemStatus.ToDo, // Default status
            Priority = request.Priority,
            StoryPoints = request.StoryPoints,
            ProjectId = request.ProjectId,
            AssigneeId = request.AssigneeId,
            ReporterId = request.ReporterId,
            ParentId = request.ParentId,
            SprintId = request.SprintId,
            CreatedAt = DateTime.UtcNow
        };

        await _workItemRepository.AddAsync(workItem, cancellationToken);

        // Map to DTO
        var dto = new WorkItemDto
        {
            Id = workItem.Id,
            Title = workItem.Title,
            Description = workItem.Description,
            Type = workItem.Type,
            Status = workItem.Status,
            Priority = workItem.Priority,
            StoryPoints = workItem.StoryPoints,
            OriginalEstimateMinutes = workItem.OriginalEstimateMinutes,
            RemainingEstimateMinutes = workItem.RemainingEstimateMinutes,
            TimeLoggedMinutes = workItem.TimeLoggedMinutes,
            ProjectId = workItem.ProjectId,
            AssigneeId = workItem.AssigneeId,
            ReporterId = workItem.ReporterId,
            ParentId = workItem.ParentId,
            SprintId = workItem.SprintId,
            CreatedAt = workItem.CreatedAt,
            UpdatedAt = workItem.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
