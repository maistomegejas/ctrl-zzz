using CtrlZzz.Core.Features.Auth.Commands.Login;
using CtrlZzz.Core.Features.Auth.Commands.Register;
using CtrlZzz.Core.Features.Auth.DTOs;
using CtrlZzz.Core.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPermissionService _permissionService;

    public AuthController(
        IMediator mediator,
        ICurrentUserService currentUserService,
        IPermissionService permissionService)
    {
        _mediator = mediator;
        _currentUserService = currentUserService;
        _permissionService = permissionService;
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
    public IActionResult Refresh([FromBody] RefreshTokenDto dto)
    {
        // TODO: Implement refresh token logic when needed
        return Ok(new { message = "Refresh token endpoint - to be implemented" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = _currentUserService.GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var permissions = await _permissionService.GetUserPermissionsAsync(userId.Value);
        var roles = await _permissionService.GetUserRolesAsync(userId.Value);

        return Ok(new
        {
            userId = userId.Value,
            email = _currentUserService.GetCurrentUserEmail(),
            permissions = permissions.ToList(),
            roles = roles.ToList()
        });
    }
}

public class RefreshTokenDto
{
    public string RefreshToken { get; set; } = string.Empty;
}
