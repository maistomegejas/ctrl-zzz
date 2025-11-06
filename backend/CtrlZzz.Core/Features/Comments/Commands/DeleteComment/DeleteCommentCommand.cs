using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Commands.DeleteComment;

public record DeleteCommentCommand(Guid Id) : IRequest<Result>;
