using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.DeleteSprint;

public record DeleteSprintCommand(Guid Id) : IRequest<Result>;
