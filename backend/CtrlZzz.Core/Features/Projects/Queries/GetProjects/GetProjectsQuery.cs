using CtrlZzz.Core.Features.Projects.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProjects;

public record GetProjectsQuery() : IRequest<Result<List<ProjectDto>>>;
