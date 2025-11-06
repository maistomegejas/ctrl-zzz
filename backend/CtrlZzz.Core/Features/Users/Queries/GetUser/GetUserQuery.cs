using CtrlZzz.Core.Features.Users.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Queries.GetUser;

public record GetUserQuery(Guid Id) : IRequest<Result<UserDto>>;
