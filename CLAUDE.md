# CTRL-ZZZ - AI-Enhanced Jira Clone
## High-Level Architecture Documentation

## Overview
CTRL-ZZZ is a modern project management system inspired by Jira, with built-in AI capabilities to enhance workflow efficiency. The system allows teams to manage tasks, bugs, stories, epics, sprints, and all standard project management entities with intelligent automation and insights.

## System Architecture

### Technology Stack
- **Frontend**: React 18+ with TypeScript, Vite (for fast development and optimized builds)
- **Backend**: ASP.NET Core 8.0 Web API
- **Database**: Microsoft SQL Server (with abstraction layer for PostgreSQL/other RDBMS compatibility)
- **Authentication**: JWT-based authentication with refresh tokens
- **AI Integration**: Prepared architecture for future AI services (summary generation, task estimation, priority suggestions, anomaly detection)

### Architectural Pattern
**Clean Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│                    (React + TypeScript)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Layer (Web)                       │
│              Controllers, Middleware, Filters                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer (Core)                 │
│         Services, DTOs, Interfaces, Business Logic           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer (Core)                    │
│            Entities, Value Objects, Domain Events            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│     Data Access, External Services, Repositories             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Shared Layer                           │
│      Common Utilities, Extensions, Constants                 │
└─────────────────────────────────────────────────────────────┘
```

## Core Domain Concepts

### Primary Entities
1. **Organization/Workspace** - Top-level container for projects
2. **Project** - Contains all work items, boards, and settings
3. **Work Items** (base entity with specializations):
   - **Epic** - Large body of work spanning multiple sprints
   - **Story** - User-facing feature or requirement
   - **Task** - Unit of work
   - **Bug** - Defect or issue
   - **Subtask** - Child work item
4. **Sprint/Iteration** - Time-boxed development period
5. **Board** - Visualization (Scrum board, Kanban board)
6. **User** - System user with roles and permissions
7. **Team** - Group of users working on projects
8. **Workflow** - Customizable state machine for work items
9. **Comment** - Discussion on work items
10. **Attachment** - Files associated with work items
11. **Activity Log** - Audit trail of changes

### Key Domain Concepts
- **Priority Levels**: Blocker, Critical, High, Medium, Low
- **Work Item States**: Customizable per workflow (e.g., To Do, In Progress, In Review, Done)
- **Story Points**: Estimation metric
- **Time Tracking**: Original estimate, remaining, time logged
- **Relationships**: Blocks, Blocked by, Relates to, Parent-Child, Epic-Story
- **Labels/Tags**: Flexible categorization
- **Custom Fields**: Extensible metadata

## AI Integration Points (Future)

### Planned AI Capabilities
1. **Intelligent Summaries**
   - Generate sprint summaries
   - Project health reports
   - Epic/story summarization

2. **Predictive Analytics**
   - Sprint velocity predictions
   - Deadline risk assessment
   - Bottleneck identification

3. **Smart Suggestions**
   - Auto-priority assignment based on content analysis
   - Similar ticket detection
   - Optimal assignee recommendations

4. **Natural Language Processing**
   - Convert text to structured work items
   - Extract requirements from descriptions
   - Sentiment analysis on comments

5. **Workflow Optimization**
   - Identify inefficient patterns
   - Suggest process improvements
   - Anomaly detection (e.g., tasks stuck too long)

### AI Architecture Considerations
- **Service Layer Abstraction**: AI services will be injected through interfaces
- **Async Processing**: AI operations run asynchronously via background jobs
- **Caching Strategy**: Cache AI-generated insights with TTL
- **Extensibility**: Plugin architecture for different AI providers (OpenAI, Azure OpenAI, custom models)
- **Fallback Mechanisms**: System remains fully functional without AI

## Backend Project Structure

```
src/
├── CtrlZzz.Core/                  # Domain + Application Layer
│   ├── Entities/                  # Domain entities
│   ├── ValueObjects/              # Value objects (Email, WorkItemState, etc.)
│   ├── Interfaces/                # Repository and service interfaces
│   ├── Services/                  # Business logic services
│   ├── DTOs/                      # Data transfer objects
│   ├── Exceptions/                # Domain exceptions
│   └── Specifications/            # Query specifications
│
├── CtrlZzz.Infrastructure/        # Data access + External services
│   ├── Data/                      # EF Core DbContext, configurations
│   ├── Repositories/              # Repository implementations
│   ├── Services/                  # External service implementations
│   ├── Migrations/                # Database migrations
│   └── Identity/                  # Authentication/Authorization setup
│
├── CtrlZzz.Web/                   # API Layer
│   ├── Controllers/               # REST API endpoints
│   ├── Middleware/                # Custom middleware
│   ├── Filters/                   # Action filters
│   ├── Extensions/                # Service registration extensions
│   └── Program.cs                 # Application entry point
│
├── CtrlZzz.Shared/                # Cross-cutting concerns
│   ├── Constants/                 # Application constants
│   ├── Helpers/                   # Utility functions
│   ├── Extensions/                # Extension methods
│   └── Results/                   # Result pattern types
│
└── CtrlZzz.AI/                    # Future AI services (not yet implemented)
    ├── Interfaces/                # AI service contracts
    ├── Services/                  # AI service implementations
    └── Models/                    # AI-specific models
