using CtrlZzz.Core.Features.Sprints.Commands.CompleteSprint;
using CtrlZzz.Core.Features.Sprints.Commands.CreateSprint;
using CtrlZzz.Core.Features.Sprints.Commands.DeleteSprint;
using CtrlZzz.Core.Features.Sprints.Commands.StartSprint;
using CtrlZzz.Core.Features.Sprints.Commands.UpdateSprint;
using CtrlZzz.Core.Features.Sprints.DTOs;
using CtrlZzz.Core.Features.Sprints.Queries.GetSprint;
using CtrlZzz.Core.Features.Sprints.Queries.GetSprints;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SprintsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SprintsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid projectId)
    {
        var result = await _mediator.Send(new GetSprintsQuery(projectId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetSprintQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Errors);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSprintDto dto)
    {
        var command = new CreateSprintCommand(dto.Name, dto.Goal, dto.EndDate, dto.ProjectId);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value)
            : BadRequest(result.Errors);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSprintDto dto)
    {
        var command = new UpdateSprintCommand(id, dto.Name, dto.Goal, dto.EndDate);
        var result = await _mediator.Send(command);

        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteSprintCommand(id));
        return result.IsSuccess ? NoContent() : NotFound(result.Errors);
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> Start(Guid id)
    {
        var result = await _mediator.Send(new StartSprintCommand(id));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(Guid id)
    {
        var result = await _mediator.Send(new CompleteSprintCommand(id));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }
}
