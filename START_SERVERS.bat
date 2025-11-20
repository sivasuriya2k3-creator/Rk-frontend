@echo off
echo ============================================
echo  RK Website - Start Both Servers
echo ============================================
echo.

echo [1/4] Checking for running node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Starting Backend Server (Port 5002)...
start "Backend Server" cmd /k "cd /d "%~dp0server" && node index.js"
timeout /t 3 /nobreak >nul

echo [3/4] Starting Frontend Server (Port 8081)...
start "Frontend Server" cmd /k "cd /d "%~dp0" && npm run dev"
timeout /t 3 /nobreak >nul

echo [4/4] Servers Started!
echo.
echo ============================================
echo  SERVERS ARE RUNNING
echo ============================================
echo.
echo  Backend:  http://localhost:5002
echo  Frontend: http://localhost:8081
echo.
echo  Login Credentials:
echo  Email:    rajkayal7281@gmail.com
echo  Password: admin123
echo.
echo  Note: OTP is DISABLED (SKIP_OTP=true)
echo        You can login directly!
echo.
echo ============================================
echo.
pause
