# Ultimate Fitness App - First Time Setup Script
# Run this script once to set up your development environment

Write-Host "🔧 Ultimate Fitness App - First Time Setup" -ForegroundColor Green
Write-Host ""

# Check if .env exists, if not copy from example
Write-Host "🔍 Checking environment configuration..." -ForegroundColor Yellow

if (-not (Test-Path "back\.env")) {
    Write-Host "📝 Creating .env file from example..." -ForegroundColor Cyan
    Copy-Item "back\.env.example" "back\.env"
    Write-Host "✅ Created back\.env - Please review and update with your settings" -ForegroundColor Green
} else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

# Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Cyan
    exit 1
}

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

# Install global dependencies
Write-Host "🌐 Installing global dependencies..." -ForegroundColor Yellow

Write-Host "   Installing NestJS CLI..." -ForegroundColor Cyan
npm install -g @nestjs/cli

Write-Host "   Installing Angular CLI..." -ForegroundColor Cyan
npm install -g @angular/cli

Write-Host "   Installing Prisma CLI..." -ForegroundColor Cyan
npm install -g prisma

# Create initial database
Write-Host "🗄️ Setting up initial database..." -ForegroundColor Yellow
docker-compose up -d postgres

Write-Host "⏳ Waiting for database to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Install dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow

Write-Host "   Installing backend dependencies..." -ForegroundColor Cyan
Set-Location "back"
npm install
Set-Location ".."

Write-Host "   Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "front"
npm install
Set-Location ".."

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Review and update back\.env file with your settings" -ForegroundColor White
Write-Host "   2. Run .\start-dev.ps1 to start the development environment" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - README.md - Complete project overview" -ForegroundColor White
Write-Host "   - SETUP.md - Database design and architecture" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to develop your fitness app!" -ForegroundColor Green
