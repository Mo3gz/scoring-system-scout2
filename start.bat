@echo off
echo ========================================
echo Scout Game - Starting Application
echo ========================================
echo.

echo Cleaning cache and node_modules...
if exist node_modules rmdir /s /q node_modules
if exist client\node_modules rmdir /s /q client\node_modules
if exist client\build rmdir /s /q client\build

echo.
echo Installing dependencies...
call npm run install-all

echo.
echo Starting development servers...
echo Server will be available at: http://localhost:5000
echo Client will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

call npm run dev 