using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Commands.DeleteUser;

public record DeleteUserCommand(Guid Id) : IRequest<Result>;
