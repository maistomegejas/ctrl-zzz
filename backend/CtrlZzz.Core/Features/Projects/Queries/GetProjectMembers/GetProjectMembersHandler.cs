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

    public GetProjectMembersHandler(
        IRepository<ProjectMember> projectMemberRepository,
        IRepository<User> userRepository)
    {
        _projectMemberRepository = projectMemberRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<List<ProjectMemberDto>>> Handle(GetProjectMembersQuery request, CancellationToken cancellationToken)
    {
        var allMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);
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
