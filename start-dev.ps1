Write-Host "Starting CTRL-ZZZ Backend and Frontend..." -ForegroundColor Green
Write-Host ""

# Save original location
$originalLocation = Get-Location

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

    # Kill backend job
    Stop-Job $backend -ErrorAction SilentlyContinue
    Remove-Job $backend -ErrorAction SilentlyContinue

    # Kill all node processes (frontend)
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

    # Kill all dotnet processes (backend)
    Get-Process dotnet -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*CtrlZzz*" } | Stop-Process -Force -ErrorAction SilentlyContinue

    Set-Location $originalLocation
    Write-Host "All services stopped." -ForegroundColor Green
}
