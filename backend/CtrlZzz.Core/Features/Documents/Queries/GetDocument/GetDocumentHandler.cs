using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Documents.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Queries.GetDocument;

public class GetDocumentHandler : IRequestHandler<GetDocumentQuery, Result<DocumentDto>>
{
    private readonly IRepository<Document> _documentRepository;

    public GetDocumentHandler(IRepository<Document> documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<Result<DocumentDto>> Handle(GetDocumentQuery request, CancellationToken cancellationToken)
    {
        var document = await _documentRepository.GetByIdAsync(request.Id, cancellationToken);
        if (document == null)
        {
            return Result.Fail<DocumentDto>("Document not found");
        }

        var dto = new DocumentDto
        {
            Id = document.Id,
            Title = document.Title,
            Content = document.Content,
            Category = document.Category,
            ProjectId = document.ProjectId,
            UserId = document.UserId,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt
        };

        return Result.Ok(dto);
    }
}
