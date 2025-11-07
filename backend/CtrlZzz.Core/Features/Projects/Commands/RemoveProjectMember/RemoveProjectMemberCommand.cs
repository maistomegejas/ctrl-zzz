using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Projects.Commands.RemoveProjectMember;

public record RemoveProjectMemberCommand(Guid ProjectId, Guid UserId) : IRequest<Result>;
