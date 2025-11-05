using CtrlZzz.Core.Features.Projects.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Queries.GetProject;

public record GetProjectQuery(Guid Id) : IRequest<Result<ProjectDto>>;
