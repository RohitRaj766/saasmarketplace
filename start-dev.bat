@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║   SaaS Marketplace Dashboard - Development Setup      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Docker is not running. Please start Docker first.
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

REM Check if node_modules exist
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

REM Setup database
echo 🗄️  Setting up database...
cd backend
call npx prisma generate
call npx prisma migrate dev --name init
call npx prisma db seed
cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start the development servers, run:
echo.
echo   Terminal 1: cd backend ^&^& npm run dev
echo   Terminal 2: cd shell ^&^& npm run dev
echo   Terminal 3: cd orders-mfe ^&^& npm run dev
echo   Terminal 4: cd billing-mfe ^&^& npm run dev
echo.
echo Or use the start-all script:
echo   npm run dev (from root directory)
echo.
echo 🌐 Access the application at: http://localhost:3000
echo.
echo Demo credentials:
echo   Email: admin@example.com
echo   Password: password123
echo.
pause
