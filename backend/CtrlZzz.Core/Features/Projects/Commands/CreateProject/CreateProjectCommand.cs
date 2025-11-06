using CtrlZzz.Core.Features.Projects.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.CreateProject;

public record CreateProjectCommand(
    string Name,
    string Key,
    string? Description,
    Guid OwnerId
) : IRequest<Result<ProjectDto>>;
