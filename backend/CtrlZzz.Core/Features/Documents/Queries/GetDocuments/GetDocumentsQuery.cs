using CtrlZzz.Core.Features.Documents.DTOs;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Queries.GetDocuments;

public record GetDocumentsQuery(Guid ProjectId) : IRequest<Result<List<DocumentDto>>>;
