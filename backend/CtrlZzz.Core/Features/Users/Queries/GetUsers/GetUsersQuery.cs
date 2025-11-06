using CtrlZzz.Core.Features.Users.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Users.Queries.GetUsers;

public record GetUsersQuery() : IRequest<Result<List<UserDto>>>;
