using CtrlZzz.Core.Features.Comments.Commands.CreateComment;
using CtrlZzz.Core.Features.Comments.Commands.DeleteComment;
using CtrlZzz.Core.Features.Comments.DTOs;
using CtrlZzz.Core.Features.Comments.Queries.GetComments;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public CommentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid workItemId)
    {
        var result = await _mediator.Send(new GetCommentsQuery(workItemId));

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCommentDto dto)
    {
        var command = new CreateCommentCommand(
            dto.Content,
            dto.WorkItemId
        );

        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteCommentCommand(id));

        return result.IsSuccess
            ? NoContent()
            : NotFound(result.Errors);
    }
}
