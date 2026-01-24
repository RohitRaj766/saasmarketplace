#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SaaS Marketplace Dashboard - Development Setup      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}📝 Creating backend/.env file...${NC}"
    cp backend/.env.example backend/.env
fi

# Start PostgreSQL
echo -e "${GREEN}🐘 Starting PostgreSQL...${NC}"
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo -e "${GREEN}📦 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "shell/node_modules" ]; then
    echo -e "${GREEN}📦 Installing shell dependencies...${NC}"
    cd shell && npm install && cd ..
fi

if [ ! -d "orders-mfe/node_modules" ]; then
    echo -e "${GREEN}📦 Installing orders-mfe dependencies...${NC}"
    cd orders-mfe && npm install && cd ..
fi

if [ ! -d "billing-mfe/node_modules" ]; then
    echo -e "${GREEN}📦 Installing billing-mfe dependencies...${NC}"
    cd billing-mfe && npm install && cd ..
fi

# Setup database
echo -e "${GREEN}🗄️  Setting up database...${NC}"
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}To start the development servers, run:${NC}"
echo ""
echo -e "  ${YELLOW}Terminal 1:${NC} cd backend && npm run dev"
echo -e "  ${YELLOW}Terminal 2:${NC} cd shell && npm run dev"
echo -e "  ${YELLOW}Terminal 3:${NC} cd orders-mfe && npm run dev"
echo -e "  ${YELLOW}Terminal 4:${NC} cd billing-mfe && npm run dev"
echo ""
echo -e "${BLUE}Or use the start-all script:${NC}"
echo -e "  ${YELLOW}npm run dev${NC} (from root directory)"
echo ""
echo -e "${GREEN}🌐 Access the application at:${NC} http://localhost:3000"
echo ""
echo -e "${BLUE}Demo credentials:${NC}"
echo -e "  Email: admin@example.com"
echo -e "  Password: password123"
echo ""
