using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Comments.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Commands.CreateComment;

public class CreateCommentHandler : IRequestHandler<CreateCommentCommand, Result<CommentDto>>
{
    private readonly IRepository<Comment> _commentRepository;
    private readonly IRepository<WorkItem> _workItemRepository;

    public CreateCommentHandler(
        IRepository<Comment> commentRepository,
        IRepository<WorkItem> workItemRepository)
    {
        _commentRepository = commentRepository;
        _workItemRepository = workItemRepository;
    }

    public async Task<Result<CommentDto>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        // Validate work item exists
        var workItemExists = await _workItemRepository.ExistsAsync(request.WorkItemId, cancellationToken);
        if (!workItemExists)
        {
            return Result.Fail<CommentDto>("Work item not found");
        }

        // Create comment
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = request.Content,
            WorkItemId = request.WorkItemId,
            UserId = null, // TODO: Get from auth context when auth is implemented
            CreatedAt = DateTime.UtcNow
        };

        await _commentRepository.AddAsync(comment, cancellationToken);

        // Map to DTO
        var dto = new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            WorkItemId = comment.WorkItemId,
            UserId = comment.UserId,
            CreatedAt = comment.CreatedAt,
            UpdatedAt = comment.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
