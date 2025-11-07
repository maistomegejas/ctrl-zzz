using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.WorkItems.Commands.DeleteWorkItem;

public class DeleteWorkItemHandler : IRequestHandler<DeleteWorkItemCommand, Result>
{
    private readonly IRepository<WorkItem> _workItemRepository;
    private readonly IRepository<ProjectMember> _projectMemberRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public DeleteWorkItemHandler(
        IRepository<WorkItem> workItemRepository,
        IRepository<ProjectMember> projectMemberRepository,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _workItemRepository = workItemRepository;
        _projectMemberRepository = projectMemberRepository;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<Result> Handle(DeleteWorkItemCommand request, CancellationToken cancellationToken)
    {
        var workItem = await _workItemRepository.GetByIdAsync(request.Id, cancellationToken);

        if (workItem == null)
        {
            return Result.Fail("Work item not found");
        }

        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail("User not authenticated");
        }

        // Check if user is a project member OR has admin permission
        var hasAdminPermission = await _permissionService.HasPermissionAsync(currentUserId.Value, "Admin.AccessAdminPanel");

        if (!hasAdminPermission)
        {
            var projectMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);
            var isMember = projectMembers.Any(pm =>
                pm.ProjectId == workItem.ProjectId &&
                pm.UserId == currentUserId.Value &&
                !pm.IsDeleted);

            if (!isMember)
            {
                return Result.Fail("You must be a project member to delete work items");
            }
        }

        await _workItemRepository.DeleteAsync(workItem, cancellationToken);

        return Result.Ok();
    }
}
