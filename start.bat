@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║   OptiFlow SaaS Platform - Complete Startup           ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if .env files exist
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
)

if not exist "backend\.env" (
    echo 📝 Creating backend\.env file...
    copy backend\.env.example backend\.env
)

REM Start PostgreSQL
echo 🐘 Starting PostgreSQL...
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

REM Check and install dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "shell\node_modules" (
    echo 📦 Installing shell dependencies...
    cd shell
    call npm install
    cd ..
)

if not exist "orders-mfe\node_modules" (
    echo 📦 Installing orders-mfe dependencies...
    cd orders-mfe
    call npm install
    cd ..
)

if not exist "billing-mfe\node_modules" (
    echo 📦 Installing billing-mfe dependencies...
    cd billing-mfe
    call npm install
    cd ..
)

if not exist "analytics-mfe\node_modules" (
    echo 📦 Installing analytics-mfe dependencies...
    cd analytics-mfe
    call npm install
    cd ..
)

if not exist "admin-mfe\node_modules" (
    echo 📦 Installing admin-mfe dependencies...
    cd admin-mfe
    call npm install
    cd ..
)

REM Setup database
echo 🗄️  Setting up database...
cd backend
call npx prisma generate
call npx prisma migrate deploy
call npx prisma db seed
cd ..

echo.
echo 📦 Building all MFEs...
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
echo   • Shell App:     http://localhost:3000
echo   • Backend API:   http://localhost:5000
echo   • Orders MFE:    http://localhost:3001
echo   • Billing MFE:   http://localhost:3002
echo   • Analytics MFE: http://localhost:3003
echo   • Admin MFE:     http://localhost:3004
echo.
echo 🔐 Test Accounts:
echo   Atlassian: admin@atlassian.com / password123
echo   Zoho:      admin@zoho.com / password123
echo.
echo ⏳ Wait 10-15 seconds for all services to start...
echo 🌐 Then open: http://localhost:3000
echo.
echo 💡 To stop all services, close all terminal windows.
echo.
pause
