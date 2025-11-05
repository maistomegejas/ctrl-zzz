@echo off
echo Starting CTRL-ZZZ Backend and Frontend...
echo.

REM Start backend in new window
start "CTRL-ZZZ Backend" cmd /k "cd backend\CtrlZzz.Web && dotnet run"

REM Wait a bit for backend to start
timeout /t 5 /nobreak

REM Start frontend in new window
start "CTRL-ZZZ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Backend started on: http://localhost:5000
echo Frontend started on: http://localhost:5173
echo.
echo Press any key to stop all services...
pause > nul

REM Kill the processes
taskkill /FI "WindowTitle eq CTRL-ZZZ Backend*" /F
taskkill /FI "WindowTitle eq CTRL-ZZZ Frontend*" /F
