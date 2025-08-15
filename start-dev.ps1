# Ultimate Fitness App - Development Setup Script
# This script will start the database, backend, and frontend

Write-Host "🚀 Starting Ultimate Fitness App Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($command)
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-CommandExists "docker-compose")) {
    Write-Host "❌ Docker Compose not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandExists "npm")) {
    Write-Host "❌ npm not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

if (-not (Test-CommandExists "ng")) {
    Write-Host "❌ Angular CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @angular/cli
}

Write-Host "✅ Prerequisites check completed!" -ForegroundColor Green
Write-Host ""

# Start database
Write-Host "🗄️ Starting PostgreSQL database..." -ForegroundColor Cyan
docker-compose up -d postgres
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start database" -ForegroundColor Red
    exit 1
}

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Setup and start backend
Write-Host "🔧 Setting up backend..." -ForegroundColor Cyan
Set-Location "back"

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Migration warning (might be normal if already exists)" -ForegroundColor Yellow
}

# Start backend in background
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev" -WindowStyle Minimized

Set-Location ".."

# Setup and start frontend
Write-Host "🎨 Setting up frontend..." -ForegroundColor Cyan
Set-Location "front"

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Start frontend in background
Write-Host "🚀 Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ng serve" -WindowStyle Minimized

Set-Location ".."

Write-Host ""
Write-Host "🎉 All services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your application at:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:4200" -ForegroundColor White
Write-Host "   Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "   API Docs:  http://localhost:3000/api/docs" -ForegroundColor White
Write-Host "   Database:  http://localhost:8080 (pgAdmin)" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait a few moments for all services to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 To stop all services, run: .\stop-dev.ps1" -ForegroundColor Red

# Optional: Start pgAdmin
$startPgAdmin = Read-Host "Do you want to start pgAdmin for database management? (y/N)"
if ($startPgAdmin -eq "y" -or $startPgAdmin -eq "Y") {
    Write-Host "🗄️ Starting pgAdmin..." -ForegroundColor Cyan
    docker-compose up -d pgadmin
    Write-Host "   pgAdmin: http://localhost:8080 (admin@fitness.local / admin123)" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ Development environment is ready! Happy coding! 🚀" -ForegroundColor Green
