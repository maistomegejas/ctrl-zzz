using CtrlZzz.Core.Features.Users.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Commands.CreateUser;

public record CreateUserCommand(
    string Email,
    string Name,
    string Password
) : IRequest<Result<UserDto>>;
