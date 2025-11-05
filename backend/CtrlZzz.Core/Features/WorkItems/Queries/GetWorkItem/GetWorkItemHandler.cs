using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Queries.GetWorkItem;

public class GetWorkItemHandler : IRequestHandler<GetWorkItemQuery, Result<WorkItemDto>>
{
    private readonly IRepository<WorkItem> _workItemRepository;

    public GetWorkItemHandler(IRepository<WorkItem> workItemRepository)
    {
        _workItemRepository = workItemRepository;
    }

    public async Task<Result<WorkItemDto>> Handle(GetWorkItemQuery request, CancellationToken cancellationToken)
    {
        var workItem = await _workItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (workItem == null)
        {
            return Result.Fail<WorkItemDto>("Work item not found");
        }

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
