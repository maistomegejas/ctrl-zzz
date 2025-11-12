using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using FluentResults;
using MediatR;

namespace CtrlZzz.Core.Features.Documents.Commands.DeleteDocument;

public class DeleteDocumentHandler : IRequestHandler<DeleteDocumentCommand, Result>
{
    private readonly IRepository<Document> _documentRepository;

    public DeleteDocumentHandler(IRepository<Document> documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<Result> Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var document = await _documentRepository.GetByIdAsync(request.Id, cancellationToken);
        if (document == null)
        {
            return Result.Fail("Document not found");
        }

        await _documentRepository.DeleteAsync(document, cancellationToken);
        return Result.Ok();
    }
}