```

## Frontend Project Structure

```
frontend/
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── common/               # Generic components (Button, Input, etc.)
│   │   ├── layout/               # Layout components (Header, Sidebar, etc.)
│   │   └── domain/               # Domain-specific components
│   ├── features/                  # Feature-based modules
│   │   ├── auth/                 # Authentication
│   │   ├── projects/             # Project management
│   │   ├── workitems/            # Work items (tasks, bugs, stories)
│   │   ├── boards/               # Kanban/Scrum boards
│   │   ├── sprints/              # Sprint management
│   │   └── reports/              # Reporting and analytics
│   ├── hooks/                     # Custom React hooks
│   ├── services/                  # API client services
│   ├── store/                     # State management (Zustand/Redux)
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Utility functions
│   ├── styles/                    # Global styles
│   └── App.tsx                    # Main application component
```

## Key Architectural Decisions

### 1. Database Abstraction
- Use **Entity Framework Core** with provider-agnostic approach
- **DateTime handling**: Always use `DateTime.UtcNow` and store as UTC
- **Avoid database-specific functions** in queries (use LINQ)
- Configuration per database provider via appsettings
- Easily swap between MSSQL, PostgreSQL, SQLite

### 2. API Design Principles
- **RESTful conventions** with proper HTTP verbs
- **Versioning**: URL-based versioning (/api/v1/)
- **Pagination**: Offset-based with metadata (total, page, pageSize)
- **Filtering**: Query string parameters with standardized naming
- **Response format**: Consistent envelope pattern
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "errors": []
}
```

### 3. Authentication & Authorization
- **JWT tokens** with refresh token rotation
- **Role-based access control (RBAC)**: System Admin, Org Admin, Project Admin, Member, Viewer
- **Permission-based** fine-grained access (e.g., CAN_EDIT_WORK_ITEM, CAN_DELETE_PROJECT)
- **Multi-tenancy**: Organization-level data isolation

### 4. State Management (Frontend)
- **Zustand** for global state (lightweight, less boilerplate than Redux)
- **React Query** for server state management (caching, refetching, optimistic updates)
- Local component state for UI-only concerns

### 5. Real-time Updates
- **SignalR** for real-time notifications (work item updates, comments, etc.)
- Fallback to polling for clients that don't support WebSockets

### 6. Validation Strategy
- **Client-side**: Zod schemas for TypeScript validation
- **Server-side**: FluentValidation for DTOs and commands
- Never trust client input

### 7. Error Handling
- **Global exception middleware** on backend
- **Typed errors** with error codes
- **Client-side**: Axios interceptors for consistent error handling
- User-friendly error messages with technical details in logs

### 8. Logging & Monitoring
- **Serilog** for structured logging
- Log levels: Trace, Debug, Information, Warning, Error, Critical
- Correlation IDs for request tracing
- Future: Application Insights or similar APM

### 9. Testing Strategy
- **Backend**: Unit tests (xUnit), Integration tests with WebApplicationFactory
- **Frontend**: Vitest for unit tests, React Testing Library for components, Playwright for E2E
- **AI Integration**: Mock AI services in tests, separate AI integration tests

## Security Considerations

1. **OWASP Top 10 Compliance**
   - SQL Injection: Parameterized queries (EF Core)
   - XSS: Content sanitization, CSP headers
   - CSRF: SameSite cookies, anti-forgery tokens
   - Authentication: Secure password hashing (bcrypt/PBKDF2)

2. **Data Privacy**
   - GDPR compliance considerations
   - User data export/deletion capabilities
   - Audit logging for sensitive operations

3. **API Security**
   - Rate limiting per user/IP
   - Request size limits
   - CORS configuration
   - HTTPS only in production

## Performance Considerations

1. **Database Optimization**
   - Proper indexing strategy
   - Eager/lazy loading decisions
   - Query result caching (Redis in future)
   - Connection pooling

2. **Frontend Performance**
   - Code splitting by route
   - Lazy loading for heavy components
   - Virtual scrolling for large lists
   - Image optimization
   - Bundle size monitoring

3. **API Performance**
   - Response compression
   - ETags for caching
   - GraphQL consideration for complex queries (future)
   - Background job processing (Hangfire for long-running tasks)

## Scalability Plan

### Phase 1 (Current): Monolithic Architecture
- Single API server
- Single database
- Simple deployment

### Phase 2 (Future): Enhanced Scalability
- Horizontal scaling with load balancer
- Database read replicas
- Redis cache layer
- CDN for static assets

### Phase 3 (Future): Microservices (If needed)
- Separate AI service
- Notification service
- File storage service
- Event-driven architecture with message bus

## Development Workflow

1. **Feature Development**
   - Feature branch from main
   - Backend: Create entity → Repository → Service → Controller
   - Frontend: API types → Service → UI components
   - Tests for each layer

2. **Database Changes**
   - Code-first migrations
   - Migration naming: `YYYYMMDDHHMMSS_DescriptiveName`
   - Always test migrations up and down

3. **Code Standards**
   - Backend: C# conventions, follow SOLID principles
   - Frontend: ESLint + Prettier configuration
   - Commit messages: Conventional Commits format

## Deployment Strategy

### Development Environment
- Local development with Docker Compose
- MSSQL container or LocalDB
- Hot reload for frontend and backend

### Production Environment
- Docker containers orchestrated by Kubernetes (or simpler: Docker Compose for MVP)
- Automated CI/CD pipeline
- Database migrations as part of deployment
- Blue-green deployment for zero downtime

## Next Steps

1. Set up project structure (backend projects + frontend scaffold)
2. Implement core domain entities
3. Database schema and migrations
4. Authentication/Authorization infrastructure
5. Basic CRUD operations for work items
6. Frontend component library
7. Board visualization
8. Sprint management
9. Reporting and analytics
10. AI integration (future phase)

## Success Metrics

- **Performance**: API response time < 200ms for 95th percentile
- **Reliability**: 99.9% uptime
- **User Experience**: Time to create work item < 10 seconds
- **Code Quality**: > 80% test coverage
- **Security**: Zero critical vulnerabilities

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Status**: Planning Phase
