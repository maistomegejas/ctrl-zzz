# Backend Architecture - CTRL-ZZZ
## ASP.NET Core + MediatR CQRS + Clean Architecture

## Tech Stack

- **ASP.NET Core 8.0** - Web API
- **Entity Framework Core 8.0** - ORM
- **MediatR** - CQRS pattern (all business logic)
- **AutoMapper** - Object mapping
- **FluentValidation** - Request validation
- **FluentResults** - Result pattern
- **Ardalis.Specification** - Query specifications
- **JWT Bearer** - Authentication
- **SignalR** - Real-time updates (for future AI features only)
- **Serilog** - Logging

## Solution Structure

```
backend/
├── CtrlZzz.Core/                      # Domain + Application
│   ├── Entities/                      # Domain entities
│   │   ├── BaseEntity.cs
│   │   ├── User.cs
│   │   ├── Organization.cs
│   │   ├── Project.cs
│   │   ├── WorkItem.cs (abstract)
│   │   ├── Epic.cs
│   │   ├── Story.cs
│   │   ├── Task.cs
│   │   ├── Bug.cs
│   │   ├── Sprint.cs
│   │   ├── Board.cs
│   │   ├── Comment.cs
│   │   └── ...
│   │
│   ├── Enums/
│   │   ├── PriorityLevel.cs
│   │   ├── WorkItemType.cs
│   │   └── UserRole.cs
│   │
│   ├── Interfaces/
│   │   ├── IRepository.cs
│   │   └── IUnitOfWork.cs
│   │
│   ├── Specifications/                # Ardalis specs
│   │   ├── WorkItemSpecs.cs
│   │   └── ProjectSpecs.cs
│   │
│   └── Features/                      # MediatR CQRS
│       ├── Auth/
│       │   ├── Login/
│       │   │   ├── LoginCommand.cs
│       │   │   ├── LoginHandler.cs
│       │   │   └── LoginValidator.cs
│       │   └── Register/
│       │
│       ├── Projects/
│       │   ├── Commands/
│       │   │   ├── CreateProject/
│       │   │   └── UpdateProject/
│       │   └── Queries/
│       │       ├── GetProject/
│       │       └── GetProjects/
│       │
│       ├── WorkItems/
│       │   ├── Commands/
│       │   │   ├── CreateWorkItem/
│       │   │   ├── UpdateWorkItem/
│       │   │   └── DeleteWorkItem/
│       │   └── Queries/
│       │       ├── GetWorkItem/
│       │       └── GetWorkItems/
│       │
│       └── Sprints/
│           ├── Commands/
│           └── Queries/
│
├── CtrlZzz.Infrastructure/            # Data + External services
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   └── Configurations/
│   │       ├── UserConfiguration.cs
│   │       ├── ProjectConfiguration.cs
│   │       └── WorkItemConfiguration.cs
│   │
│   ├── Repositories/
│   │   ├── Repository.cs
│   │   └── UnitOfWork.cs
│   │
│   └── Services/
│       ├── JwtTokenService.cs
│       └── EmailService.cs
│
├── CtrlZzz.Web/                       # API layer
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProjectsController.cs
│   │   ├── WorkItemsController.cs
│   │   └── SprintsController.cs
│   │
│   ├── Hubs/                          # (FUTURE - for AI features)
│   │   └── AIHub.cs
│   │
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   │
│   ├── appsettings.json
│   └── Program.cs
│
└── CtrlZzz.Shared/
    ├── Constants/
    └── Extensions/
```

## Core Entities

