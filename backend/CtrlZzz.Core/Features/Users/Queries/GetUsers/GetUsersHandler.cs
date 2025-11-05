using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Users.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Queries.GetUsers;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, Result<List<UserDto>>>
{
    private readonly IRepository<User> _userRepository;

    public GetUsersHandler(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<List<UserDto>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);

        var dtos = users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            Name = u.Name,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();

        return Result.Ok(dtos);
    }
}
