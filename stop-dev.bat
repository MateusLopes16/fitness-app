@echo off
echo 🛑 Stopping Ultimate Fitness App Development Environment...
echo.

echo 🗄️ Stopping database and services...
docker-compose down

echo 🔧 Stopping Node.js processes...
taskkill /f /im node.exe > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Stopped Node.js processes
) else (
    echo ℹ️ No Node.js processes found
)

echo.
echo ✅ All services stopped successfully!
echo 🚀 To restart, run: start-dev.bat
echo.
pause