### BaseEntity
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
}
```

### WorkItem (Abstract)
```csharp
public abstract class WorkItem : BaseEntity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public WorkItemType Type { get; set; }
    public string WorkItemNumber { get; set; } = null!; // e.g., "CTRL-123"

    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? SprintId { get; set; }
    public Guid? ParentId { get; set; }

    public PriorityLevel Priority { get; set; }
    public Guid WorkflowStateId { get; set; }

    public int? StoryPoints { get; set; }
    public DateTime? DueDate { get; set; }

    // Navigation properties
    public Project Project { get; set; } = null!;
    public User? Assignee { get; set; }
    public Sprint? Sprint { get; set; }
    public WorkflowState WorkflowState { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
```

### Derived WorkItems
```csharp
public class Epic : WorkItem { }
public class Story : WorkItem
{
    public string? AcceptanceCriteria { get; set; }
}
public class Task : WorkItem { }
public class Bug : WorkItem
{
    public string? StepsToReproduce { get; set; }
}
```

## MediatR CQRS Pattern

### Command
```csharp
// Features/WorkItems/Commands/CreateWorkItem/CreateWorkItemCommand.cs
public class CreateWorkItemCommand : IRequest<Result<WorkItemDto>>
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public WorkItemType Type { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public PriorityLevel Priority { get; set; }
    public int? StoryPoints { get; set; }
}
```

### Validator
```csharp
// Features/WorkItems/Commands/CreateWorkItem/CreateWorkItemValidator.cs
public class CreateWorkItemValidator : AbstractValidator<CreateWorkItemCommand>
{
    public CreateWorkItemValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.ProjectId)
            .NotEmpty();

        RuleFor(x => x.Priority)
            .IsInEnum();

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(0, 100)
            .When(x => x.StoryPoints.HasValue);
    }
}
```

### Handler
```csharp
// Features/WorkItems/Commands/CreateWorkItem/CreateWorkItemHandler.cs
public class CreateWorkItemHandler : IRequestHandler<CreateWorkItemCommand, Result<WorkItemDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateWorkItemHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<WorkItemDto>> Handle(
        CreateWorkItemCommand request,
        CancellationToken ct)
    {
        // Create entity
        var workItem = CreateWorkItemByType(request.Type);
        _mapper.Map(request, workItem);
        workItem.CreatedAt = DateTime.UtcNow;

        // Generate work item number (e.g., PROJ-123)
        workItem.WorkItemNumber = await GenerateWorkItemNumber(request.ProjectId);

        // Save
        await _unitOfWork.WorkItems.AddAsync(workItem);
        await _unitOfWork.SaveChangesAsync();

        var dto = _mapper.Map<WorkItemDto>(workItem);
        return Result.Ok(dto);
    }

    private WorkItem CreateWorkItemByType(WorkItemType type) => type switch
    {
        WorkItemType.Epic => new Epic(),
        WorkItemType.Story => new Story(),
        WorkItemType.Task => new Task(),
        WorkItemType.Bug => new Bug(),
        _ => throw new ArgumentException($"Invalid work item type: {type}")
    };
}
```

### Query
```csharp
// Features/WorkItems/Queries/GetWorkItems/GetWorkItemsQuery.cs
public class GetWorkItemsQuery : IRequest<Result<List<WorkItemDto>>>
{
    public Guid ProjectId { get; set; }
    public WorkItemStatus? Status { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? SprintId { get; set; }
}

// Handler
public class GetWorkItemsHandler : IRequestHandler<GetWorkItemsQuery, Result<List<WorkItemDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public async Task<Result<List<WorkItemDto>>> Handle(
        GetWorkItemsQuery request,
        CancellationToken ct)
    {
        var spec = new WorkItemsByProjectSpec(request.ProjectId)
            .WithStatus(request.Status)
            .WithAssignee(request.AssigneeId)
            .WithSprint(request.SprintId);

        var workItems = await _unitOfWork.WorkItems.ListAsync(spec);
        var dtos = _mapper.Map<List<WorkItemDto>>(workItems);

        return Result.Ok(dtos);
    }
}
```

## Controller (Thin)

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WorkItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkItemsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetWorkItemsQuery query)
    {
        var result = await _mediator.Send(query);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetWorkItemQuery { Id = id });
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWorkItemCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(result.Errors);

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWorkItemCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteWorkItemCommand { Id = id });
        return result.IsSuccess ? NoContent() : NotFound();
    }
}
```

