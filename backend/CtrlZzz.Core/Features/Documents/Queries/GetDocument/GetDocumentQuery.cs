using CtrlZzz.Core.Features.Documents.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Queries.GetDocument;

public record GetDocumentQuery(Guid Id) : IRequest<Result<DocumentDto>>;
