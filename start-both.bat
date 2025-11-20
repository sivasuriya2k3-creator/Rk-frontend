@echo off
echo Starting RajKayal Creative Hub...
echo.
echo Starting Backend Server on port 5002...
start "Backend Server" cmd /k "cd /d %~dp0 && node server/index.js"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server on port 8081...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5002
echo Frontend: http://localhost:8081
echo.
pause
