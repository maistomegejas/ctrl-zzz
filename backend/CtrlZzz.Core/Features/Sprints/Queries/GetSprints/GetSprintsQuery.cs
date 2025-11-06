using CtrlZzz.Core.Features.Sprints.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Queries.GetSprints;

public record GetSprintsQuery(Guid ProjectId) : IRequest<Result<List<SprintDto>>>;
