Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Scout Game - Starting Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Cleaning cache and node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "client\node_modules") { Remove-Item -Recurse -Force "client\node_modules" }
if (Test-Path "client\build") { Remove-Item -Recurse -Force "client\build" }

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm run install-all

Write-Host ""
Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Green
Write-Host "Client will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

npm run dev 