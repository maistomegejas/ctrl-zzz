using CtrlZzz.Core.Features.Projects.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProjects;

public record GetProjectsQuery(Guid UserId) : IRequest<Result<List<ProjectDto>>>;
