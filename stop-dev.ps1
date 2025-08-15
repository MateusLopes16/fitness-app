# Ultimate Fitness App - Stop Development Environment Script

Write-Host "🛑 Stopping Ultimate Fitness App Development Environment..." -ForegroundColor Red
Write-Host ""

# Stop Docker containers
Write-Host "🗄️ Stopping database and services..." -ForegroundColor Yellow
docker-compose down

# Kill Node processes (backend and frontend)
Write-Host "🔧 Stopping Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Stopped Node.js processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Node.js processes found" -ForegroundColor Cyan
}

# Kill Angular CLI processes
Write-Host "🎨 Stopping Angular processes..." -ForegroundColor Yellow
$ngProcesses = Get-Process -Name "ng" -ErrorAction SilentlyContinue
if ($ngProcesses) {
    $ngProcesses | Stop-Process -Force
    Write-Host "✅ Stopped Angular processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No Angular processes found" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ All services stopped successfully!" -ForegroundColor Green
Write-Host "🚀 To restart, run: .\start-dev.ps1" -ForegroundColor Cyan
