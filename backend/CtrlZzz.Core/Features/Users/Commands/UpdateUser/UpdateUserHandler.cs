using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Users.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Commands.UpdateUser;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    private readonly IRepository<User> _userRepository;

    public UpdateUserHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            return Result.Fail<UserDto>("User not found");
        }

        // Update fields
        user.Name = request.Name;

        if (!string.IsNullOrEmpty(request.Password))
        {
            user.PasswordHash = request.Password; // TODO: Hash this when implementing authentication
        }

        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user, cancellationToken);

        // Map to DTO
        var dto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
