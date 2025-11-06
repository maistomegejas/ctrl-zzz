using CtrlZzz.Core.Features.Sprints.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.CreateSprint;

public record CreateSprintCommand(
    string Name,
    string? Goal,
    DateTime? EndDate,
    Guid ProjectId
) : IRequest<Result<SprintDto>>;
