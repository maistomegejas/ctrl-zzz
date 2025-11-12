using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Features.Documents.DTOs;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Commands.CreateDocument;

public class CreateDocumentHandler : IRequestHandler<CreateDocumentCommand, Result<DocumentDto>>
{
    private readonly IRepository<Document> _documentRepository;
    private readonly IRepository<Project> _projectRepository;
    private readonly ICurrentUserService _currentUserService;

    public CreateDocumentHandler(
        IRepository<Document> documentRepository,
        IRepository<Project> projectRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _projectRepository = projectRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Result<DocumentDto>> Handle(CreateDocumentCommand request, CancellationToken cancellationToken)
    {
        // Validate project exists
        var projectExists = await _projectRepository.ExistsAsync(request.ProjectId, cancellationToken);
        if (!projectExists)
        {
            return Result.Fail<DocumentDto>("Project not found");
        }

        // Create document with current user
        var document = new Document
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Content = request.Content,
            Category = request.Category,
            ProjectId = request.ProjectId,
            UserId = _currentUserService.GetCurrentUserId(),
            CreatedAt = DateTime.UtcNow
        };

        await _documentRepository.AddAsync(document, cancellationToken);

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
