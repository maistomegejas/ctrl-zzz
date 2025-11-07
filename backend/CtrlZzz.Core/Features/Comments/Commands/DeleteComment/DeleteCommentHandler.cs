using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Commands.DeleteComment;

public class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, Result>
{
    private readonly IRepository<Comment> _commentRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public DeleteCommentHandler(
        IRepository<Comment> commentRepository,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _commentRepository = commentRepository;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
    }

    public async Task<Result> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetByIdAsync(request.Id, cancellationToken);

        if (comment == null)
        {
            return Result.Fail("Comment not found");
        }

        var currentUserId = _currentUserService.GetCurrentUserId();
        if (currentUserId == null)
        {
            return Result.Fail("User not authenticated");
        }

        // Check if user is the author OR has admin permissions
        var isAuthor = comment.UserId == currentUserId.Value;
        var isAdmin = await _permissionService.HasPermissionAsync(currentUserId.Value, "Admin.AccessAdminPanel");

        if (!isAuthor && !isAdmin)
        {
            return Result.Fail("You can only delete your own comments");
        }

        await _commentRepository.DeleteAsync(comment, cancellationToken);

        return Result.Ok();
    }
}
