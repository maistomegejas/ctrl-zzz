using Microsoft.AspNetCore.Authorization;

namespace CtrlZzz.Web.Authorization;

/// <summary>
/// Attribute to specify that an endpoint requires a specific permission
/// </summary>
public class RequirePermissionAttribute : AuthorizeAttribute
{
    public RequirePermissionAttribute(string permission)
    {
        Policy = permission;
    }
}
