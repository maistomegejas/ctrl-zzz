using CtrlZzz.Core.Enums;
using CtrlZzz.Core.Features.WorkItems.Commands.CreateWorkItem;
using CtrlZzz.Core.Features.WorkItems.Commands.DeleteWorkItem;
using CtrlZzz.Core.Features.WorkItems.Commands.UpdateWorkItem;
using CtrlZzz.Core.Features.WorkItems.DTOs;
using CtrlZzz.Core.Features.WorkItems.Queries.GetWorkItem;
using CtrlZzz.Core.Features.WorkItems.Queries.GetWorkItems;
using CtrlZzz.Web.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkItemsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? projectId = null,
        [FromQuery] WorkItemStatus? status = null,
        [FromQuery] Guid? assigneeId = null)
    {
        var result = await _mediator.Send(new GetWorkItemsQuery(projectId, status, assigneeId));

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetWorkItemQuery(id));

        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound(result.Errors);
    }

    [HttpPost]
    [RequirePermission("WorkItems.Create")]
    public async Task<IActionResult> Create([FromBody] CreateWorkItemDto dto)
    {
        var command = new CreateWorkItemCommand(
            dto.Title,
            dto.Description,
            dto.Type,
            dto.Priority,
            dto.StoryPoints,
            dto.ProjectId,
            dto.AssigneeId,
            dto.ReporterId,
            dto.ParentId,
            dto.SprintId
        );

        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value)
            : BadRequest(result.Errors);
    }

    [HttpPut("{id}")]
    [RequirePermission("WorkItems.Edit")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWorkItemDto dto)
    {
        var command = new UpdateWorkItemCommand(
            id,
            dto.Title,
            dto.Description,
            dto.Status,
            dto.Priority,
            dto.StoryPoints,
            dto.OriginalEstimateMinutes,
            dto.RemainingEstimateMinutes,
            dto.TimeLoggedMinutes,
            dto.AssigneeId,
            dto.ReporterId,
            dto.SprintId
        );

        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    [RequirePermission("WorkItems.Delete")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteWorkItemCommand(id));

        return result.IsSuccess
            ? NoContent()
            : NotFound(result.Errors);
    }
}
