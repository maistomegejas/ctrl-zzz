using CtrlZzz.Core.Entities;
using CtrlZzz.Core.Interfaces;
using CtrlZzz.Web.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CtrlZzz.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Role> _roleRepository;
    private readonly IRepository<Permission> _permissionRepository;
    private readonly IRepository<UserRole> _userRoleRepository;
    private readonly IRepository<RolePermission> _rolePermissionRepository;

    public AdminController(
        IRepository<User> userRepository,
        IRepository<Role> roleRepository,
        IRepository<Permission> permissionRepository,
        IRepository<UserRole> userRoleRepository,
        IRepository<RolePermission> rolePermissionRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _permissionRepository = permissionRepository;
        _userRoleRepository = userRoleRepository;
        _rolePermissionRepository = rolePermissionRepository;
    }

    // User Management

    [HttpGet("users")]
    [RequirePermission("Users.View")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepository.GetAllAsync();
        var userDtos = users.Where(u => !u.IsDeleted).Select(u => new
        {
            u.Id,
            u.Name,
            u.Email,
            u.CreatedAt
        });
        return Ok(userDtos);
    }

    [HttpPost("users/{userId}/roles/{roleId}")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> AssignRoleToUser(Guid userId, Guid roleId)
    {
        // Check if assignment already exists
        var allUserRoles = await _userRoleRepository.GetAllAsync();
        var existingAssignment = allUserRoles
            .FirstOrDefault(ur => ur.UserId == userId && ur.RoleId == roleId && !ur.IsDeleted);

        if (existingAssignment != null)
        {
            return BadRequest(new { error = "User already has this role" });
        }

        var userRole = new UserRole
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            RoleId = roleId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _userRoleRepository.AddAsync(userRole);
        return Ok(new { message = "Role assigned successfully" });
    }

    [HttpDelete("users/{userId}/roles/{roleId}")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> RemoveRoleFromUser(Guid userId, Guid roleId)
    {
        var allUserRoles = await _userRoleRepository.GetAllAsync();
        var userRole = allUserRoles
            .FirstOrDefault(ur => ur.UserId == userId && ur.RoleId == roleId && !ur.IsDeleted);

        if (userRole == null)
        {
            return NotFound(new { error = "Role assignment not found" });
        }

        userRole.IsDeleted = true;
        await _userRoleRepository.UpdateAsync(userRole);
        return NoContent();
    }

    // Role Management

    [HttpGet("roles")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await _roleRepository.GetAllAsync();
        var roleDtos = roles.Where(r => !r.IsDeleted).Select(r => new
        {
            r.Id,
            r.Name,
            r.Description,
            r.CreatedAt
        });
        return Ok(roleDtos);
    }

    [HttpPost("roles")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto dto)
    {
        var role = new Role
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _roleRepository.AddAsync(role);
        return Ok(new { id = role.Id, name = role.Name, description = role.Description, createdAt = role.CreatedAt });
    }

    [HttpGet("roles/{roleId}/permissions")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> GetRolePermissions(Guid roleId)
    {
        var allRolePermissions = await _rolePermissionRepository.GetAllAsync();
        var allPermissions = await _permissionRepository.GetAllAsync();

        var permissionIds = allRolePermissions
            .Where(rp => rp.RoleId == roleId && !rp.IsDeleted)
            .Select(rp => rp.PermissionId);

        var permissions = allPermissions
            .Where(p => permissionIds.Contains(p.Id) && !p.IsDeleted)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Resource,
                p.Action
            });

        return Ok(permissions);
    }

    // Permission Management

    [HttpGet("permissions")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> GetAllPermissions()
    {
        var permissions = await _permissionRepository.GetAllAsync();
        var permissionDtos = permissions.Where(p => !p.IsDeleted).Select(p => new
        {
            p.Id,
            p.Name,
            p.Description,
            p.Resource,
            p.Action
        });
        return Ok(permissionDtos);
    }

    [HttpPost("roles/{roleId}/permissions/{permissionId}")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> AssignPermissionToRole(Guid roleId, Guid permissionId)
    {
        var allRolePermissions = await _rolePermissionRepository.GetAllAsync();
        var existingAssignment = allRolePermissions
            .FirstOrDefault(rp => rp.RoleId == roleId && rp.PermissionId == permissionId && !rp.IsDeleted);

        if (existingAssignment != null)
        {
            return BadRequest(new { error = "Role already has this permission" });
        }

        var rolePermission = new RolePermission
        {
            Id = Guid.NewGuid(),
            RoleId = roleId,
            PermissionId = permissionId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _rolePermissionRepository.AddAsync(rolePermission);
        return Ok(new { message = "Permission assigned successfully" });
    }

    [HttpDelete("roles/{roleId}/permissions/{permissionId}")]
    [RequirePermission("Admin.ManageRoles")]
    public async Task<IActionResult> RemovePermissionFromRole(Guid roleId, Guid permissionId)
    {
        var allRolePermissions = await _rolePermissionRepository.GetAllAsync();
        var rolePermission = allRolePermissions
            .FirstOrDefault(rp => rp.RoleId == roleId && rp.PermissionId == permissionId && !rp.IsDeleted);

        if (rolePermission == null)
        {
            return NotFound(new { error = "Permission assignment not found" });
        }

        rolePermission.IsDeleted = true;
        await _rolePermissionRepository.UpdateAsync(rolePermission);
        return NoContent();
    }

    // User Details with Roles

    [HttpGet("users/{userId}")]
    [RequirePermission("Users.View")]
    public async Task<IActionResult> GetUserWithRoles(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || user.IsDeleted)
        {
            return NotFound(new { error = "User not found" });
        }

        var allUserRoles = await _userRoleRepository.GetAllAsync();
        var allRoles = await _roleRepository.GetAllAsync();

        var userRoleIds = allUserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Select(ur => ur.RoleId);

        var roles = allRoles
            .Where(r => userRoleIds.Contains(r.Id) && !r.IsDeleted)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description
            });

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.CreatedAt,
            Roles = roles
        });
    }
}

public record CreateRoleDto(string Name, string Description);
