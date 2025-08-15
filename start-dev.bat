@echo off
echo 🚀 Starting Ultimate Fitness App Development Environment...
echo.

echo 🗄️ Starting PostgreSQL database...
docker-compose up -d postgres
if %errorlevel% neq 0 (
    echo ❌ Failed to start database
    pause
    exit /b 1
)

echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak > nul

echo 🔧 Setting up backend...
cd back

echo 📦 Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

echo 🔄 Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    cd ..
    pause
    exit /b 1
)

echo 🗄️ Running database migrations...
call npx prisma migrate dev --name init

echo 🚀 Starting backend server in new window...
start "Backend Server" cmd /k "npm run start:dev"

cd ..

echo 🎨 Setting up frontend...
cd front

echo 📦 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

echo 🚀 Starting frontend server in new window...
start "Frontend Server" cmd /k "ng serve"

cd ..

echo.
echo 🎉 All services are starting up!
echo.
echo 📍 Access your application at:
echo    Frontend:  http://localhost:4200
echo    Backend:   http://localhost:3000
echo    API Docs:  http://localhost:3000/api/docs
echo.
echo ⏳ Please wait a few moments for all services to fully start...
echo.
echo 🛑 To stop all services, run: stop-dev.bat
echo.
pause
