using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Documents.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Queries.GetDocuments;

public class GetDocumentsHandler : IRequestHandler<GetDocumentsQuery, Result<List<DocumentDto>>>
{
    private readonly IRepository<Document> _documentRepository;

    public GetDocumentsHandler(IRepository<Document> documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<Result<List<DocumentDto>>> Handle(GetDocumentsQuery request, CancellationToken cancellationToken)
    {
        var documents = await _documentRepository.ListAsync(cancellationToken);

        // Filter by project
        var projectDocuments = documents.Where(d => d.ProjectId == request.ProjectId).ToList();

        var dtos = projectDocuments.Select(doc => new DocumentDto
        {
            Id = doc.Id,
            Title = doc.Title,
            Content = doc.Content,
            Category = doc.Category,
            ProjectId = doc.ProjectId,
            UserId = doc.UserId,
            CreatedAt = doc.CreatedAt,
            UpdatedAt = doc.UpdatedAt
        }).ToList();

        return Result.Ok(dtos);
    }
}
