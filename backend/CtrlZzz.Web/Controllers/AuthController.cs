using CtrlZzz.Core.Features.Auth.Commands.Login;
using CtrlZzz.Core.Features.Auth.Commands.Register;
using CtrlZzz.Core.Features.Auth.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var command = new RegisterCommand(dto.Email, dto.Name, dto.Password);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(new { errors = result.Errors.Select(e => e.Message) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var command = new LoginCommand(dto.Email, dto.Password);
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(new { errors = result.Errors.Select(e => e.Message) });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
    {
        // TODO: Implement refresh token logic when needed
        return Ok(new { message = "Refresh token endpoint - to be implemented" });
    }
}

public class RefreshTokenDto
{
    public string RefreshToken { get; set; } = string.Empty;
}
