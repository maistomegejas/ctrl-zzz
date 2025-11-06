# CTRL-ZZZ - AI-Enhanced Jira Clone
## High-Level Architecture Documentation

## Overview
CTRL-ZZZ is a modern project management system inspired by Jira. The system allows teams to manage tasks, bugs, stories, epics, sprints, and all standard project management entities.

**IMPORTANT: This is a Jira clone first. AI features are FUTURE plans only - not part of current implementation.**

## Technology Stack

### Frontend
- **Vite + React 18+ + TypeScript**
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **DaisyUI + Tailwind CSS** - UI components and styling
- **Axios** - HTTP client
- **React Hook Form + Zod** - Forms and validation

### Backend
- **ASP.NET Core 8.0 Web API**
- **Entity Framework Core 8.0** - ORM
- **MediatR** - CQRS pattern (all business logic here)
- **AutoMapper** - Object mapping
- **FluentValidation** - Request validation
- **FluentResults** (or similar) - Result pattern
- **Ardalis.Specification** - Query specifications
- **JWT Bearer** - Authentication
- **SignalR** - Real-time updates (for future AI features)

### Database
- **Microsoft SQL Server** (with PostgreSQL compatibility)
- Store all dates as UTC
- Avoid DB-specific functions in queries

### DevOps
- **Docker + Docker Compose** - Launch entire stack with one command

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Redux)                  │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/REST + SignalR
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Layer (Controllers)                     │
│          Thin controllers - just call MediatR               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MediatR Handlers (Business Logic)               │
│          Commands, Queries, Validators                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer (Entities)                   │
│              + Ardalis Specifications                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          Infrastructure (EF Core, Repositories)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database (MSSQL/PostgreSQL)                │
└─────────────────────────────────────────────────────────────┘
```

## Core Domain Entities

### Primary Entities
1. **Organization** - Top-level container
2. **Project** - Contains all work items and boards
3. **WorkItem** (base class)
   - **Epic** - Large body of work
   - **Story** - User-facing feature
   - **Task** - Unit of work
   - **Bug** - Defect
   - **Subtask** - Child work item
4. **Sprint** - Time-boxed iteration
5. **Board** - Kanban/Scrum visualization
6. **User** - System user
7. **Team** - Group of users
8. **Workflow** - State machine for work items
9. **Comment** - Discussions
10. **Attachment** - File attachments
11. **ActivityLog** - Audit trail

### Key Concepts
- **Priority**: Blocker, Critical, High, Medium, Low
- **Status**: Customizable per workflow (To Do, In Progress, Done, etc.)
- **Story Points**: Estimation
- **Time Tracking**: Original estimate, remaining, time logged
- **Relationships**: Blocks, Blocked By, Relates To, Parent-Child
- **Labels/Tags**: Categorization

## Project Structure

### Backend Structure
```
backend/
├── CtrlZzz.Core/              # Domain + Application
│   ├── Entities/              # Domain entities
│   ├── Enums/                 # Enumerations
│   ├── Interfaces/            # Repository interfaces
│   ├── Specifications/        # Ardalis specs
│   └── Features/              # MediatR handlers
│       ├── WorkItems/
│       │   ├── Commands/
│       │   │   ├── CreateWorkItem/
│       │   │   │   ├── CreateWorkItemCommand.cs
│       │   │   │   ├── CreateWorkItemHandler.cs
│       │   │   │   └── CreateWorkItemValidator.cs
│       │   │   └── UpdateWorkItem/
│       │   └── Queries/
│       │       ├── GetWorkItem/
│       │       └── GetWorkItems/
│       ├── Projects/
│       ├── Sprints/
│       └── Auth/
│
├── CtrlZzz.Infrastructure/    # Data access
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   └── Configurations/
│   ├── Repositories/
│   └── Services/
│
├── CtrlZzz.Web/               # API
│   ├── Controllers/
│   ├── Hubs/                  # SignalR
│   ├── Middleware/
│   └── Program.cs
│
└── CtrlZzz.Shared/            # Common utilities
    ├── Constants/
    └── Extensions/
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/            # Reusable components
│   ├── features/              # Feature modules with Redux slices
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── workitems/
│   │   ├── boards/
│   │   └── sprints/
│   ├── store/                 # Redux store
│   ├── services/              # API clients
│   ├── types/                 # TypeScript types
│   ├── hooks/                 # Custom hooks
│   ├── router/                # React Router config
│   └── App.tsx
```

## Backend Pattern: MediatR CQRS

### Controller (Thin)
```csharp
[ApiController]
[Route("api/[controller]")]
public class WorkItemsController : ControllerBase
{
    private readonly IMediator _mediator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWorkItemCommand command)
    {
        var result = await _mediator.Send(command);

        return result.IsSuccess
            ? Ok(result.Value)
            : BadRequest(result.Errors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetWorkItemQuery(id));

        return result.IsSuccess
            ? Ok(result.Value)
            : NotFound();
    }
}
```

### Command Handler (Business Logic)
```csharp
public class CreateWorkItemHandler : IRequestHandler<CreateWorkItemCommand, Result<WorkItemDto>>
{
    private readonly IRepository<WorkItem> _repository;
    private readonly IMapper _mapper;

