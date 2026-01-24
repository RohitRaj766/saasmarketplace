#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Starting MFEs in Development Mode                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📦 Building Orders MFE...${NC}"
cd orders-mfe
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Orders MFE build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Billing MFE...${NC}"
cd ../billing-mfe
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Billing MFE build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ MFEs built successfully!${NC}"
echo ""
echo -e "${YELLOW}🚀 Starting preview servers...${NC}"
echo ""

cd ../orders-mfe
npm run preview &
ORDERS_PID=$!

cd ../billing-mfe
npm run preview &
BILLING_PID=$!

echo ""
echo -e "${GREEN}✅ MFEs are running!${NC}"
echo ""
echo -e "${BLUE}Orders MFE:${NC} http://localhost:3001"
echo -e "${BLUE}Billing MFE:${NC} http://localhost:3002"
echo ""
echo -e "${YELLOW}Now start the Shell and Backend:${NC}"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd shell && npm run dev"
echo ""
echo "Press Ctrl+C to stop all MFEs"

# Wait for Ctrl+C
trap "kill $ORDERS_PID $BILLING_PID; exit" INT
wait
