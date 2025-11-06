# CTRL-ZZZ - Jira Clone

AI-Enhanced project management system inspired by Jira.

## Quick Start (Dice Roll Test)

This is a minimal setup to verify the stack works before building the full application.

## Prerequisites

- **.NET 8 SDK**: https://dotnet.microsoft.com/download/dotnet/8.0
- **Node.js (LTS)**: https://nodejs.org/
- **SQL Server LocalDB**: Comes with Visual Studio or SQL Server Express
- **EF Core Tools**: Install with `dotnet tool install --global dotnet-ef`

## Running Locally (Recommended)

### Option 1: Easy Start (Windows PowerShell)

```powershell
.\start-dev.ps1
```

This script automatically:
- Creates and applies database migrations (first run)
- Starts backend and frontend
- Press Ctrl+C to stop both services

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend/CtrlZzz.Web
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Test the Setup

1. Open http://localhost:3001 in your browser
2. Open http://localhost:5000/swagger to see API documentation
3. Database is created automatically in LocalDB

### API Endpoints

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger

## Running with Docker (Optional)

```bash
# With Docker Compose
docker-compose up --build

# With Podman Compose
podman-compose up --build
# OR
python -m podman_compose up --build
```

**Note**: Docker/Podman may have issues on corporate networks. Local development works reliably.

## Project Status

✅ Clean Architecture foundation with domain entities (User, Project, WorkItem)
✅ Database with EF Core + SQL Server LocalDB
✅ Unit test projects setup (xUnit, Moq, FluentAssertions)
⏳ Next: JWT authentication and MediatR CRUD handlers

See `CLAUDE.md`, `FRONTEND.md`, and `BACKEND.md` for full architecture documentation.
