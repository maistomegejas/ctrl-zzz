using CtrlZzz.Core.Features.Sprints.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.StartSprint;

public record StartSprintCommand(Guid Id) : IRequest<Result<SprintDto>>;
