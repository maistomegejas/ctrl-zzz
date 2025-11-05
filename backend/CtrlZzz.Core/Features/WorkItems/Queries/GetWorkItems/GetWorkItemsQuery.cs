using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Queries.GetWorkItems;

public record GetWorkItemsQuery(
    Guid? ProjectId = null,
    WorkItemStatus? Status = null,
    Guid? AssigneeId = null
) : IRequest<Result<List<WorkItemDto>>>;
