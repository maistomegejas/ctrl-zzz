using CtrlZzz.Core.Features.Comments.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Commands.CreateComment;

public record CreateCommentCommand(
    string Content,
    Guid WorkItemId
) : IRequest<Result<CommentDto>>;
