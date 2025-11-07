using System.Security.Claims;
using CtrlZzz.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace CtrlZzz.Web.Authorization;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IAuthorizationService _authorizationService;

    public PermissionAuthorizationHandler(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return;
        }

        var hasPermission = await _authorizationService.HasPermissionAsync(userId, requirement.Permission);

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
    }
}
