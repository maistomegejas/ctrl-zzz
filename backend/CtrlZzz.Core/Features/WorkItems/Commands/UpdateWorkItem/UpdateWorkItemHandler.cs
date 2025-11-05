using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.UpdateWorkItem;

public class UpdateWorkItemHandler : IRequestHandler<UpdateWorkItemCommand, Result<WorkItemDto>>
{
    private readonly IRepository<WorkItem> _workItemRepository;
    private readonly IRepository<User> _userRepository;

    public UpdateWorkItemHandler(IRepository<WorkItem> workItemRepository, IRepository<User> userRepository)
    {
        _workItemRepository = workItemRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<WorkItemDto>> Handle(UpdateWorkItemCommand request, CancellationToken cancellationToken)
    {
        var workItem = await _workItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (workItem == null)
        {
            return Result.Fail<WorkItemDto>("Work item not found");
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

        // Update fields
        workItem.Title = request.Title;
        workItem.Description = request.Description;
        workItem.Status = request.Status;
        workItem.Priority = request.Priority;
        workItem.StoryPoints = request.StoryPoints;
        workItem.OriginalEstimateMinutes = request.OriginalEstimateMinutes;
        workItem.RemainingEstimateMinutes = request.RemainingEstimateMinutes;
        workItem.TimeLoggedMinutes = request.TimeLoggedMinutes;
        workItem.AssigneeId = request.AssigneeId;
        workItem.UpdatedAt = DateTime.UtcNow;

        await _workItemRepository.UpdateAsync(workItem, cancellationToken);

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
            ParentId = workItem.ParentId,
            CreatedAt = workItem.CreatedAt,
            UpdatedAt = workItem.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
