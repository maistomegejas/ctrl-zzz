namespace CtrlZzz.Core.Interfaces;

public interface IAuthorizationService
{
    Task<bool> HasPermissionAsync(Guid userId, string permissionName);
    Task<bool> IsInRoleAsync(Guid userId, string roleName);
    Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId);
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId);
}
