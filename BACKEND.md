# Backend Architecture - CTRL-ZZZ
## ASP.NET Core Web API with Clean Architecture

## Technology Stack

### Core Technologies
- **ASP.NET Core 8.0** - Web API framework
- **C# 12** - Programming language
- **Entity Framework Core 8.0** - ORM
- **Microsoft SQL Server** (with PostgreSQL compatibility)

### Libraries & Packages
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - DTO validation
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **JWT Bearer** - Authentication
- **SignalR** - Real-time communication
- **Swashbuckle (Swagger)** - API documentation
- **Hangfire** - Background jobs (future)
- **Redis** - Caching (future)

### Testing
- **xUnit** - Testing framework
- **FluentAssertions** - Assertion library
- **Moq** - Mocking framework
- **Bogus** - Fake data generation
- **WebApplicationFactory** - Integration tests

## Solution Structure

```
src/
├── CtrlZzz.Core/                          # Domain + Application Layer
│   ├── Entities/                          # Domain entities
│   │   ├── BaseEntity.cs
│   │   ├── User.cs
│   │   ├── Organization.cs
│   │   ├── Project.cs
│   │   ├── WorkItem.cs                    # Base class
│   │   ├── Epic.cs
│   │   ├── Story.cs
│   │   ├── Task.cs
│   │   ├── Bug.cs
│   │   ├── Subtask.cs
│   │   ├── Sprint.cs
│   │   ├── Board.cs
│   │   ├── Team.cs
│   │   ├── Comment.cs
│   │   ├── Attachment.cs
│   │   ├── ActivityLog.cs
│   │   ├── WorkItemRelationship.cs
│   │   ├── Label.cs
│   │   ├── Workflow.cs
│   │   ├── WorkflowState.cs
│   │   └── CustomField.cs
│   │
│   ├── ValueObjects/                      # Value objects
│   │   ├── Email.cs
│   │   ├── Priority.cs
│   │   ├── WorkItemType.cs
│   │   ├── StoryPoints.cs
│   │   └── TimeEstimate.cs
│   │
│   ├── Enums/                             # Enumerations
│   │   ├── PriorityLevel.cs
│   │   ├── WorkItemStatus.cs
│   │   ├── UserRole.cs
│   │   ├── RelationshipType.cs
│   │   └── BoardType.cs
│   │
│   ├── Interfaces/                        # Repository interfaces
│   │   ├── IRepository.cs
│   │   ├── IWorkItemRepository.cs
│   │   ├── IProjectRepository.cs
│   │   ├── ISprintRepository.cs
│   │   ├── IUserRepository.cs
│   │   ├── IUnitOfWork.cs
│   │   └── Services/
│   │       ├── IAuthService.cs
│   │       ├── IEmailService.cs
│   │       ├── IStorageService.cs
│   │       └── IAIService.cs              # Future
│   │
│   ├── DTOs/                              # Data transfer objects
│   │   ├── Common/
│   │   │   ├── PaginatedResult.cs
│   │   │   ├── ApiResponse.cs
│   │   │   └── ErrorResponse.cs
│   │   ├── Auth/
│   │   │   ├── LoginDto.cs
│   │   │   ├── RegisterDto.cs
│   │   │   └── TokenResponseDto.cs
│   │   ├── WorkItems/
│   │   │   ├── WorkItemDto.cs
│   │   │   ├── CreateWorkItemDto.cs
│   │   │   ├── UpdateWorkItemDto.cs
│   │   │   └── WorkItemDetailDto.cs
│   │   ├── Projects/
│   │   │   ├── ProjectDto.cs
│   │   │   ├── CreateProjectDto.cs
│   │   │   └── UpdateProjectDto.cs
│   │   └── Sprints/
│   │       ├── SprintDto.cs
│   │       ├── CreateSprintDto.cs
│   │       └── SprintReportDto.cs
│   │
│   ├── Specifications/                    # Query specifications
│   │   ├── BaseSpecification.cs
│   │   ├── WorkItemSpecifications.cs
│   │   ├── ProjectSpecifications.cs
│   │   └── SprintSpecifications.cs
│   │
│   ├── Services/                          # Application services
│   │   ├── WorkItemService.cs
│   │   ├── ProjectService.cs
│   │   ├── SprintService.cs
│   │   ├── BoardService.cs
│   │   └── ReportService.cs
│   │
│   ├── Validators/                        # FluentValidation validators
│   │   ├── CreateWorkItemDtoValidator.cs
│   │   ├── UpdateWorkItemDtoValidator.cs
│   │   └── CreateProjectDtoValidator.cs
│   │
│   ├── Exceptions/                        # Custom exceptions
│   │   ├── DomainException.cs
│   │   ├── NotFoundException.cs
│   │   ├── ValidationException.cs
│   │   ├── UnauthorizedException.cs
│   │   └── BusinessRuleException.cs
│   │
│   ├── Mappings/                          # AutoMapper profiles
│   │   ├── WorkItemProfile.cs
│   │   ├── ProjectProfile.cs
│   │   └── UserProfile.cs
│   │
│   └── CtrlZzz.Core.csproj
│
├── CtrlZzz.Infrastructure/                # Infrastructure Layer
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── DbInitializer.cs
│   │   └── Configurations/               # Entity configurations
│   │       ├── UserConfiguration.cs
│   │       ├── ProjectConfiguration.cs
│   │       ├── WorkItemConfiguration.cs
│   │       ├── SprintConfiguration.cs
│   │       └── ...
│   │
│   ├── Repositories/                      # Repository implementations
│   │   ├── Repository.cs                  # Generic repository
│   │   ├── WorkItemRepository.cs
│   │   ├── ProjectRepository.cs
│   │   ├── SprintRepository.cs
│   │   ├── UserRepository.cs
│   │   └── UnitOfWork.cs
│   │
│   ├── Identity/                          # Authentication/Authorization
│   │   ├── JwtTokenGenerator.cs
│   │   ├── PasswordHasher.cs
│   │   └── UserIdentityService.cs
│   │
│   ├── Services/                          # External service implementations
│   │   ├── EmailService.cs
│   │   ├── BlobStorageService.cs
│   │   └── SignalRNotificationService.cs
│   │
│   ├── Migrations/                        # EF Core migrations
│   │
│   └── CtrlZzz.Infrastructure.csproj
│
├── CtrlZzz.Web/                           # API/Presentation Layer
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   ├── WorkItemsController.cs
│   │   ├── SprintsController.cs
│   │   ├── BoardsController.cs
│   │   ├── TeamsController.cs
│   │   ├── UsersController.cs
│   │   └── ReportsController.cs
│   │
│   ├── Hubs/                              # SignalR hubs
│   │   └── NotificationHub.cs
│   │
│   ├── Middleware/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   ├── RequestLoggingMiddleware.cs
│   │   ├── PerformanceMiddleware.cs
│   │   └── TenantResolutionMiddleware.cs
│   │
│   ├── Filters/
│   │   ├── ValidationFilter.cs
│   │   └── AuthorizationFilter.cs
│   │
│   ├── Extensions/
│   │   ├── ServiceCollectionExtensions.cs
│   │   ├── ApplicationBuilderExtensions.cs
│   │   └── ControllerExtensions.cs
│   │
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── appsettings.Production.json
│   ├── Program.cs
│   └── CtrlZzz.Web.csproj
│
├── CtrlZzz.Shared/                        # Shared/Common Layer
│   ├── Constants/
│   │   ├── AppConstants.cs
│   │   ├── ErrorCodes.cs
│   │   └── Permissions.cs
│   │
│   ├── Helpers/
│   │   ├── DateTimeHelper.cs
│   │   ├── StringHelper.cs
│   │   └── ValidationHelper.cs
│   │
│   ├── Extensions/
│   │   ├── StringExtensions.cs
│   │   ├── DateTimeExtensions.cs
│   │   ├── EnumerableExtensions.cs
│   │   └── QueryableExtensions.cs
│   │
│   ├── Results/                           # Result pattern
│   │   ├── Result.cs
│   │   └── Result{T}.cs
│   │
│   └── CtrlZzz.Shared.csproj
│
└── CtrlZzz.AI/                            # Future AI Services
    ├── Interfaces/
    │   ├── ISummaryGenerator.cs
    │   ├── IPriorityPredictor.cs
    │   └── IWorkItemAnalyzer.cs
    │
    ├── Services/
    │   ├── OpenAISummaryService.cs
    │   └── WorkItemRecommendationService.cs
    │
    └── CtrlZzz.AI.csproj

tests/
├── CtrlZzz.Core.Tests/                    # Unit tests
│   ├── Services/
│   ├── Validators/
│   └── Specifications/
│
├── CtrlZzz.Infrastructure.Tests/          # Infrastructure tests
│   └── Repositories/
│
└── CtrlZzz.Web.Tests/                     # Integration tests
    └── Controllers/
```

