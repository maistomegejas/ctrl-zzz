using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.DeleteProject;

public class DeleteProjectHandler : IRequestHandler<DeleteProjectCommand, Result>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public DeleteProjectHandler(
        IRepository<Project> projectRepository,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _projectRepository = projectRepository;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<Result> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
        {
            return Result.Fail("Project not found");
        }

        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail("User not authenticated");
        }

        // Check if user is the project owner OR has admin permission
        var isOwner = project.OwnerId == currentUserId.Value;
        var isAdmin = await _permissionService.HasPermissionAsync(currentUserId.Value, "Admin.AccessAdminPanel");

        if (!isOwner && !isAdmin)
        {
            return Result.Fail("Only the project owner or admins can delete this project");
        }

        await _projectRepository.DeleteAsync(project, cancellationToken);

        return Result.Ok();
    }
}
