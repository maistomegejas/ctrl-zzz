using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.CreateWorkItem;

public record CreateWorkItemCommand(
    string Title,
    string? Description,
    WorkItemType Type,
    Priority Priority,
    int? StoryPoints,
    Guid ProjectId,
    Guid? AssigneeId,
    Guid? ParentId,
    Guid? SprintId
) : IRequest<Result<WorkItemDto>>;
