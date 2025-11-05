using CtrlZzz.Core.Features.Users.Commands.CreateUser;
using CtrlZzz.Core.Features.Users.Commands.DeleteUser;
using CtrlZzz.Core.Features.Users.Commands.UpdateUser;
using CtrlZzz.Core.Features.Users.DTOs;
using CtrlZzz.Core.Features.Users.Queries.GetUser;
using CtrlZzz.Core.Features.Users.Queries.GetUsers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetUsersQuery());

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetUserQuery(id));

        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound(result.Errors);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var command = new CreateUserCommand(dto.Email, dto.Name, dto.Password);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value)
            : BadRequest(result.Errors);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var command = new UpdateUserCommand(id, dto.Name, dto.Password);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand(id));

        return result.IsSuccess
            ? NoContent()
            : NotFound(result.Errors);
    }
}