## Repository Pattern

```csharp
// Interfaces/IRepository.cs
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id);
    Task<List<T>> ListAsync(ISpecification<T> spec);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

// Infrastructure/Repositories/Repository.cs
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<List<T>> ListAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return entity;
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator.GetQuery(_dbSet.AsQueryable(), spec);
    }
}
```

## Unit of Work

```csharp
// Interfaces/IUnitOfWork.cs
public interface IUnitOfWork : IDisposable
{
    IRepository<WorkItem> WorkItems { get; }
    IRepository<Project> Projects { get; }
    IRepository<Sprint> Sprints { get; }
    IRepository<User> Users { get; }

    Task<int> SaveChangesAsync();
}

// Infrastructure/Repositories/UnitOfWork.cs
public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        WorkItems = new Repository<WorkItem>(context);
        Projects = new Repository<Project>(context);
        Sprints = new Repository<Sprint>(context);
        Users = new Repository<User>(context);
    }

    public IRepository<WorkItem> WorkItems { get; }
    public IRepository<Project> Projects { get; }
    public IRepository<Sprint> Sprints { get; }
    public IRepository<User> Users { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
```

## Program.cs Setup

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// MediatR
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(CreateWorkItemCommand).Assembly));

// FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(CreateWorkItemValidator).Assembly);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

// SignalR (FUTURE - for AI features)
// builder.Services.AddSignalR();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3001")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// SignalR Hub (FUTURE - for AI features)
// app.MapHub<AIHub>("/hubs/ai");

app.Run();
```

## Validation Pipeline Behavior

```csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!_validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, ct)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
        {
            var errors = failures.Select(f => f.ErrorMessage).ToList();
            return (TResponse)(object)Result.Fail(errors);
        }

        return await next();
    }
}
```

## Exception Handling Middleware

```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred");

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = "An unexpected error occurred",
                message = ex.Message
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
```

## SignalR Hub (FUTURE - for AI features only)

**DO NOT implement SignalR now. It's only needed later for real-time AI suggestions.**

```csharp
// Hubs/AIHub.cs (FUTURE IMPLEMENTATION)
// This will be used when AI features are added
public class AIHub : Hub
{
    public async Task SubscribeToAISuggestions(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }
}

// Example usage in future AI handler:
// await _hubContext.Clients
//     .Group($"user-{userId}")
//     .SendAsync("AISuggestionReady", suggestion);
```

## Database Configuration

```csharp
// Infrastructure/Data/Configurations/WorkItemConfiguration.cs
public class WorkItemConfiguration : IEntityTypeConfiguration<WorkItem>
{
    public void Configure(EntityTypeBuilder<WorkItem> builder)
    {
        builder.HasKey(w => w.Id);

        builder.Property(w => w.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(w => w.WorkItemNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(w => w.WorkItemNumber).IsUnique();
        builder.HasIndex(w => w.ProjectId);
        builder.HasIndex(w => w.AssigneeId);

        // Soft delete filter
        builder.HasQueryFilter(w => !w.IsDeleted);

        // Table-per-hierarchy for inheritance
        builder.HasDiscriminator<WorkItemType>("Type")
            .HasValue<Epic>(WorkItemType.Epic)
            .HasValue<Story>(WorkItemType.Story)
            .HasValue<Task>(WorkItemType.Task)
            .HasValue<Bug>(WorkItemType.Bug);
    }
}
```

## appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CtrlZzz;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "CtrlZzz",
    "Audience": "CtrlZzzClients",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## Migrations

```bash
# Add migration
dotnet ef migrations add InitialCreate --project backend/CtrlZzz.Infrastructure --startup-project backend/CtrlZzz.Web

# Update database
dotnet ef database update --project backend/CtrlZzz.Infrastructure --startup-project backend/CtrlZzz.Web
```

---

**Version**: 1.0
**Updated**: 2025-11-05
