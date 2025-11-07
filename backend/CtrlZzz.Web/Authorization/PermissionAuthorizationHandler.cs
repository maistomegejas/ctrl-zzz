using System.Security.Claims;
using CtrlZzz.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace CtrlZzz.Web.Authorization;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IServiceProvider _serviceProvider;

    public PermissionAuthorizationHandler(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
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

        // Create a scope to resolve scoped service from singleton handler
        using var scope = _serviceProvider.CreateScope();
        var permissionService = scope.ServiceProvider.GetRequiredService<IPermissionService>();

        var hasPermission = await permissionService.HasPermissionAsync(userId, requirement.Permission);

        if (hasPermission)
        {
            context.Succeed(requirement);
        }
    }
}
