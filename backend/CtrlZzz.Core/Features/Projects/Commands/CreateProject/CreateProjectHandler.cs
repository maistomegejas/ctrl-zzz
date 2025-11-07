using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.CreateProject;

public class CreateProjectHandler : IRequestHandler<CreateProjectCommand, Result<ProjectDto>>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<ProjectMember> _projectMemberRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateProjectHandler(
        IRepository<Project> projectRepository,
        IRepository<ProjectMember> projectMemberRepository,
        ICurrentUserService currentUserService)
    {
        _projectRepository = projectRepository;
        _projectMemberRepository = projectMemberRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Result<ProjectDto>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        // Get current user ID
        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail<ProjectDto>("User not authenticated");
        }

        // Create project with current user as owner
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Key = request.Key,
            Description = request.Description,
            OwnerId = currentUserId.Value,
            CreatedAt = DateTime.UtcNow
        };

        await _projectRepository.AddAsync(project, cancellationToken);

        // Auto-add project owner as member
        var projectMember = new ProjectMember
        {
            Id = Guid.NewGuid(),
            ProjectId = project.Id,
            UserId = currentUserId.Value,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _projectMemberRepository.AddAsync(projectMember, cancellationToken);

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
