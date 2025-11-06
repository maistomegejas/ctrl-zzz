using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.DeleteProject;

public record DeleteProjectCommand(Guid Id) : IRequest<Result>;