## Domain Model

### Core Entities

#### BaseEntity
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }  // Soft delete
}
```

#### User
```csharp
public class User : BaseEntity
{
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public UserRole Role { get; set; }
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public ICollection<ProjectMember> ProjectMemberships { get; set; } = new List<ProjectMember>();
    public ICollection<WorkItem> AssignedWorkItems { get; set; } = new List<WorkItem>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
```

#### Organization
```csharp
public class Organization : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }

    // Navigation properties
    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<OrganizationMember> Members { get; set; } = new List<OrganizationMember>();
}
```

#### Project
```csharp
public class Project : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Key { get; set; } = null!;  // e.g., "CTRL", "JIRA"
    public string? Description { get; set; }
    public Guid OrganizationId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    // Navigation properties
    public Organization Organization { get; set; } = null!;
    public ICollection<WorkItem> WorkItems { get; set; } = new List<WorkItem>();
    public ICollection<Sprint> Sprints { get; set; } = new List<Sprint>();
    public ICollection<Board> Boards { get; set; } = new List<Board>();
    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
    public Workflow Workflow { get; set; } = null!;
}
```

#### WorkItem (Base Class)
```csharp
public abstract class WorkItem : BaseEntity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public WorkItemType Type { get; set; }
    public string WorkItemNumber { get; set; } = null!;  // e.g., "CTRL-123"

    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? ReporterId { get; set; }
    public Guid? SprintId { get; set; }
    public Guid? EpicId { get; set; }
    public Guid? ParentId { get; set; }

    public PriorityLevel Priority { get; set; }
    public Guid WorkflowStateId { get; set; }

    public int? StoryPoints { get; set; }
    public int? OriginalEstimateMinutes { get; set; }
    public int? RemainingEstimateMinutes { get; set; }
    public int? TimeSpentMinutes { get; set; }

    public DateTime? DueDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public User? Assignee { get; set; }
    public User? Reporter { get; set; }
    public Sprint? Sprint { get; set; }
    public WorkflowState WorkflowState { get; set; } = null!;

    public Epic? Epic { get; set; }
    public WorkItem? Parent { get; set; }
    public ICollection<WorkItem> Children { get; set; } = new List<WorkItem>();

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    public ICollection<ActivityLog> ActivityLogs { get; set; } = new List<ActivityLog>();
    public ICollection<WorkItemLabel> Labels { get; set; } = new List<WorkItemLabel>();
    public ICollection<WorkItemRelationship> RelatedFrom { get; set; } = new List<WorkItemRelationship>();
    public ICollection<WorkItemRelationship> RelatedTo { get; set; } = new List<WorkItemRelationship>();
    public ICollection<CustomFieldValue> CustomFieldValues { get; set; } = new List<CustomFieldValue>();
}
```

#### Specialized Work Items
```csharp
public class Epic : WorkItem
{
    public DateTime? EpicStartDate { get; set; }
    public DateTime? EpicEndDate { get; set; }
    public string? Color { get; set; }