    public async Task<Result<WorkItemDto>> Handle(CreateWorkItemCommand request, CancellationToken ct)
    {
        var workItem = _mapper.Map<WorkItem>(request);
        workItem.CreatedAt = DateTime.UtcNow;

        await _repository.AddAsync(workItem);

        var dto = _mapper.Map<WorkItemDto>(workItem);
        return Result.Ok(dto);
    }
}
```

### Validator
```csharp
public class CreateWorkItemValidator : AbstractValidator<CreateWorkItemCommand>
{
    public CreateWorkItemValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ProjectId).NotEmpty();
        RuleFor(x => x.Priority).IsInEnum();
    }
}
```

## Frontend Pattern: Redux Toolkit

### Redux Slice
```typescript
// features/workitems/workItemsSlice.ts
const workItemsSlice = createSlice({
  name: 'workItems',
  initialState,
  reducers: {
    addWorkItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkItems.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

// Async thunk
export const fetchWorkItems = createAsyncThunk(
  'workItems/fetchAll',
  async (projectId: string) => {
    const response = await workItemService.getAll(projectId);
    return response.data;
  }
);
```

### API Service
```typescript
// services/workItemService.ts
export const workItemService = {
  getAll: (projectId: string) =>
    api.get(`/api/workitems?projectId=${projectId}`),

  getById: (id: string) =>
    api.get(`/api/workitems/${id}`),

  create: (data: CreateWorkItemDto) =>
    api.post('/api/workitems', data),
};
```

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
```

### Projects
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

### Work Items
```
GET    /api/workitems?projectId={id}&status={status}
POST   /api/workitems
GET    /api/workitems/{id}
PUT    /api/workitems/{id}
DELETE /api/workitems/{id}
PATCH  /api/workitems/{id}/status
GET    /api/workitems/{id}/comments
POST   /api/workitems/{id}/comments
```

### Sprints
```
GET    /api/sprints?projectId={id}
POST   /api/sprints
GET    /api/sprints/{id}
PUT    /api/sprints/{id}
POST   /api/sprints/{id}/start
POST   /api/sprints/{id}/complete
```

### Boards
```
GET    /api/boards?projectId={id}
POST   /api/boards
GET    /api/boards/{id}
GET    /api/boards/{id}/workitems
```

## Database Design Principles

1. **UTC Everywhere**: Always use `DateTime.UtcNow`
2. **Soft Delete**: `IsDeleted` flag on entities
3. **Audit Fields**: `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`
4. **Multi-tenancy**: Filter by `OrganizationId`
5. **Provider Agnostic**: Avoid SQL Server specific functions

### Base Entity
```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
}
```

## AI Integration (FUTURE ONLY - NOT CURRENT SCOPE)

**DO NOT implement AI features now. Focus on building the Jira clone first.**

### Future AI Plans (for later):
1. **Smart Summaries**: Generate sprint/epic summaries
2. **Priority Suggestions**: AI predicts priority based on content
3. **Similar Ticket Detection**: Find related work items
4. **Time Estimation**: Suggest story points
5. **Anomaly Detection**: Identify stuck tasks

### Why SignalR is included:
- SignalR will be useful when AI features are added later
- Real-time AI suggestions and updates
- For now, it's just part of the architecture plan

### When implementing AI (future):
- Separate service interfaces in `CtrlZzz.AI` project
- Inject through dependency injection
- Feature flags to enable/disable
- Async processing for AI operations

## Authentication

- **JWT tokens** with refresh tokens
- **Roles**: Admin, Member, Viewer
- Tokens stored in localStorage (frontend)
- Authorization header: `Bearer {token}`

## Real-time Updates (for future AI features)

- **SignalR** will be used later for real-time AI suggestions
- For now, regular REST API calls are sufficient
- When AI is added: `connection.on('AISuggestionReady', callback)`

## Development Workflow

**IMPORTANT FOR CLAUDE (AI ASSISTANT):**
- **YOU must create database migrations and commit them** before pushing code
- User only runs `start-dev.ps1` which applies existing migrations
- DO NOT tell user to manually run `dotnet ef migrations add` commands

### Workflow Steps:

1. **Create entity** in Core/Entities
2. **Add EF configuration** in Infrastructure/Data/Configurations or ApplicationDbContext
3. **CREATE MIGRATION** (CLAUDE does this):
   ```bash
   cd backend/CtrlZzz.Web
   dotnet ef migrations add MigrationName --project ../CtrlZzz.Infrastructure --startup-project . --output-dir Migrations
   cd ../..
   ```
4. **Commit migration files** to git (in `backend/CtrlZzz.Infrastructure/Migrations/`)
5. **Create MediatR command/query** in Core/Features
6. **Add validator** for command
7. **Write unit tests** for handlers and validators
8. **Create controller endpoint** that calls MediatR
9. **Frontend: Add Redux slice** and async thunks
10. **Frontend: Create components** and hook up to Redux
11. **Run tests**: `dotnet test` (must pass before commit)
12. **Commit and push** to feature branch

**User workflow after pulling:**
- User runs `.\start-dev.ps1`
- Script automatically applies migrations from `Migrations/` folder
- No manual database commands needed

## Unit Testing (CRITICAL)

**Unit tests are VERY IMPORTANT and MUST be written for all business logic.**

### Test Project Structure
```
backend/
├── CtrlZzz.Core.Tests/          # Tests for Core layer
├── CtrlZzz.Infrastructure.Tests/ # Tests for Infrastructure
└── CtrlZzz.Web.Tests/           # Integration tests for API
```

### Testing Requirements

1. **Separate test projects** - DO NOT mix tests with source code
2. **Run tests BEFORE every commit** - Tests must pass before pushing
3. **Test coverage for**:
   - MediatR command/query handlers
   - Validators
   - Domain entity logic
   - Repository implementations
   - API endpoints (integration tests)

### Testing Stack
- **xUnit** - Test framework
- **Moq** - Mocking library
- **FluentAssertions** - Assertion library
- **AutoFixture** - Test data generation

### Pre-Commit Checklist
```bash
# Run all tests
dotnet test

# Only commit if all tests pass
git add -A
git commit -m "Your message"
git push
```

**NEVER commit code without running tests first.**

## Git Workflow (IMPORTANT)

**ALWAYS push changes to a feature branch, NEVER directly to main.**

### Branch Naming Convention
All feature branches MUST follow this pattern:
```
claude/<feature-name>-<session-id>
```

Example: `claude/dice-roll-setup-011CUpMxvoWCSRdtoGde9Z5x`

### Workflow Steps

1. **Create feature branch** from main:
```bash
git checkout -b claude/<feature-name>-011CUpMxvoWCSRdtoGde9Z5x
```

2. **Make changes and commit**:
```bash
git add -A
git commit -m "Descriptive commit message"
```

3. **Push to remote feature branch** (REQUIRED after every change):
```bash
git push -u origin claude/<feature-name>-011CUpMxvoWCSRdtoGde9Z5x
```

4. **User merges to main** via Pull Request or manually

5. **Delete feature branch** after merge:
```bash
git branch -d claude/<feature-name>-011CUpMxvoWCSRdtoGde9Z5x
git push origin --delete claude/<feature-name>-011CUpMxvoWCSRdtoGde9Z5x
```

### Important Notes
- ❌ NEVER push directly to `main` - it will fail with 403 error
- ✅ ALWAYS push to `claude/*-sessionId` branches
- ✅ Push to remote after EVERY significant change
- ✅ This makes changes visible on GitHub immediately
- User handles merging to main and branch cleanup

## Docker Setup

```yaml
# docker-compose.yml
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
    ports:
      - "1433:1433"

  api:
    build: ./backend/CtrlZzz.Web
    ports:
      - "5000:80"
    environment:
      - ConnectionStrings__DefaultConnection=Server=db;Database=CtrlZzz;User=sa;Password=YourPassword123!
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3001:3001"
    depends_on:
      - api
```

## Next Steps (Focus on Jira Clone)

1. ✅ Setup solution structure
2. ✅ Create domain entities
3. Setup EF Core + migrations
4. Setup unit test projects (xUnit)
5. Implement auth with JWT
6. Create first MediatR handlers (Projects CRUD)
7. Write unit tests for handlers and validators
8. Setup React + Redux + DaisyUI
9. Create basic UI components
10. Implement boards with drag & drop
11. Complete all Jira features (sprints, work items, etc.)
12. **LATER:** Add AI features and SignalR real-time updates

---

**Version**: 1.0
**Updated**: 2025-11-05
**Status**: Planning Phase
