using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProjects;

public class GetProjectsHandler : IRequestHandler<GetProjectsQuery, Result<List<ProjectDto>>>
{
    private readonly IRepository<Project> _projectRepository;

    public GetProjectsHandler(IRepository<Project> projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<List<ProjectDto>>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        var projects = await _projectRepository.GetAllAsync(cancellationToken);

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
