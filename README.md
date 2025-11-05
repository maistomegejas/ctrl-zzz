# CTRL-ZZZ - Jira Clone

AI-Enhanced project management system inspired by Jira.

## Quick Start (Dice Roll Test)

This is a minimal setup to verify the stack works before building the full application.

## Prerequisites

- **.NET 8 SDK**: https://dotnet.microsoft.com/download/dotnet/8.0
- **Node.js (LTS)**: https://nodejs.org/

## Running Locally (Recommended)

### Option 1: Easy Start (Windows PowerShell)

```powershell
.\start-dev.ps1
```

This runs both backend and frontend in one terminal. Press Ctrl+C to stop both.

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
2. Click "Roll Dice" button
3. You should see a random number (1-6) from the backend

### API Endpoints

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- `GET /api/dice` - Returns a random dice roll (1-6)

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

## Next Steps

Once the dice roll test works:
1. Add database (MSSQL with Docker)
2. Implement authentication
3. Build core domain entities
4. Create MediatR CQRS handlers
5. Build React UI with Redux + DaisyUI

See `CLAUDE.md`, `FRONTEND.md`, and `BACKEND.md` for full architecture documentation.
