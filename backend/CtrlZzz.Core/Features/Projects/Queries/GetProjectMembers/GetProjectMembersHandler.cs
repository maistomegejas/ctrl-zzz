using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProjectMembers;

public class GetProjectMembersHandler : IRequestHandler<GetProjectMembersQuery, Result<List<ProjectMemberDto>>>
{
    private readonly IRepository<ProjectMember> _projectMemberRepository;
    private readonly IRepository<User> _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public GetProjectMembersHandler(
        IRepository<ProjectMember> projectMemberRepository,
        IRepository<User> userRepository,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _projectMemberRepository = projectMemberRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<Result<List<ProjectMemberDto>>> Handle(GetProjectMembersQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail<List<ProjectMemberDto>>("User not authenticated");
        }

        var allMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);

        // Check if user is a project member OR has admin permission
        var hasAdminPermission = await _permissionService.HasPermissionAsync(currentUserId.Value, "Admin.AccessAdminPanel");

        if (!hasAdminPermission)
        {
            var isMember = allMembers.Any(pm =>
                pm.ProjectId == request.ProjectId &&
                pm.UserId == currentUserId.Value &&
                !pm.IsDeleted);

            if (!isMember)
            {
                return Result.Fail<List<ProjectMemberDto>>("You must be a project member to view members");
            }
        }

        var projectMembers = allMembers
            .Where(pm => pm.ProjectId == request.ProjectId && !pm.IsDeleted)
            .ToList();

        var allUsers = await _userRepository.GetAllAsync(cancellationToken);

        var dtos = projectMembers.Select(pm =>
        {
            var user = allUsers.FirstOrDefault(u => u.Id == pm.UserId);
            return new ProjectMemberDto
            {
                Id = pm.Id,
                ProjectId = pm.ProjectId,
                UserId = pm.UserId,
                UserName = user?.Name ?? "Unknown",
                UserEmail = user?.Email ?? "Unknown",
                CreatedAt = pm.CreatedAt
            };
        }).ToList();

        return Result.Ok(dtos);
    }
}
