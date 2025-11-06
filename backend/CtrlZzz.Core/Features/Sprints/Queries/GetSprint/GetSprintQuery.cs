using CtrlZzz.Core.Features.Sprints.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Queries.GetSprint;

public record GetSprintQuery(Guid Id) : IRequest<Result<SprintDto>>;