    // Navigation properties
    public ICollection<Story> Stories { get; set; } = new List<Story>();
}

public class Story : WorkItem
{
    public string? AcceptanceCriteria { get; set; }
}

public class Task : WorkItem
{
    // Task-specific properties if needed
}

public class Bug : WorkItem
{
    public string? StepsToReproduce { get; set; }
    public string? ExpectedBehavior { get; set; }
    public string? ActualBehavior { get; set; }
    public string? Environment { get; set; }
}

public class Subtask : WorkItem
{
    // Inherits ParentId from WorkItem
}
```

#### Sprint
```csharp
public class Sprint : BaseEntity
{
    public string Name { get; set; } = null!;
    public string? Goal { get; set; }
    public Guid ProjectId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public SprintStatus Status { get; set; }  // Planning, Active, Completed

    // Navigation properties
    public Project Project { get; set; } = null!;
    public ICollection<WorkItem> WorkItems { get; set; } = new List<WorkItem>();
}
```

#### Board
```csharp
public class Board : BaseEntity
{
    public string Name { get; set; } = null!;
    public BoardType Type { get; set; }  // Scrum, Kanban
    public Guid ProjectId { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public ICollection<BoardColumn> Columns { get; set; } = new List<BoardColumn>();
}

public class BoardColumn : BaseEntity
{
    public string Name { get; set; } = null!;
    public int Order { get; set; }
    public Guid BoardId { get; set; }
    public Guid WorkflowStateId { get; set; }

