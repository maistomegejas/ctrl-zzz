using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Sprints.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.StartSprint;

public class StartSprintHandler : IRequestHandler<StartSprintCommand, Result<SprintDto>>
{
    private readonly IRepository<Sprint> _sprintRepository;

    public StartSprintHandler(IRepository<Sprint> sprintRepository)
    {
        _sprintRepository = sprintRepository;
    }

    public async Task<Result<SprintDto>> Handle(StartSprintCommand request, CancellationToken cancellationToken)
    {
        var sprint = await _sprintRepository.GetByIdAsync(request.Id, cancellationToken);
        if (sprint == null)
        {
            return Result.Fail<SprintDto>("Sprint not found");
        }

        if (sprint.IsActive)
        {
            return Result.Fail<SprintDto>("Sprint is already active");
        }

        if (sprint.IsCompleted)
        {
            return Result.Fail<SprintDto>("Cannot start a completed sprint");
        }

        sprint.IsActive = true;
        sprint.StartDate = DateTime.UtcNow;

        await _sprintRepository.UpdateAsync(sprint, cancellationToken);

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
