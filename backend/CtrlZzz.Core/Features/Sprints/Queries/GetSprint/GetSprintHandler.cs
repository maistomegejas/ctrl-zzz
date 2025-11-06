using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Sprints.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Queries.GetSprint;

public class GetSprintHandler : IRequestHandler<GetSprintQuery, Result<SprintDto>>
{
    private readonly IRepository<Sprint> _sprintRepository;

    public GetSprintHandler(IRepository<Sprint> sprintRepository)
    {
        _sprintRepository = sprintRepository;
    }

    public async Task<Result<SprintDto>> Handle(GetSprintQuery request, CancellationToken cancellationToken)
    {
        var sprint = await _sprintRepository.GetByIdAsync(request.Id, cancellationToken);
        if (sprint == null)
        {
            return Result.Fail<SprintDto>("Sprint not found");
        }

        var dto = new SprintDto
        {
            Id = sprint.Id,
            Name = sprint.Name,
            Goal = sprint.Goal,
            StartDate = sprint.StartDate,
            EndDate = sprint.EndDate,
            IsActive = sprint.IsActive,
            IsCompleted = sprint.IsCompleted,
            ProjectId = sprint.ProjectId,
            CreatedAt = sprint.CreatedAt,
            UpdatedAt = sprint.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
