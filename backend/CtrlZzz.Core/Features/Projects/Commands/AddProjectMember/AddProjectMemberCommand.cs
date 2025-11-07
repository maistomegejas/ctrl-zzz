using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.AddProjectMember;

public record AddProjectMemberCommand(Guid ProjectId, Guid UserId) : IRequest<Result>;
