using CtrlZzz.Core.Features.Projects.Commands.CreateProject;
using CtrlZzz.Core.Features.Projects.Commands.DeleteProject;
using CtrlZzz.Core.Features.Projects.Commands.UpdateProject;
using CtrlZzz.Core.Features.Projects.DTOs;
using CtrlZzz.Core.Features.Projects.Queries.GetProject;
using CtrlZzz.Core.Features.Projects.Queries.GetProjects;
using CtrlZzz.Core.Interfaces;
using CtrlZzz.Web.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;

    public ProjectsController(IMediator mediator, ICurrentUserService currentUserService)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = _currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var result = await _mediator.Send(new GetProjectsQuery(userId.Value));

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProjectQuery(id));

        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound(result.Errors);
    }

    [HttpPost]
    [RequirePermission("Projects.Create")]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        var command = new CreateProjectCommand(dto.Name, dto.Key, dto.Description, dto.OwnerId);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value)
            : BadRequest(result.Errors);
    }

    [HttpPut("{id}")]
    [RequirePermission("Projects.Edit")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProjectDto dto)
    {
        var command = new UpdateProjectCommand(id, dto.Name, dto.Description);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    [RequirePermission("Projects.Delete")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProjectCommand(id));

        return result.IsSuccess
            ? NoContent()
            : NotFound(result.Errors);
    }
}
