using CtrlZzz.Core.Features.Auth.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Auth.Commands.Register;

public record RegisterCommand(string Email, string Name, string Password) : IRequest<Result<AuthResponseDto>>;
