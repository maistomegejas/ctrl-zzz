using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Commands.DeleteComment;

public class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, Result>
{
    private readonly IRepository<Comment> _commentRepository;

    public DeleteCommentHandler(IRepository<Comment> commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<Result> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetByIdAsync(request.Id, cancellationToken);

        if (comment == null)
        {
            return Result.Fail("Comment not found");
        }

        await _commentRepository.DeleteAsync(comment, cancellationToken);

        return Result.Ok();
    }
}
