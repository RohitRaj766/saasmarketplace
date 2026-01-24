@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║   Starting MFEs in Development Mode                   ║
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

echo.
echo ✅ MFEs built successfully!
echo.
echo 🚀 Starting preview servers...
echo.

cd ..\orders-mfe
start "Orders MFE" cmd /k "npm run preview"

cd ..\billing-mfe
start "Billing MFE" cmd /k "npm run preview"

echo.
echo ✅ MFEs are running!
echo.
echo Orders MFE: http://localhost:3001
echo Billing MFE: http://localhost:3002
echo.
echo Now start the Shell and Backend:
echo   Terminal 1: cd backend ^&^& npm run dev
echo   Terminal 2: cd shell ^&^& npm run dev
echo.
pause
