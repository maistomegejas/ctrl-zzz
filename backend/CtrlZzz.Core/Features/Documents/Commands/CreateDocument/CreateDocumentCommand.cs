using CtrlZzz.Core.Features.Documents.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Commands.CreateDocument;

public record CreateDocumentCommand(
    string Title,
    string Content,
    string Category,
    Guid ProjectId
) : IRequest<Result<DocumentDto>>;
