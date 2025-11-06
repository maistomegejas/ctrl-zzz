using CtrlZzz.Core.Features.Sprints.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.CompleteSprint;

public record CompleteSprintCommand(Guid Id) : IRequest<Result<SprintDto>>;
