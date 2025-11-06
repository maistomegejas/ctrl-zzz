using CtrlZzz.Core.Features.Auth.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponseDto>>;
