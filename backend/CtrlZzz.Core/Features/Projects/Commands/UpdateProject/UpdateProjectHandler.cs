using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.UpdateProject;

public class UpdateProjectHandler : IRequestHandler<UpdateProjectCommand, Result<ProjectDto>>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public UpdateProjectHandler(
        IRepository<Project> projectRepository,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _projectRepository = projectRepository;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<Result<ProjectDto>> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
        {
            return Result.Fail<ProjectDto>("Project not found");
        }

        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail<ProjectDto>("User not authenticated");
        }

        // Check if user is the project owner OR has admin permission
        var isOwner = project.OwnerId == currentUserId.Value;
        var isAdmin = await _permissionService.HasPermissionAsync(currentUserId.Value, "Admin.AccessAdminPanel");

        if (!isOwner && !isAdmin)
        {
            return Result.Fail<ProjectDto>("Only the project owner or admins can edit this project");
        }

        // Update fields
        project.Name = request.Name;
        project.Description = request.Description;
        project.UpdatedAt = DateTime.UtcNow;

        await _projectRepository.UpdateAsync(project, cancellationToken);

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
