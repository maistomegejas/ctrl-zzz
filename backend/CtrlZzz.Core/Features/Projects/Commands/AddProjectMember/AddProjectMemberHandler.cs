using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.AddProjectMember;

public class AddProjectMemberHandler : IRequestHandler<AddProjectMemberCommand, Result>
{
    private readonly IRepository<ProjectMember> _projectMemberRepository;
    private readonly IRepository<Project> _projectRepository;
    private readonly IRepository<User> _userRepository;

    public AddProjectMemberHandler(
        IRepository<ProjectMember> projectMemberRepository,
        IRepository<Project> projectRepository,
        IRepository<User> userRepository)
    {
        _projectMemberRepository = projectMemberRepository;
        _projectRepository = projectRepository;
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(AddProjectMemberCommand request, CancellationToken cancellationToken)
    {
        // Verify project exists
        var project = await _projectRepository.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project == null)
        {
            return Result.Fail("Project not found");
        }

        // Verify user exists
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            return Result.Fail("User not found");
        }

        // Check if user is already a member
        var existingMembers = await _projectMemberRepository.GetAllAsync(cancellationToken);
        var existingMember = existingMembers.FirstOrDefault(pm =>
            pm.ProjectId == request.ProjectId &&
            pm.UserId == request.UserId &&
            !pm.IsDeleted);

        if (existingMember != null)
        {
            return Result.Fail("User is already a member of this project");
        }

        // Add user as project member
        var projectMember = new ProjectMember
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId,
            UserId = request.UserId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _projectMemberRepository.AddAsync(projectMember, cancellationToken);

        return Result.Ok();
    }
}
