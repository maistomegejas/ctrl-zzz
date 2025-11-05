using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.DeleteProject;

public class DeleteProjectHandler : IRequestHandler<DeleteProjectCommand, Result>
{
    private readonly IRepository<Project> _projectRepository;

    public DeleteProjectHandler(IRepository<Project> projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result> Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
        {
            return Result.Fail("Project not found");
        }

        await _projectRepository.DeleteAsync(project, cancellationToken);

        return Result.Ok();
    }
}
