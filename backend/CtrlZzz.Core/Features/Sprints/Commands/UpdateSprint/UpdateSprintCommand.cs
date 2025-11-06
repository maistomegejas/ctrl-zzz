using CtrlZzz.Core.Features.Sprints.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.UpdateSprint;

public record UpdateSprintCommand(
    Guid Id,
    string Name,
    string? Goal,
    DateTime? EndDate
) : IRequest<Result<SprintDto>>;
