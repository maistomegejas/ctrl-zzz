using CtrlZzz.Core.Features.Comments.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Queries.GetComments;

public record GetCommentsQuery(Guid WorkItemId) : IRequest<Result<List<CommentDto>>>;
