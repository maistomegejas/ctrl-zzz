using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Users.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Queries.GetUser;

public class GetUserHandler : IRequestHandler<GetUserQuery, Result<UserDto>>
{
    private readonly IRepository<User> _userRepository;

    public GetUserHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserDto>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id, cancellationToken);

        if (user == null)
        {
            return Result.Fail<UserDto>("User not found");
        }

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
