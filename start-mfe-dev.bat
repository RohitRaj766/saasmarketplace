@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║   Starting OptiFlow SaaS Platform                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo 📦 Building Orders MFE...
cd orders-mfe
call npm run build
if errorlevel 1 (
    echo ❌ Orders MFE build failed
    pause
    exit /b 1
)

echo 📦 Building Billing MFE...
cd ..\billing-mfe
call npm run build
if errorlevel 1 (
    echo ❌ Billing MFE build failed
    pause
    exit /b 1
)

echo 📦 Building Analytics MFE...
cd ..\analytics-mfe
call npm run build
if errorlevel 1 (
    echo ❌ Analytics MFE build failed
    pause
    exit /b 1
)

echo 📦 Building Admin MFE...
cd ..\admin-mfe
call npm run build
if errorlevel 1 (
    echo ❌ Admin MFE build failed
    pause
    exit /b 1
)

echo.
echo ✅ All MFEs built successfully!
echo.
echo 🚀 Starting all services...
echo.

REM Start MFE preview servers
cd ..\orders-mfe
start "Orders MFE (Port 3001)" cmd /k "npm run preview"
timeout /t 2 /nobreak >nul

cd ..\billing-mfe
start "Billing MFE (Port 3002)" cmd /k "npm run preview"
timeout /t 2 /nobreak >nul

cd ..\analytics-mfe
start "Analytics MFE (Port 3003)" cmd /k "npm run preview"
timeout /t 2 /nobreak >nul

cd ..\admin-mfe
start "Admin MFE (Port 3004)" cmd /k "npm run preview"
timeout /t 2 /nobreak >nul

REM Start Backend
cd ..\backend
start "Backend API (Port 5000)" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

REM Start Shell
cd ..\shell
start "Shell App (Port 3000)" cmd /k "npm run dev"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   ✅ OptiFlow is starting up!                         ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📊 Services:
echo   • Orders MFE:    http://localhost:3001
echo   • Billing MFE:   http://localhost:3002
echo   • Analytics MFE: http://localhost:3003
echo   • Admin MFE:     http://localhost:3004
echo   • Backend API:   http://localhost:5000
echo   • Shell App:     http://localhost:3000
echo.
echo 🔐 Test Accounts:
echo   Atlassian: mike.cannon@atlassian.com / password123
echo   Zoho:      sridhar.vembu@zoho.com / password123
echo.
echo ⏳ Wait 10-15 seconds for all services to start...
echo 🌐 Then open: http://localhost:3000
echo.
echo 💡 To stop all services, close all terminal windows.
echo.
pause

