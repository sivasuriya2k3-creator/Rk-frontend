@echo off
echo ====================================
echo  RajKayal Creative Hub - Server Startup
echo ====================================
echo.

cd /d "%~dp0"

echo [1/3] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is not running! 
    echo Please start MongoDB first.
    pause
    exit /b 1
)

echo.
echo [2/3] Starting Backend Server (Port 5002)...
start "Backend Server" cmd /k "cd /d %~dp0 && set PORT=5002 && set CLIENT_URL=http://localhost:8081 && node server/index.js"
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting Frontend Server (Port 8081)...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ====================================
echo  Servers Starting...
echo ====================================
echo.
echo  Backend:  http://localhost:5002
echo  Frontend: http://localhost:8081
echo  API:      http://localhost:5002/api
echo.
echo Press any key to close this window...
pause >nul
