using CtrlZzz.Core.Interfaces;
using CtrlZzz.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CtrlZzz.Infrastructure.Services;

public class AuthorizationService : IAuthorizationService
{
    private readonly ApplicationDbContext _context;

    public AuthorizationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasPermissionAsync(Guid userId, string permissionName)
    {
        var hasPermission = await _context.UserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Join(_context.RolePermissions,
                ur => ur.RoleId,
                rp => rp.RoleId,
                (ur, rp) => rp)
            .Where(rp => !rp.IsDeleted)
            .Join(_context.Permissions,
                rp => rp.PermissionId,
                p => p.Id,
                (rp, p) => p)
            .Where(p => p.Name == permissionName && !p.IsDeleted)
            .AnyAsync();

        return hasPermission;
    }

    public async Task<bool> IsInRoleAsync(Guid userId, string roleName)
    {
        var isInRole = await _context.UserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => r)
            .Where(r => r.Name == roleName && !r.IsDeleted)
            .AnyAsync();

        return isInRole;
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId)
    {
        var permissions = await _context.UserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Join(_context.RolePermissions,
                ur => ur.RoleId,
                rp => rp.RoleId,
                (ur, rp) => rp)
            .Where(rp => !rp.IsDeleted)
            .Join(_context.Permissions,
                rp => rp.PermissionId,
                p => p.Id,
                (rp, p) => p)
            .Where(p => !p.IsDeleted)
            .Select(p => p.Name)
            .Distinct()
            .ToListAsync();

        return permissions;
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId)
    {
        var roles = await _context.UserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => r)
            .Where(r => !r.IsDeleted)
            .Select(r => r.Name)
            .ToListAsync();

        return roles;
    }
}
