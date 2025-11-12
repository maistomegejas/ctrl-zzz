using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Commands.DeleteDocument;

public record DeleteDocumentCommand(Guid Id) : IRequest<Result>;
