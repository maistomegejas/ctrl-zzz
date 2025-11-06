Write-Host "Starting CTRL-ZZZ Backend and Frontend..." -ForegroundColor Green
Write-Host ""

# Save original location
$originalLocation = Get-Location

# Run database migrations
Write-Host "Checking database migrations..." -ForegroundColor Yellow
$migrationsFolder = "$PWD/backend/CtrlZzz.Infrastructure/Migrations"

# Check if migrations exist, if not create initial migration
if (-not (Test-Path $migrationsFolder) -or (Get-ChildItem $migrationsFolder -Filter "*.cs" | Measure-Object).Count -eq 0) {
    Write-Host "No migrations found. Creating initial migration..." -ForegroundColor Yellow
    Set-Location backend/CtrlZzz.Web
    dotnet ef migrations add InitialCreate --project ../CtrlZzz.Infrastructure --startup-project . --output-dir Migrations
    Set-Location $originalLocation
}

# Apply migrations to database
Write-Host "Applying database migrations..." -ForegroundColor Yellow
Set-Location backend/CtrlZzz.Web
dotnet ef database update --project ../CtrlZzz.Infrastructure --startup-project .
Set-Location $originalLocation

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location $originalLocation

# Start backend process
Write-Host "Starting backend..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "$PWD/backend/CtrlZzz.Web" -PassThru -WindowStyle Hidden

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

# Track frontend process
$frontendProcess = $null

try {
    Set-Location frontend
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow -Wait
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow

    # Kill backend process and its children
    if ($backendProcess -and !$backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        # Kill child dotnet processes spawned by the main process
        Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $backendProcess.Id } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    }

    # Kill frontend process and its children
    if ($frontendProcess -and !$frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
        # Kill child node processes spawned by npm
        Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $frontendProcess.Id } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    }

    Set-Location $originalLocation
    Write-Host "All services stopped." -ForegroundColor Green
}
