@echo off
title Pixel Marx - MLN111 Game & Live Tracker Server
echo ====================================================
echo   PIXEL MARX: DAU CHAN TRIET GIA - MLN111
echo   Dang khoi dong server va he thong Dashboard...
echo ====================================================
echo.

cd /d "%~dp0"

echo Dang giai phong cong 3000 (neu bi chiem)...
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo [1/2] Dang chay may chu Node.js tren cong 3000...
start "" http://localhost:3000/dashboard.html
start "" http://localhost:3000/
node server.js

pause
