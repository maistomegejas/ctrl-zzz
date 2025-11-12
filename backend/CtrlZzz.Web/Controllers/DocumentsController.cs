using CtrlZzz.Core.Features.Documents.Commands.CreateDocument;
using CtrlZzz.Core.Features.Documents.Commands.UpdateDocument;
using CtrlZzz.Core.Features.Documents.Commands.DeleteDocument;
using CtrlZzz.Core.Features.Documents.Queries.GetDocument;
using CtrlZzz.Core.Features.Documents.Queries.GetDocuments;
using CtrlZzz.Web.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DocumentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] Guid projectId)
    {
        var result = await _mediator.Send(new GetDocumentsQuery(projectId));

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetDocumentQuery(id));

        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound(result.Errors);
    }

    [HttpPost]
    [RequirePermission("Documents.Create")]
    public async Task<IActionResult> Create([FromBody] CreateDocumentCommand command)
    {
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpPut("{id}")]
    [RequirePermission("Documents.Edit")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDocumentRequest request)
    {
        var command = new UpdateDocumentCommand(
            id,
            request.Title,
            request.Content,
            request.Category
        );

        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    [RequirePermission("Documents.Delete")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteDocumentCommand(id));

        return result.IsSuccess
            ? NoContent()
            : NotFound(result.Errors);
    }
}

public record UpdateDocumentRequest(
    string Title,
    string Content,
    string Category
);
