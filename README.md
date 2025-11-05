# CTRL-ZZZ - Jira Clone

AI-Enhanced project management system inspired by Jira.

## Quick Start (Dice Roll Test)

This is a minimal setup to verify the stack works before building the full application.

### Run with Docker Compose

```bash
docker-compose up --build
```

This will start:
- **Backend API** on http://localhost:5000
- **Frontend** on http://localhost:5173

### Test the Setup

1. Open http://localhost:5173 in your browser
2. Click "Roll Dice" button
3. You should see a random number (1-6) from the backend

### API Endpoints

- `GET /api/dice` - Returns a random dice roll (1-6)
- Swagger UI available at http://localhost:5000/swagger (when running locally)

### Development (without Docker)

**Backend:**
```bash
cd src/CtrlZzz.Web
dotnet run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Next Steps

Once the dice roll test works:
1. Add database (MSSQL with Docker)
2. Implement authentication
3. Build core domain entities
4. Create MediatR CQRS handlers
5. Build React UI with Redux + DaisyUI

See `CLAUDE.md`, `FRONTEND.md`, and `BACKEND.md` for full architecture documentation.
