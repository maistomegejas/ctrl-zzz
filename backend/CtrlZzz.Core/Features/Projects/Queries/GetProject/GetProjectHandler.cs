using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProject;

public class GetProjectHandler : IRequestHandler<GetProjectQuery, Result<ProjectDto>>
{
    private readonly IRepository<Project> _projectRepository;

    public GetProjectHandler(IRepository<Project> projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<ProjectDto>> Handle(GetProjectQuery request, CancellationToken cancellationToken)
    {
        var project = await _projectRepository.GetByIdAsync(request.Id, cancellationToken);

        if (project == null)
        {
            return Result.Fail<ProjectDto>("Project not found");
        }

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
