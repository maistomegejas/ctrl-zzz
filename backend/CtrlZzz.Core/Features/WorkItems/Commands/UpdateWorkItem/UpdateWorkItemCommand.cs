using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.UpdateWorkItem;

public record UpdateWorkItemCommand(
    Guid Id,
    string Title,
    string? Description,
    WorkItemStatus Status,
    Priority Priority,
    int? StoryPoints,
    int? OriginalEstimateMinutes,
    int? RemainingEstimateMinutes,
    int? TimeLoggedMinutes,
    Guid? AssigneeId,
    Guid? SprintId
) : IRequest<Result<WorkItemDto>>;
