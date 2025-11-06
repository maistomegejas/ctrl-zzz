using CtrlZzz.Core.Features.Projects.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.UpdateProject;

public record UpdateProjectCommand(
    Guid Id,
    string Name,
    string? Description
) : IRequest<Result<ProjectDto>>;
