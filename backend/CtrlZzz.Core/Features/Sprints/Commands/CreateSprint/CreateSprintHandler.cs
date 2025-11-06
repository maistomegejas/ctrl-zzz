using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Sprints.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Sprints.Commands.CreateSprint;

public class CreateSprintHandler : IRequestHandler<CreateSprintCommand, Result<SprintDto>>
{
    private readonly IRepository<Sprint> _sprintRepository;
    private readonly IRepository<Project> _projectRepository;

    public CreateSprintHandler(
        IRepository<Sprint> sprintRepository,
        IRepository<Project> projectRepository)
    {
        _sprintRepository = sprintRepository;
        _projectRepository = projectRepository;
    }

    public async Task<Result<SprintDto>> Handle(CreateSprintCommand request, CancellationToken cancellationToken)
    {
        // Validate project exists
        var projectExists = await _projectRepository.ExistsAsync(request.ProjectId, cancellationToken);
        if (!projectExists)
        {
            return Result.Fail<SprintDto>("Project not found");
        }

        var sprint = new Sprint
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Goal = request.Goal,
            EndDate = request.EndDate,
            ProjectId = request.ProjectId,
            IsActive = false,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        await _sprintRepository.AddAsync(sprint, cancellationToken);

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
