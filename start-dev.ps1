Write-Host "Starting CTRL-ZZZ Backend and Frontend..." -ForegroundColor Green
Write-Host ""

# Save original location
$originalLocation = Get-Location

# Run database migrations
Write-Host "Checking database migrations..." -ForegroundColor Yellow
$migrationsFolder = "$PWD/backend/CtrlZzz.Infrastructure/Migrations"

Set-Location backend/CtrlZzz.Web

# If no migrations exist at all, create initial migration
if (-not (Test-Path $migrationsFolder) -or (Get-ChildItem $migrationsFolder -Filter "*.cs" | Measure-Object).Count -eq 0) {
    Write-Host "No migrations found. Creating initial migration..." -ForegroundColor Yellow
    dotnet ef migrations add InitialCreate --project ../CtrlZzz.Infrastructure --startup-project . --output-dir Migrations

    # Stage and commit the migration
    Set-Location ../..
    git add backend/CtrlZzz.Infrastructure/Migrations/
    git commit -m "Add InitialCreate migration (auto-generated)" --no-verify
    Set-Location backend/CtrlZzz.Web
}
else {
    # Try to create a migration to check for pending changes
    Write-Host "Checking for pending model changes..." -ForegroundColor Yellow

    # Generate migration name with timestamp
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $migrationName = "Migration_$timestamp"

    # Capture output to check if changes were detected
    $output = dotnet ef migrations add $migrationName --project ../CtrlZzz.Infrastructure --startup-project . --output-dir Migrations 2>&1

    # Check if migration was actually created (EF says "No changes" if there are none)
    if ($output -match "No changes" -or $output -match "no model changes") {
        Write-Host "No pending model changes detected." -ForegroundColor Green

        # Remove the empty migration if it was created
        dotnet ef migrations remove --project ../CtrlZzz.Infrastructure --startup-project . --force 2>&1 | Out-Null
    }
    else {
        Write-Host "Pending model changes detected. Migration created: $migrationName" -ForegroundColor Yellow

        # Stage and commit the migration
        Set-Location ../..
        git add backend/CtrlZzz.Infrastructure/Migrations/
        git commit -m "Add $migrationName (auto-generated)" --no-verify
        Set-Location backend/CtrlZzz.Web
    }
}

# Apply migrations to database
Write-Host "Applying database migrations..." -ForegroundColor Yellow
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
