using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Sprints.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Queries.GetSprints;

public class GetSprintsHandler : IRequestHandler<GetSprintsQuery, Result<List<SprintDto>>>
{
    private readonly IRepository<Sprint> _sprintRepository;

    public GetSprintsHandler(IRepository<Sprint> sprintRepository)
    {
        _sprintRepository = sprintRepository;
    }

    public async Task<Result<List<SprintDto>>> Handle(GetSprintsQuery request, CancellationToken cancellationToken)
    {
        var sprints = await _sprintRepository.GetAllAsync(cancellationToken);

        // Filter by project
        var filteredSprints = sprints.Where(s => s.ProjectId == request.ProjectId).ToList();

        var dtos = filteredSprints.Select(s => new SprintDto
        {
            Id = s.Id,
            Name = s.Name,
            Goal = s.Goal,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            IsActive = s.IsActive,
            IsCompleted = s.IsCompleted,
            ProjectId = s.ProjectId,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        }).ToList();

        return Result.Ok(dtos);
    }
}
