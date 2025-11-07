using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.RemoveProjectMember;

public class RemoveProjectMemberHandler : IRequestHandler<RemoveProjectMemberCommand, Result>
{
    private readonly IRepository<ProjectMember> _projectMemberRepository;

    public RemoveProjectMemberHandler(IRepository<ProjectMember> projectMemberRepository)
    {
        _projectMemberRepository = projectMemberRepository;
    }

    public async Task<Result> Handle(RemoveProjectMemberCommand request, CancellationToken cancellationToken)
    {
        var allMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);
        var projectMember = allMembers.FirstOrDefault(pm =>
            pm.ProjectId == request.ProjectId &&
            pm.UserId == request.UserId &&
            !pm.IsDeleted);

        if (projectMember == null)
        {
            return Result.Fail("Project member not found");
        }

        // Soft delete
        projectMember.IsDeleted = true;
        projectMember.UpdatedAt = DateTime.UtcNow;

        await _projectMemberRepository.UpdateAsync(projectMember, cancellationToken);

        return Result.Ok();
    }
}
