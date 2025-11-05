using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.DeleteWorkItem;

public record DeleteWorkItemCommand(Guid Id) : IRequest<Result>;
