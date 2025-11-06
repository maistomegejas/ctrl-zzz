using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Sprints.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.CompleteSprint;

public class CompleteSprintHandler : IRequestHandler<CompleteSprintCommand, Result<SprintDto>>
{
    private readonly IRepository<Sprint> _sprintRepository;

    public CompleteSprintHandler(IRepository<Sprint> sprintRepository)
    {
        _sprintRepository = sprintRepository;
    }

    public async Task<Result<SprintDto>> Handle(CompleteSprintCommand request, CancellationToken cancellationToken)
    {
        var sprint = await _sprintRepository.GetByIdAsync(request.Id, cancellationToken);
        if (sprint == null)
        {
            return Result.Fail<SprintDto>("Sprint not found");
        }

        if (sprint.IsCompleted)
        {
            return Result.Fail<SprintDto>("Sprint is already completed");
        }

        if (!sprint.IsActive)
        {
            return Result.Fail<SprintDto>("Cannot complete a sprint that hasn't been started");
        }

        sprint.IsActive = false;
        sprint.IsCompleted = true;

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
