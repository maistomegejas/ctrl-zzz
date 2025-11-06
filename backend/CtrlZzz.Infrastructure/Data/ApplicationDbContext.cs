using CtrlZzz.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CtrlZzz.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<WorkItem> WorkItems => Set<WorkItem>();
    public DbSet<Sprint> Sprints => Set<Sprint>();
    public DbSet<Comment> Comments => Set<Comment>();

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

        // Seed Data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Users
        var user1Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var user2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var user3Id = Guid.Parse("33333333-3333-3333-3333-333333333333");

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = user1Id,
                Name = "John Doe",
                Email = "john@example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                IsDeleted = false
            },
            new User
            {
                Id = user2Id,
                Name = "Sarah Smith",
                Email = "sarah@example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-5),
                IsDeleted = false
            },
            new User
            {
                Id = user3Id,
                Name = "Mike Johnson",
                Email = "mike@example.com",
                CreatedAt = DateTime.UtcNow.AddMonths(-4),
                IsDeleted = false
            }
        );

        // Seed Projects
        var project1Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var project2Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

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
        var sprint1Id = Guid.Parse("99999999-9999-9999-9999-999999999991");
        var sprint2Id = Guid.Parse("99999999-9999-9999-9999-999999999992");
        var sprint3Id = Guid.Parse("99999999-9999-9999-9999-999999999993");
        var sprint4Id = Guid.Parse("99999999-9999-9999-9999-999999999994");

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
        var workItem1Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01");
        var workItem2Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02");
        var workItem3Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03");
        var workItem4Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04");
        var workItem5Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05");
        var workItem6Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee06");
        var workItem7Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee07");
        var workItem8Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee08");
        var workItem9Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee09");
        var workItem10Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeee10");

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
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc01"),
                Content = "Authentication is working great! All unit tests passing.",
                WorkItemId = workItem1Id,
                UserId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-16),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc02"),
                Content = "I've implemented the filtering logic. Still need to add sorting by price and rating.",
                WorkItemId = workItem2Id,
                UserId = user1Id,
                CreatedAt = DateTime.UtcNow.AddDays(-6),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc03"),
                Content = "Working on this today. Should have a PR ready by EOD.",
                WorkItemId = workItem3Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc04"),
                Content = "This is blocking the release! We need to fix this ASAP.",
                WorkItemId = workItem4Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc05"),
                Content = "I'm investigating. It looks like the webhook signature validation is failing.",
                WorkItemId = workItem4Id,
                UserId = user3Id,
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc06"),
                Content = "Completed user interviews with 12 participants. Key insights documented in Notion.",
                WorkItemId = workItem6Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc07"),
                Content = "Color palette looks amazing! Going with the blue/purple gradient theme.",
                WorkItemId = workItem7Id,
                UserId = user2Id,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                IsDeleted = false
            },
            new Comment
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccc08"),
                Content = "Button component is ready for review. Added all variants and states (hover, active, disabled).",
                WorkItemId = workItem8Id,
                UserId = user3Id,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                IsDeleted = false
            }
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