    public Board Board { get; set; } = null!;
    public WorkflowState WorkflowState { get; set; } = null!;
}
```

#### Workflow & WorkflowState
```csharp
public class Workflow : BaseEntity
{
    public string Name { get; set; } = null!;
    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;
    public ICollection<WorkflowState> States { get; set; } = new List<WorkflowState>();
    public ICollection<WorkflowTransition> Transitions { get; set; } = new List<WorkflowTransition>();
}

public class WorkflowState : BaseEntity
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string Category { get; set; } = null!;  // ToDo, InProgress, Done
    public int Order { get; set; }
    public Guid WorkflowId { get; set; }

    public Workflow Workflow { get; set; } = null!;
}

public class WorkflowTransition : BaseEntity
{
    public Guid FromStateId { get; set; }
    public Guid ToStateId { get; set; }
    public Guid WorkflowId { get; set; }

    public WorkflowState FromState { get; set; } = null!;
    public WorkflowState ToState { get; set; } = null!;
    public Workflow Workflow { get; set; } = null!;
}
```

#### Comment & Attachment
```csharp
public class Comment : BaseEntity
{
    public string Content { get; set; } = null!;
    public Guid WorkItemId { get; set; }
    public Guid UserId { get; set; }

    public WorkItem WorkItem { get; set; } = null!;
    public User User { get; set; } = null!;
}

public class Attachment : BaseEntity
{
    public string FileName { get; set; } = null!;
    public string FileUrl { get; set; } = null!;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = null!;
    public Guid WorkItemId { get; set; }
    public Guid UploadedById { get; set; }

    public WorkItem WorkItem { get; set; } = null!;
    public User UploadedBy { get; set; } = null!;
}
```

#### ActivityLog
```csharp
public class ActivityLog : BaseEntity
{
    public string Action { get; set; } = null!;  // Created, Updated, Deleted, StatusChanged, etc.
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string FieldName { get; set; } = null!;
    public Guid WorkItemId { get; set; }
    public Guid UserId { get; set; }

    public WorkItem WorkItem { get; set; } = null!;
    public User User { get; set; } = null!;
}
```

#### Supporting Entities
```csharp
public class Team : BaseEntity
{
    public string Name { get; set; } = null!;
    public Guid OrganizationId { get; set; }

    public Organization Organization { get; set; } = null!;
    public ICollection<TeamMember> Members { get; set; } = new List<TeamMember>();
}

public class Label : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;
    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;
}

public class WorkItemRelationship : BaseEntity
{
    public Guid FromWorkItemId { get; set; }
    public Guid ToWorkItemId { get; set; }
    public RelationshipType Type { get; set; }  // Blocks, BlockedBy, RelatesTo, Duplicates

    public WorkItem FromWorkItem { get; set; } = null!;
    public WorkItem ToWorkItem { get; set; } = null!;
}
```

## Database Design Considerations

### UTC DateTime Storage
```csharp
// In ApplicationDbContext.cs
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Ensure all DateTime properties are stored as UTC
    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
        foreach (var property in entityType.GetProperties())
        {
            if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
            {
                // Store as UTC, no timezone conversion
                property.SetColumnType("datetime2");
            }
        }
    }
}

// Always use DateTime.UtcNow in application code
entity.CreatedAt = DateTime.UtcNow;
```

### Indexing Strategy
```csharp
// In entity configurations
public class WorkItemConfiguration : IEntityTypeConfiguration<WorkItem>
{
    public void Configure(EntityTypeBuilder<WorkItem> builder)
    {
        builder.HasIndex(w => w.ProjectId);
        builder.HasIndex(w => w.AssigneeId);
        builder.HasIndex(w => w.SprintId);
        builder.HasIndex(w => w.WorkItemNumber).IsUnique();
        builder.HasIndex(w => new { w.ProjectId, w.IsDeleted });
        builder.HasIndex(w => w.WorkflowStateId);
    }
}
```

### Soft Delete Implementation
```csharp
// Global query filter in DbContext
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<WorkItem>().HasQueryFilter(w => !w.IsDeleted);
    modelBuilder.Entity<Project>().HasQueryFilter(p => !p.IsDeleted);
    // Apply to all entities that inherit from BaseEntity
}

