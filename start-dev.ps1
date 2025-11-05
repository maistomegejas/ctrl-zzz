Write-Host "Starting CTRL-ZZZ Backend and Frontend..." -ForegroundColor Green
Write-Host ""

# Start backend in background job
Write-Host "Starting backend..." -ForegroundColor Yellow
$backend = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend/CtrlZzz.Web
    dotnet run
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in foreground
Write-Host "Starting frontend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Gray
Write-Host ""

try {
    Set-Location frontend
    npm run dev
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Job $backend
    Remove-Job $backend
    Write-Host "All services stopped." -ForegroundColor Green
}
