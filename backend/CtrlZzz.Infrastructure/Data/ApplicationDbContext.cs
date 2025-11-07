using CtrlZzz.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace CtrlZzz.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Generates a deterministic GUID from a seed string using MD5 hash.
    /// Same seed will always produce the same GUID.
    /// </summary>
    private static Guid GenerateDeterministicGuid(string seed)
    {
        using var md5 = MD5.Create();
        var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(seed));
        return new Guid(hash);
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<WorkItem> WorkItems => Set<WorkItem>();
    public DbSet<Sprint> Sprints => Set<Sprint>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<GroupMember> GroupMembers => Set<GroupMember>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Project configuration
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Key).IsRequired().HasMaxLength(10);
            entity.HasIndex(e => e.Key).IsUnique();

            entity.HasOne(e => e.Owner)
                .WithMany(e => e.Projects)
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // WorkItem configuration
        modelBuilder.Entity<WorkItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);

            entity.HasOne(e => e.Project)
                .WithMany(e => e.WorkItems)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Assignee)
                .WithMany(e => e.AssignedWorkItems)
                .HasForeignKey(e => e.AssigneeId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Reporter)
                .WithMany()
                .HasForeignKey(e => e.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Parent)
                .WithMany(e => e.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Sprint)
                .WithMany(e => e.WorkItems)
                .HasForeignKey(e => e.SprintId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // Sprint configuration
        modelBuilder.Entity<Sprint>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);

            entity.HasOne(e => e.Project)
                .WithMany()
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment configuration
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired();

            entity.HasOne(e => e.WorkItem)
                .WithMany(e => e.Comments)
                .HasForeignKey(e => e.WorkItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ProjectMember configuration
        modelBuilder.Entity<ProjectMember>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Project)
                .WithMany(e => e.ProjectMembers)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany(e => e.ProjectMemberships)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure unique project-user combination
            entity.HasIndex(e => new { e.ProjectId, e.UserId }).IsUnique();
        });

        // Role configuration
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Permission configuration
        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Resource).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // UserRole configuration
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.User)
                .WithMany(e => e.UserRoles)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Role)
                .WithMany(e => e.UserRoles)
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure unique user-role combination
            entity.HasIndex(e => new { e.UserId, e.RoleId }).IsUnique();
        });

        // RolePermission configuration
        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Role)
                .WithMany(e => e.RolePermissions)
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Permission)
                .WithMany(e => e.RolePermissions)
                .HasForeignKey(e => e.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure unique role-permission combination
            entity.HasIndex(e => new { e.RoleId, e.PermissionId }).IsUnique();
        });

        // Group configuration
        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);

            entity.HasOne(e => e.Project)
                .WithMany()
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // GroupMember configuration
        modelBuilder.Entity<GroupMember>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Group)
                .WithMany(e => e.GroupMembers)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany(e => e.GroupMemberships)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure unique group-user combination
            entity.HasIndex(e => new { e.GroupId, e.UserId }).IsUnique();
        });

        // Seed Data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Users (with plain text passwords for now)
        var adminUserId = GenerateDeterministicGuid("user-admin-amogus");
        var user1Id = GenerateDeterministicGuid("user-john-doe");
        var user2Id = GenerateDeterministicGuid("user-sarah-smith");
        var user3Id = GenerateDeterministicGuid("user-mike-johnson");

        modelBuilder.Entity<User>().HasData(
            // Admin user - ALWAYS SEEDED
            new User
            {
                Id = adminUserId,
                Name = "System Administrator",
                Email = "amogus@gmail.com",
                PasswordHash = "amogus", // Plain text for now
                CreatedAt = DateTime.UtcNow.AddYears(-1),
                IsDeleted = false
            },
            new User
            {
                Id = user1Id,
                Name = "John Doe",
                Email = "john@example.com",
                PasswordHash = "password123",
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                IsDeleted = false
            },
            new User
            {
                Id = user2Id,
                Name = "Sarah Smith",
                Email = "sarah@example.com",
                PasswordHash = "password123",
                CreatedAt = DateTime.UtcNow.AddMonths(-5),
                IsDeleted = false
            },
            new User
            {
                Id = user3Id,
                Name = "Mike Johnson",
                Email = "mike@example.com",
                PasswordHash = "password123",
                CreatedAt = DateTime.UtcNow.AddMonths(-4),
                IsDeleted = false
            }
        );

        // Seed Projects
        var project1Id = GenerateDeterministicGuid("project-ecommerce");
        var project2Id = GenerateDeterministicGuid("project-mobile-redesign");

        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = project1Id,
                Name = "E-commerce Platform",
                Key = "ECOM",
                Description = "Online shopping platform with cart, checkout, and payment processing",
                OwnerId = user1Id,
                CreatedAt = DateTime.UtcNow.AddMonths(-3),
                IsDeleted = false
            },
            new Project
            {
                Id = project2Id,
                Name = "Mobile App Redesign",
                Key = "MOBILE",
                Description = "Complete UI/UX overhaul of the mobile application",
                OwnerId = user2Id,
                CreatedAt = DateTime.UtcNow.AddMonths(-2),
                IsDeleted = false
            }
        );

        // Seed Sprints
        var sprint1Id = GenerateDeterministicGuid("sprint-ecom-sprint1");
        var sprint2Id = GenerateDeterministicGuid("sprint-ecom-sprint2");
        var sprint3Id = GenerateDeterministicGuid("sprint-mobile-sprint1");
        var sprint4Id = GenerateDeterministicGuid("sprint-mobile-sprint2");

        modelBuilder.Entity<Sprint>().HasData(
            new Sprint
            {
                Id = sprint1Id,
                Name = "Sprint 1 - Foundation",
                ProjectId = project1Id,
                StartDate = DateTime.UtcNow.AddDays(-30),
                EndDate = DateTime.UtcNow.AddDays(-16),
                Goal = "Set up basic infrastructure and authentication",
                IsActive = false,
                CreatedAt = DateTime.UtcNow.AddDays(-35),
                IsDeleted = false
            },
            new Sprint
            {
                Id = sprint2Id,
                Name = "Sprint 2 - Core Features",
                ProjectId = project1Id,
                StartDate = DateTime.UtcNow.AddDays(-14),
                EndDate = DateTime.UtcNow.AddDays(7),
                Goal = "Implement shopping cart and product catalog",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                IsDeleted = false
            },
            new Sprint
            {
                Id = sprint3Id,
                Name = "Sprint 1 - Research",
                ProjectId = project2Id,
                StartDate = DateTime.UtcNow.AddDays(-21),
                EndDate = DateTime.UtcNow.AddDays(-7),
                Goal = "User research and wireframing",
                IsActive = false,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                IsDeleted = false
            },
            new Sprint
            {
                Id = sprint4Id,
                Name = "Sprint 2 - Design System",
                ProjectId = project2Id,
                StartDate = DateTime.UtcNow.AddDays(-5),
                EndDate = DateTime.UtcNow.AddDays(9),
                Goal = "Create design system and component library",
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                IsDeleted = false
            }
        );

        // Seed WorkItems
        var workItem1Id = GenerateDeterministicGuid("workitem-auth-system");
        var workItem2Id = GenerateDeterministicGuid("workitem-product-catalog");
        var workItem3Id = GenerateDeterministicGuid("workitem-shopping-cart");
        var workItem4Id = GenerateDeterministicGuid("workitem-payment-bug");
        var workItem5Id = GenerateDeterministicGuid("workitem-image-optimization");
        var workItem6Id = GenerateDeterministicGuid("workitem-user-research");
        var workItem7Id = GenerateDeterministicGuid("workitem-design-system");
        var workItem8Id = GenerateDeterministicGuid("workitem-button-component");
        var workItem9Id = GenerateDeterministicGuid("workitem-dark-mode");
        var workItem10Id = GenerateDeterministicGuid("workitem-navbar-ios-bug");

        modelBuilder.Entity<WorkItem>().HasData(
            // Project 1 - ECOM
            new WorkItem
            {
                Id = workItem1Id,
                Title = "User Authentication System",
                Description = "Implement JWT-based authentication with login, registration, and password reset functionality",
                Type = Core.Enums.WorkItemType.Epic,
                Status = Core.Enums.WorkItemStatus.Done,
                Priority = Core.Enums.Priority.Critical,
                StoryPoints = 13,
                ProjectId = project1Id,
                SprintId = sprint1Id,
                AssigneeId = user1Id,
                ReporterId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-28),
                UpdatedAt = DateTime.UtcNow.AddDays(-16),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem2Id,
                Title = "Product Catalog API",
                Description = "REST API endpoints for product listing, filtering, and search",
                Type = Core.Enums.WorkItemType.Story,
                Status = Core.Enums.WorkItemStatus.InProgress,
                Priority = Core.Enums.Priority.High,
                StoryPoints = 8,
                ProjectId = project1Id,
                SprintId = sprint2Id,
                AssigneeId = user1Id,
                ReporterId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-12),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem3Id,
                Title = "Shopping Cart State Management",
                Description = "Redux store for cart items with add, remove, and update quantity actions",
                Type = Core.Enums.WorkItemType.Task,
                Status = Core.Enums.WorkItemStatus.InProgress,
                Priority = Core.Enums.Priority.High,
                StoryPoints = 5,
                ProjectId = project1Id,
                SprintId = sprint2Id,
                AssigneeId = user2Id,
                ReporterId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem4Id,
                Title = "Payment gateway integration not working",
                Description = "Stripe webhook returns 500 error when processing payments. Need to investigate the callback handler.",
                Type = Core.Enums.WorkItemType.Bug,
                Status = Core.Enums.WorkItemStatus.Blocked,
                Priority = Core.Enums.Priority.Blocker,
                StoryPoints = 3,
                ProjectId = project1Id,
                SprintId = sprint2Id,
                AssigneeId = user3Id,
                ReporterId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem5Id,
                Title = "Add product image optimization",
                Description = "Implement lazy loading and WebP format for product images",
                Type = Core.Enums.WorkItemType.Task,
                Status = Core.Enums.WorkItemStatus.ToDo,
                Priority = Core.Enums.Priority.Medium,
                StoryPoints = 3,
                ProjectId = project1Id,
                SprintId = sprint2Id,
                AssigneeId = user2Id,
                ReporterId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                IsDeleted = false
            },
            // Project 2 - MOBILE
            new WorkItem
            {
                Id = workItem6Id,
                Title = "User Research & Personas",
                Description = "Conduct user interviews and create user personas for the mobile app redesign",
                Type = Core.Enums.WorkItemType.Story,
                Status = Core.Enums.WorkItemStatus.Done,
                Priority = Core.Enums.Priority.High,
                StoryPoints = 5,
                ProjectId = project2Id,
                SprintId = sprint3Id,
                AssigneeId = user2Id,
                ReporterId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem7Id,
                Title = "Design System Foundations",
                Description = "Create color palette, typography scale, and spacing system",
                Type = Core.Enums.WorkItemType.Story,
                Status = Core.Enums.WorkItemStatus.InProgress,
                Priority = Core.Enums.Priority.Critical,
                StoryPoints = 8,
                ProjectId = project2Id,
                SprintId = sprint4Id,
                AssigneeId = user3Id,
                ReporterId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem8Id,
                Title = "Button component library",
                Description = "Create reusable button components with variants (primary, secondary, outline, ghost)",
                Type = Core.Enums.WorkItemType.Task,
                Status = Core.Enums.WorkItemStatus.InReview,
                Priority = Core.Enums.Priority.Medium,
                StoryPoints = 3,
                ProjectId = project2Id,
                SprintId = sprint4Id,
                AssigneeId = user3Id,
                ReporterId = user2Id,
                ParentId = workItem7Id,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem9Id,
                Title = "Dark mode support",
                Description = "Implement dark mode theme toggle with persistent user preference",
                Type = Core.Enums.WorkItemType.Story,
                Status = Core.Enums.WorkItemStatus.ToDo,
                Priority = Core.Enums.Priority.Low,
                StoryPoints = 5,
                ProjectId = project2Id,
                AssigneeId = user1Id,
                ReporterId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                IsDeleted = false
            },
            new WorkItem
            {
                Id = workItem10Id,
                Title = "Navigation bar alignment issue on iOS",
                Description = "Navigation bar icons are misaligned on iPhone 14 Pro due to notch. Appears correctly on Android.",
                Type = Core.Enums.WorkItemType.Bug,
                Status = Core.Enums.WorkItemStatus.ToDo,
                Priority = Core.Enums.Priority.Medium,
                StoryPoints = 2,
                ProjectId = project2Id,
                SprintId = sprint4Id,
                AssigneeId = user1Id,
                ReporterId = user3Id,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                IsDeleted = false
            }
        );

        // Seed Comments
        modelBuilder.Entity<Comment>().HasData(
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-auth-done"),
                Content = "Authentication is working great! All unit tests passing.",
                WorkItemId = workItem1Id,
                UserId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-16),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-catalog-filter"),
                Content = "I've implemented the filtering logic. Still need to add sorting by price and rating.",
                WorkItemId = workItem2Id,
                UserId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-6),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-cart-progress"),
                Content = "Working on this today. Should have a PR ready by EOD.",
                WorkItemId = workItem3Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-payment-blocking"),
                Content = "This is blocking the release! We need to fix this ASAP.",
                WorkItemId = workItem4Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-payment-investigating"),
                Content = "I'm investigating. It looks like the webhook signature validation is failing.",
                WorkItemId = workItem4Id,
                UserId = user3Id,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-research-done"),
                Content = "Completed user interviews with 12 participants. Key insights documented in Notion.",
                WorkItemId = workItem6Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-design-colors"),
                Content = "Color palette looks amazing! Going with the blue/purple gradient theme.",
                WorkItemId = workItem7Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                IsDeleted = false
            },
            new Comment
            {
                Id = GenerateDeterministicGuid("comment-button-review"),
                Content = "Button component is ready for review. Added all variants and states (hover, active, disabled).",
                WorkItemId = workItem8Id,
                UserId = user3Id,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                IsDeleted = false
            }
        );

        // Seed Roles
        var adminRoleId = GenerateDeterministicGuid("role-admin");
        var pmRoleId = GenerateDeterministicGuid("role-projectmanager");
        var devRoleId = GenerateDeterministicGuid("role-developer");
        var viewerRoleId = GenerateDeterministicGuid("role-viewer");

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = adminRoleId, Name = "Admin", Description = "Full system access", CreatedAt = DateTime.UtcNow, IsDeleted = false },
            new Role { Id = pmRoleId, Name = "ProjectManager", Description = "Can manage projects and teams", CreatedAt = DateTime.UtcNow, IsDeleted = false },
            new Role { Id = devRoleId, Name = "Developer", Description = "Can create and edit work items", CreatedAt = DateTime.UtcNow, IsDeleted = false },
            new Role { Id = viewerRoleId, Name = "Viewer", Description = "Read-only access", CreatedAt = DateTime.UtcNow, IsDeleted = false }
        );

        // Seed Permissions
        var permissions = new[]
        {
            new { Id = GenerateDeterministicGuid("perm-admin-access"), Name = "Admin.AccessAdminPanel", Description = "Access admin panel", Resource = "Admin", Action = "Access" },
            new { Id = GenerateDeterministicGuid("perm-admin-roles"), Name = "Admin.ManageRoles", Description = "Manage roles", Resource = "Admin", Action = "ManageRoles" },
            new { Id = GenerateDeterministicGuid("perm-users-view"), Name = "Users.View", Description = "View users", Resource = "Users", Action = "View" },
            new { Id = GenerateDeterministicGuid("perm-users-manage"), Name = "Users.Manage", Description = "Manage users", Resource = "Users", Action = "Manage" },
            new { Id = GenerateDeterministicGuid("perm-projects-create"), Name = "Projects.Create", Description = "Create projects", Resource = "Projects", Action = "Create" },
            new { Id = GenerateDeterministicGuid("perm-projects-edit"), Name = "Projects.Edit", Description = "Edit projects", Resource = "Projects", Action = "Edit" },
            new { Id = GenerateDeterministicGuid("perm-projects-delete"), Name = "Projects.Delete", Description = "Delete projects", Resource = "Projects", Action = "Delete" },
            new { Id = GenerateDeterministicGuid("perm-projects-viewall"), Name = "Projects.ViewAll", Description = "View all projects", Resource = "Projects", Action = "ViewAll" },
            new { Id = GenerateDeterministicGuid("perm-projects-members"), Name = "Projects.ManageMembers", Description = "Manage project members", Resource = "Projects", Action = "ManageMembers" },
            new { Id = GenerateDeterministicGuid("perm-workitems-create"), Name = "WorkItems.Create", Description = "Create work items", Resource = "WorkItems", Action = "Create" },
            new { Id = GenerateDeterministicGuid("perm-workitems-edit"), Name = "WorkItems.Edit", Description = "Edit work items", Resource = "WorkItems", Action = "Edit" },
            new { Id = GenerateDeterministicGuid("perm-workitems-delete"), Name = "WorkItems.Delete", Description = "Delete work items", Resource = "WorkItems", Action = "Delete" },
            new { Id = GenerateDeterministicGuid("perm-comments-create"), Name = "Comments.Create", Description = "Create comments", Resource = "Comments", Action = "Create" },
            new { Id = GenerateDeterministicGuid("perm-sprints-create"), Name = "Sprints.Create", Description = "Create sprints", Resource = "Sprints", Action = "Create" },
            new { Id = GenerateDeterministicGuid("perm-sprints-edit"), Name = "Sprints.Edit", Description = "Edit sprints", Resource = "Sprints", Action = "Edit" },
        };

        foreach (var perm in permissions)
        {
            modelBuilder.Entity<Permission>().HasData(new Permission
            {
                Id = perm.Id,
                Name = perm.Name,
                Description = perm.Description,
                Resource = perm.Resource,
                Action = perm.Action,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        }

        // Seed RolePermissions (Admin gets all permissions)
        var rolePermissions = new List<(Guid RoleId, Guid PermissionId)>
        {
            // Admin - ALL permissions
            (adminRoleId, GenerateDeterministicGuid("perm-admin-access")),
            (adminRoleId, GenerateDeterministicGuid("perm-admin-roles")),
            (adminRoleId, GenerateDeterministicGuid("perm-users-view")),
            (adminRoleId, GenerateDeterministicGuid("perm-users-manage")),
            (adminRoleId, GenerateDeterministicGuid("perm-projects-create")),
            (adminRoleId, GenerateDeterministicGuid("perm-projects-edit")),
            (adminRoleId, GenerateDeterministicGuid("perm-projects-delete")),
            (adminRoleId, GenerateDeterministicGuid("perm-projects-viewall")),
            (adminRoleId, GenerateDeterministicGuid("perm-projects-members")),
            (adminRoleId, GenerateDeterministicGuid("perm-workitems-create")),
            (adminRoleId, GenerateDeterministicGuid("perm-workitems-edit")),
            (adminRoleId, GenerateDeterministicGuid("perm-workitems-delete")),
            (adminRoleId, GenerateDeterministicGuid("perm-comments-create")),
            (adminRoleId, GenerateDeterministicGuid("perm-sprints-create")),
            (adminRoleId, GenerateDeterministicGuid("perm-sprints-edit")),

            // ProjectManager - Project and member management
            (pmRoleId, GenerateDeterministicGuid("perm-users-view")), // View users
            (pmRoleId, GenerateDeterministicGuid("perm-projects-create")), // Create projects
            (pmRoleId, GenerateDeterministicGuid("perm-projects-edit")), // Edit projects
            (pmRoleId, GenerateDeterministicGuid("perm-projects-viewall")), // View all projects
            (pmRoleId, GenerateDeterministicGuid("perm-projects-members")), // Manage members
            (pmRoleId, GenerateDeterministicGuid("perm-workitems-create")), // Create work items
            (pmRoleId, GenerateDeterministicGuid("perm-workitems-edit")), // Edit work items
            (pmRoleId, GenerateDeterministicGuid("perm-comments-create")), // Create comments
            (pmRoleId, GenerateDeterministicGuid("perm-sprints-create")), // Create sprints
            (pmRoleId, GenerateDeterministicGuid("perm-sprints-edit")), // Edit sprints

            // Developer - Work item management
            (devRoleId, GenerateDeterministicGuid("perm-users-view")), // View users
            (devRoleId, GenerateDeterministicGuid("perm-workitems-create")), // Create work items
            (devRoleId, GenerateDeterministicGuid("perm-workitems-edit")), // Edit work items
            (devRoleId, GenerateDeterministicGuid("perm-comments-create")), // Create comments

            // Viewer - Read-only (just view users for now)
            (viewerRoleId, GenerateDeterministicGuid("perm-users-view")), // View users
        };

        var rpIndex = 1;
        foreach (var (roleId, permId) in rolePermissions)
        {
            modelBuilder.Entity<RolePermission>().HasData(new RolePermission
            {
                Id = GenerateDeterministicGuid($"roleperm-{rpIndex}"),
                RoleId = roleId,
                PermissionId = permId,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
            rpIndex++;
        }

        // Seed UserRoles - Make admin user an Admin, others are Developers
        modelBuilder.Entity<UserRole>().HasData(
            new UserRole { Id = GenerateDeterministicGuid("userrole-admin-admin"), UserId = adminUserId, RoleId = adminRoleId, CreatedAt = DateTime.UtcNow, IsDeleted = false },
            new UserRole { Id = GenerateDeterministicGuid("userrole-john-dev"), UserId = user1Id, RoleId = devRoleId, CreatedAt = DateTime.UtcNow, IsDeleted = false },
            new UserRole { Id = GenerateDeterministicGuid("userrole-sarah-pm"), UserId = user2Id, RoleId = pmRoleId, CreatedAt = DateTime.UtcNow, IsDeleted = false },
            new UserRole { Id = GenerateDeterministicGuid("userrole-mike-dev"), UserId = user3Id, RoleId = devRoleId, CreatedAt = DateTime.UtcNow, IsDeleted = false }
        );
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Set timestamps
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
