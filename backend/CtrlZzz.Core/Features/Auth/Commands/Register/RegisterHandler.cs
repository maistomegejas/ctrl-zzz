using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Auth.DTOs;
using CtrlZzz.Core.Features.Users.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Auth.Commands.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, Result<AuthResponseDto>>
{
    private readonly IRepository<User> _userRepository;
    private readonly IJwtService _jwtService;

    public RegisterHandler(IRepository<User> userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<Result<AuthResponseDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if user already exists
        var existingUsers = await _userRepository.ListAsync(cancellationToken);
        if (existingUsers.Any(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return Result.Fail("User with this email already exists");
        }

        // Create new user
        // For now, store password as plain text (as per CreateUserHandler)
        // TODO: Hash password with BCrypt when implementing proper security
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Name = request.Name,
            PasswordHash = request.Password, // TODO: Hash this
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user, cancellationToken);

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