// To include soft-deleted items
var items = await context.WorkItems.IgnoreQueryFilters().ToListAsync();
```

### Multi-tenancy (Organization-level isolation)
```csharp
// In repository implementations, always filter by organization
public async Task<List<Project>> GetProjectsByOrganizationAsync(Guid organizationId)
{
    return await _context.Projects
        .Where(p => p.OrganizationId == organizationId)
        .ToListAsync();
}
```

### Database Provider Abstraction
```csharp
// In Program.cs, allow switching database providers
var databaseProvider = builder.Configuration.GetValue<string>("DatabaseProvider");

switch (databaseProvider)
{
    case "SqlServer":
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));
        break;

    case "PostgreSQL":
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));
        break;

    case "SQLite":
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(connectionString));
        break;
}
```

## API Design

### Endpoint Structure

#### Authentication Endpoints
```
POST   /api/v1/auth/register                # Register new user
POST   /api/v1/auth/login                   # Login
POST   /api/v1/auth/refresh                 # Refresh token
POST   /api/v1/auth/logout                  # Logout
POST   /api/v1/auth/forgot-password         # Request password reset
POST   /api/v1/auth/reset-password          # Reset password
```

#### Projects Endpoints
```
GET    /api/v1/projects                     # List all projects
POST   /api/v1/projects                     # Create project
GET    /api/v1/projects/{id}                # Get project by ID
PUT    /api/v1/projects/{id}                # Update project
DELETE /api/v1/projects/{id}                # Delete project
GET    /api/v1/projects/{id}/members        # Get project members
POST   /api/v1/projects/{id}/members        # Add member
DELETE /api/v1/projects/{id}/members/{userId} # Remove member
```

#### Work Items Endpoints
```
GET    /api/v1/projects/{projectId}/workitems           # List work items
POST   /api/v1/projects/{projectId}/workitems           # Create work item
GET    /api/v1/workitems/{id}                           # Get work item
PUT    /api/v1/workitems/{id}                           # Update work item
DELETE /api/v1/workitems/{id}                           # Delete work item
PATCH  /api/v1/workitems/{id}/status                    # Update status
PATCH  /api/v1/workitems/{id}/assign                    # Assign to user
GET    /api/v1/workitems/{id}/comments                  # Get comments
POST   /api/v1/workitems/{id}/comments                  # Add comment
GET    /api/v1/workitems/{id}/attachments               # Get attachments
POST   /api/v1/workitems/{id}/attachments               # Upload attachment
GET    /api/v1/workitems/{id}/activity                  # Get activity log
POST   /api/v1/workitems/{id}/relationships             # Create relationship
GET    /api/v1/workitems/{id}/relationships             # Get relationships
```

#### Sprints Endpoints
```
GET    /api/v1/projects/{projectId}/sprints             # List sprints
POST   /api/v1/projects/{projectId}/sprints             # Create sprint
GET    /api/v1/sprints/{id}                             # Get sprint
PUT    /api/v1/sprints/{id}                             # Update sprint
DELETE /api/v1/sprints/{id}                             # Delete sprint
POST   /api/v1/sprints/{id}/start                       # Start sprint
POST   /api/v1/sprints/{id}/complete                    # Complete sprint
GET    /api/v1/sprints/{id}/workitems                   # Get sprint work items
GET    /api/v1/sprints/{id}/report                      # Get sprint report
```

#### Boards Endpoints
```
GET    /api/v1/projects/{projectId}/boards              # List boards
POST   /api/v1/projects/{projectId}/boards              # Create board
GET    /api/v1/boards/{id}                              # Get board with columns
PUT    /api/v1/boards/{id}                              # Update board
DELETE /api/v1/boards/{id}                              # Delete board
GET    /api/v1/boards/{id}/workitems                    # Get board work items
POST   /api/v1/boards/{id}/columns                      # Add column
PUT    /api/v1/boards/{id}/columns/{columnId}           # Update column
DELETE /api/v1/boards/{id}/columns/{columnId}           # Delete column
```

#### Reports Endpoints
```
GET    /api/v1/projects/{projectId}/reports/burndown    # Burndown chart
GET    /api/v1/projects/{projectId}/reports/velocity    # Velocity chart
GET    /api/v1/projects/{projectId}/reports/cumulative-flow # CFD
GET    /api/v1/projects/{projectId}/reports/summary     # Project summary
GET    /api/v1/sprints/{sprintId}/reports/burndown      # Sprint burndown
```

### Request/Response Format

#### Standard API Response Envelope
```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public List<string> Errors { get; set; } = new();
}
```

#### Pagination
```csharp
public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}

