#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║   OptiFlow SaaS Platform - Complete Startup           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
fi

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check and install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "shell/node_modules" ]; then
    echo "📦 Installing shell dependencies..."
    cd shell
    npm install
    cd ..
fi

if [ ! -d "orders-mfe/node_modules" ]; then
    echo "📦 Installing orders-mfe dependencies..."
    cd orders-mfe
    npm install
    cd ..
fi

if [ ! -d "billing-mfe/node_modules" ]; then
    echo "📦 Installing billing-mfe dependencies..."
    cd billing-mfe
    npm install
    cd ..
fi

if [ ! -d "analytics-mfe/node_modules" ]; then
    echo "📦 Installing analytics-mfe dependencies..."
    cd analytics-mfe
    npm install
    cd ..
fi

if [ ! -d "admin-mfe/node_modules" ]; then
    echo "📦 Installing admin-mfe dependencies..."
    cd admin-mfe
    npm install
    cd ..
fi

# Setup database
echo "🗄️  Setting up database..."
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
cd ..

echo ""
echo "📦 Building all MFEs..."
echo ""

echo "📦 Building Orders MFE..."
cd orders-mfe
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Orders MFE build failed"
    exit 1
fi

echo "📦 Building Billing MFE..."
cd ../billing-mfe
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Billing MFE build failed"
    exit 1
fi

echo "📦 Building Analytics MFE..."
cd ../analytics-mfe
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Analytics MFE build failed"
    exit 1
fi

echo "📦 Building Admin MFE..."
cd ../admin-mfe
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Admin MFE build failed"
    exit 1
fi

echo ""
echo "✅ All MFEs built successfully!"
echo ""
echo "🚀 Starting all services..."
echo ""

# Start MFE preview servers in background
cd ../orders-mfe
npm run preview > /dev/null 2>&1 &
sleep 2

cd ../billing-mfe
npm run preview > /dev/null 2>&1 &
sleep 2

cd ../analytics-mfe
npm run preview > /dev/null 2>&1 &
sleep 2

cd ../admin-mfe
npm run preview > /dev/null 2>&1 &
sleep 2

# Start Backend
cd ../backend
npm run dev > /dev/null 2>&1 &
sleep 3

# Start Shell
cd ../shell
npm run dev &

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ OptiFlow is starting up!                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Services:"
echo "  • Shell App:     http://localhost:3000"
echo "  • Backend API:   http://localhost:5000"
echo "  • Orders MFE:    http://localhost:3001"
echo "  • Billing MFE:   http://localhost:3002"
echo "  • Analytics MFE: http://localhost:3003"
echo "  • Admin MFE:     http://localhost:3004"
echo ""
echo "🔐 Test Accounts:"
echo "  Atlassian: admin@atlassian.com / password123"
echo "  Zoho:      admin@zoho.com / password123"
echo ""
echo "⏳ Wait 10-15 seconds for all services to start..."
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "💡 To stop all services, press Ctrl+C"
echo ""

# Wait for user interrupt
wait
