using CtrlZzz.Core.Features.WorkItems.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Queries.GetWorkItem;

public record GetWorkItemQuery(Guid Id) : IRequest<Result<WorkItemDto>>;
