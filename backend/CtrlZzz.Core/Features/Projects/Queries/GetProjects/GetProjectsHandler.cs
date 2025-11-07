using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProjects;

public class GetProjectsHandler : IRequestHandler<GetProjectsQuery, Result<List<ProjectDto>>>
{
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<ProjectMember> _projectMemberRepository;
    private readonly IPermissionService _permissionService;

    public GetProjectsHandler(
        IRepository<Project> projectRepository,
        IRepository<ProjectMember> projectMemberRepository,
        IPermissionService permissionService)
    {
        _projectRepository = projectRepository;
        _projectMemberRepository = projectMemberRepository;
        _permissionService = permissionService;
    }

    public async Task<Result<List<ProjectDto>>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        // Check if user has admin permission to view all projects
        var hasAdminPermission = await _permissionService.HasPermissionAsync(request.UserId, "Projects.ViewAll");

        IEnumerable<Project> projects;

        if (hasAdminPermission)
        {
            // Admin can see all projects
            projects = await _projectRepository.GetAllAsync(cancellationToken);
        }
        else
        {
            // Regular users can only see projects they are members of
            var projectMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);
            var userProjectIds = projectMembers
                .Where(pm => pm.UserId == request.UserId && !pm.IsDeleted)
                .Select(pm => pm.ProjectId)
                .ToHashSet();

            var allProjects = await _projectRepository.GetAllAsync(cancellationToken);
            projects = allProjects.Where(p => userProjectIds.Contains(p.Id));
        }

        var dtos = projects.Select(p => new ProjectDto
        {
            Id = p.Id,
            Name = p.Name,
            Key = p.Key,
            Description = p.Description,
            OwnerId = p.OwnerId,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        }).ToList();

        return Result.Ok(dtos);
    }
}
