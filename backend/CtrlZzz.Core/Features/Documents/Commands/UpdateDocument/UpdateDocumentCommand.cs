using CtrlZzz.Core.Features.Documents.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Commands.UpdateDocument;

public record UpdateDocumentCommand(
    Guid Id,
    string Title,
    string Content,
    string Category
) : IRequest<Result<DocumentDto>>;
