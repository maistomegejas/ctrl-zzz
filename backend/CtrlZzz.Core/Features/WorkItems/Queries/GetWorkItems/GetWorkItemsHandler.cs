using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Queries.GetWorkItems;

public class GetWorkItemsHandler : IRequestHandler<GetWorkItemsQuery, Result<List<WorkItemDto>>>
{
    private readonly IRepository<WorkItem> _workItemRepository;

    public GetWorkItemsHandler(IRepository<WorkItem> workItemRepository)
    {
        _workItemRepository = workItemRepository;
    }

    public async Task<Result<List<WorkItemDto>>> Handle(GetWorkItemsQuery request, CancellationToken cancellationToken)
    {
        var workItems = await _workItemRepository.GetAllAsync(cancellationToken);

        // Apply filters
        if (request.ProjectId.HasValue)
        {
            workItems = workItems.Where(w => w.ProjectId == request.ProjectId.Value).ToList();
        }

        if (request.Status.HasValue)
        {
            workItems = workItems.Where(w => w.Status == request.Status.Value).ToList();
        }

        if (request.AssigneeId.HasValue)
        {
            workItems = workItems.Where(w => w.AssigneeId == request.AssigneeId.Value).ToList();
        }

        var dtos = workItems.Select(w => new WorkItemDto
        {
            Id = w.Id,
            Title = w.Title,
            Description = w.Description,
            Type = w.Type,
            Status = w.Status,
            Priority = w.Priority,
            StoryPoints = w.StoryPoints,
            OriginalEstimateMinutes = w.OriginalEstimateMinutes,
            RemainingEstimateMinutes = w.RemainingEstimateMinutes,
            TimeLoggedMinutes = w.TimeLoggedMinutes,
            ProjectId = w.ProjectId,
            AssigneeId = w.AssigneeId,
            ParentId = w.ParentId,
            CreatedAt = w.CreatedAt,
            UpdatedAt = w.UpdatedAt
        }).ToList();

        return Result.Ok(dtos);
    }
}
