using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Auth.DTOs;
using CtrlZzz.Core.Features.Users.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Auth.Commands.Login;

public class LoginHandler : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    private readonly IRepository<User> _userRepository;
    private readonly IJwtService _jwtService;

    public LoginHandler(IRepository<User> userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<Result<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Find user by email
        var users = await _userRepository.ListAsync(cancellationToken);
        var user = users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

        if (user == null)
        {
            return Result.Fail("Invalid email or password");
        }

        // For now, passwords are stored as plain text (as per CreateUserHandler)
        // TODO: Use BCrypt for password hashing when implementing proper security
        if (user.PasswordHash != request.Password)
        {
            return Result.Fail("Invalid email or password");
        }

        // Generate tokens
        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        var response = new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            User = userDto
        };

        return Result.Ok(response);
    }
}
