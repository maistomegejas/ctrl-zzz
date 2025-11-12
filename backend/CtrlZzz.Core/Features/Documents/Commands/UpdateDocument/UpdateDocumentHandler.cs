using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Documents.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Commands.UpdateDocument;

public class UpdateDocumentHandler : IRequestHandler<UpdateDocumentCommand, Result<DocumentDto>>
{
    private readonly IRepository<Document> _documentRepository;

    public UpdateDocumentHandler(IRepository<Document> documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<Result<DocumentDto>> Handle(UpdateDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await _documentRepository.GetByIdAsync(request.Id, cancellationToken);
        if (document == null)
        {
            return Result.Fail<DocumentDto>("Document not found");
        }

        // Update document
        document.Title = request.Title;
        document.Content = request.Content;
        document.Category = request.Category;
        document.UpdatedAt = DateTime.UtcNow;

        await _documentRepository.UpdateAsync(document, cancellationToken);

        // Map to DTO
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
