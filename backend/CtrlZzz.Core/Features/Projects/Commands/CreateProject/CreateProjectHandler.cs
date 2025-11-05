using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.CreateProject;

public class CreateProjectHandler : IRequestHandler<CreateProjectCommand, Result<ProjectDto>>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<User> _userRepository;

    public CreateProjectHandler(IRepository<Project> projectRepository, IRepository<User> userRepository)
    {
        _projectRepository = projectRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        // Check if owner exists
        var ownerExists = await _userRepository.ExistsAsync(request.OwnerId, cancellationToken);
        if (!ownerExists)
        {
            return Result.Fail<ProjectDto>("Owner user not found");
        }

        // Create project
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Key = request.Key,
            Description = request.Description,
            OwnerId = request.OwnerId,
            CreatedAt = DateTime.UtcNow
        };

        await _projectRepository.AddAsync(project, cancellationToken);

        // Map to DTO
        var dto = new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Key = project.Key,
            Description = project.Description,
            OwnerId = project.OwnerId,
            CreatedAt = project.CreatedAt,
            UpdatedAt = project.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