// Example: GET /api/v1/workitems?page=1&pageSize=20&status=InProgress&assigneeId=xxx
```

#### Example Controller
```csharp
[ApiController]
[Route("api/v1/workitems")]
[Authorize]
public class WorkItemsController : ControllerBase
{
    private readonly IWorkItemService _workItemService;

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<WorkItemDetailDto>>> GetById(Guid id)
    {
        var workItem = await _workItemService.GetByIdAsync(id);

        if (workItem == null)
            return NotFound(new ApiResponse<WorkItemDetailDto>
            {
                Success = false,
                Message = "Work item not found"
            });

        return Ok(new ApiResponse<WorkItemDetailDto>
        {
            Success = true,
            Data = workItem
        });
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<WorkItemDto>>> Create(
        [FromBody] CreateWorkItemDto dto)
    {
        var workItem = await _workItemService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = workItem.Id },
            new ApiResponse<WorkItemDto>
            {
                Success = true,
                Data = workItem
            });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<WorkItemDto>>> Update(
        Guid id,
        [FromBody] UpdateWorkItemDto dto)
    {
        var workItem = await _workItemService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<WorkItemDto>
        {
            Success = true,
            Data = workItem
        });
    }
}
```

## Authentication & Authorization

### JWT Implementation
```csharp
// In Identity/JwtTokenGenerator.cs
public class JwtTokenGenerator
{
    public string GenerateAccessToken(User user, List<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(60);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### Role-Based Authorization
```csharp
public enum UserRole
{
    SystemAdmin,
    OrganizationAdmin,
    ProjectAdmin,
    Member,
    Viewer
}

// Usage in controllers
[Authorize(Roles = "SystemAdmin,OrganizationAdmin")]
public async Task<IActionResult> DeleteProject(Guid id) { }
```

### Permission-Based Authorization
```csharp
// Custom authorization attribute
public class HasPermissionAttribute : AuthorizeAttribute
{
    public HasPermissionAttribute(string permission)
    {
        Policy = permission;
    }
}

// Usage
[HasPermission(Permissions.EditWorkItem)]
public async Task<IActionResult> UpdateWorkItem(Guid id, UpdateWorkItemDto dto) { }
```

## Validation with FluentValidation

```csharp
public class CreateWorkItemDtoValidator : AbstractValidator<CreateWorkItemDto>
{
    public CreateWorkItemDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid priority level");

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(0, 100).When(x => x.StoryPoints.HasValue)
            .WithMessage("Story points must be between 0 and 100");

        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project ID is required");
    }
}

// Register in Program.cs
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateWorkItemDtoValidator>();
```

## Exception Handling

### Global Exception Middleware
```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

        var response = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "Resource not found"),
            ValidationException => (StatusCodes.Status400BadRequest, exception.Message),
            UnauthorizedException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            BusinessRuleException => (StatusCodes.Status422UnprocessableEntity, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred")
        };

        context.Response.StatusCode = response.Item1;
        context.Response.ContentType = "application/json";

        var apiResponse = new ApiResponse<object>
        {
            Success = false,
            Message = response.Item2,
            Errors = new List<string> { exception.Message }
        };

        await context.Response.WriteAsJsonAsync(apiResponse);
    }
}
```

## SignalR for Real-time Updates

```csharp
// Hubs/NotificationHub.cs
public class NotificationHub : Hub
{
    public async Task JoinProject(string projectId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"project-{projectId}");
    }

    public async Task LeaveProject(string projectId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"project-{projectId}");
    }
}

// In service, notify clients
public class WorkItemService : IWorkItemService
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public async Task<WorkItemDto> UpdateAsync(Guid id, UpdateWorkItemDto dto)
    {
        var workItem = await _repository.UpdateAsync(id, dto);

        // Notify connected clients
        await _hubContext.Clients
            .Group($"project-{workItem.ProjectId}")
            .SendAsync("WorkItemUpdated", workItem);

        return workItem;
    }
}
```

## Logging with Serilog

```csharp
// In Program.cs
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Usage in services
_logger.LogInformation("Creating work item {WorkItemTitle} for project {ProjectId}",
    dto.Title, dto.ProjectId);
```

## Repository Pattern

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<List<T>> GetAllAsync();
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<List<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    // ... other implementations
}

// Specialized repository
public interface IWorkItemRepository : IRepository<WorkItem>
{
    Task<List<WorkItem>> GetByProjectIdAsync(Guid projectId);
    Task<List<WorkItem>> GetBySprintIdAsync(Guid sprintId);
    Task<WorkItem?> GetByWorkItemNumberAsync(string workItemNumber);
}
```

## Unit of Work Pattern

```csharp
public interface IUnitOfWork : IDisposable
{
    IWorkItemRepository WorkItems { get; }
    IProjectRepository Projects { get; }
    ISprintRepository Sprints { get; }
    IUserRepository Users { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
```

## Testing Strategy

### Unit Tests
```csharp
public class WorkItemServiceTests
{
    private readonly Mock<IWorkItemRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;
    private readonly WorkItemService _service;

    public WorkItemServiceTests()
    {
        _mockRepo = new Mock<IWorkItemRepository>();
        _mockMapper = new Mock<IMapper>();
        _service = new WorkItemService(_mockRepo.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task CreateAsync_ValidDto_ReturnsWorkItem()
    {
        // Arrange
        var dto = new CreateWorkItemDto { Title = "Test Task" };
        var workItem = new Task { Id = Guid.NewGuid(), Title = "Test Task" };

        _mockMapper.Setup(m => m.Map<WorkItem>(dto)).Returns(workItem);
        _mockRepo.Setup(r => r.AddAsync(workItem)).ReturnsAsync(workItem);

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Test Task");
    }
}
```

### Integration Tests
```csharp
public class WorkItemsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public WorkItemsControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetWorkItem_ReturnsSuccess()
    {
        // Arrange
        var workItemId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/v1/workitems/{workItemId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
```

## AI Integration Points (Future)

### Service Interfaces
```csharp
public interface IAISummaryService
{
    Task<string> GenerateSprintSummaryAsync(Guid sprintId);
    Task<string> GenerateEpicSummaryAsync(Guid epicId);
    Task<string> SummarizeWorkItemAsync(Guid workItemId);
}

public interface IAIPriorityPredictor
{
    Task<PriorityLevel> PredictPriorityAsync(string title, string description);
}

public interface IAIWorkItemAnalyzer
{
    Task<List<WorkItemDto>> FindSimilarWorkItemsAsync(Guid workItemId);
    Task<List<string>> ExtractRequirementsAsync(string description);
}
```

## Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CtrlZzz;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
  },
  "DatabaseProvider": "SqlServer",
  "Jwt": {
    "Secret": "your-super-secret-key-min-32-chars",
    "Issuer": "CtrlZzz",
    "Audience": "CtrlZzzClients",
    "AccessTokenExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Cors": {
    "AllowedOrigins": ["http://localhost:5173"]
  }
}
```

## Deployment

### Docker Support
```dockerfile
# Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CtrlZzz.Web/CtrlZzz.Web.csproj", "CtrlZzz.Web/"]
COPY ["CtrlZzz.Core/CtrlZzz.Core.csproj", "CtrlZzz.Core/"]
COPY ["CtrlZzz.Infrastructure/CtrlZzz.Infrastructure.csproj", "CtrlZzz.Infrastructure/"]
RUN dotnet restore "CtrlZzz.Web/CtrlZzz.Web.csproj"
COPY . .
WORKDIR "/src/CtrlZzz.Web"
RUN dotnet build "CtrlZzz.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CtrlZzz.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CtrlZzz.Web.dll"]
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Status**: Planning Phase
