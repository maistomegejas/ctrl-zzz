using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Comments.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Comments.Queries.GetComments;

public class GetCommentsHandler : IRequestHandler<GetCommentsQuery, Result<List<CommentDto>>>
{
    private readonly IRepository<Comment> _commentRepository;

    public GetCommentsHandler(IRepository<Comment> commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<Result<List<CommentDto>>> Handle(GetCommentsQuery request, CancellationToken cancellationToken)
    {
        var comments = await _commentRepository.ListAsync(cancellationToken);

        // Filter by work item ID
        var filteredComments = comments
            .Where(c => c.WorkItemId == request.WorkItemId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                WorkItemId = c.WorkItemId,
                UserId = c.UserId,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToList();

        return Result.Ok(filteredComments);
    }
}
