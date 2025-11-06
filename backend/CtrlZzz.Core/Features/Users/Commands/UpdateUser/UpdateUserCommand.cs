using CtrlZzz.Core.Features.Users.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Commands.UpdateUser;

public record UpdateUserCommand(
    Guid Id,
    string Name,
    string? Password
) : IRequest<Result<UserDto>>;
