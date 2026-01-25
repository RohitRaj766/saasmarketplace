#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Starting OptiFlow SaaS Platform                     ║${NC}"
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

echo -e "${YELLOW}📦 Building Analytics MFE...${NC}"
cd ../analytics-mfe
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Analytics MFE build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Admin MFE...${NC}"
cd ../admin-mfe
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Admin MFE build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All MFEs built successfully!${NC}"
echo ""
echo -e "${YELLOW}🚀 Starting all services...${NC}"
echo ""

# Start MFE preview servers
cd ../orders-mfe
npm run preview > /dev/null 2>&1 &
ORDERS_PID=$!
sleep 2

cd ../billing-mfe
npm run preview > /dev/null 2>&1 &
BILLING_PID=$!
sleep 2

cd ../analytics-mfe
npm run preview > /dev/null 2>&1 &
ANALYTICS_PID=$!
sleep 2

cd ../admin-mfe
npm run preview > /dev/null 2>&1 &
ADMIN_PID=$!
sleep 2

# Start Backend
cd ../backend
npm run dev > /dev/null 2>&1 &
BACKEND_PID=$!
sleep 3

# Start Shell
cd ../shell
npm run dev > /dev/null 2>&1 &
SHELL_PID=$!

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ✅ OptiFlow is starting up!                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📊 Services:${NC}"
echo -e "   • Orders MFE:    ${BLUE}http://localhost:3001${NC}"
echo -e "   • Billing MFE:   ${BLUE}http://localhost:3002${NC}"
echo -e "   • Analytics MFE: ${BLUE}http://localhost:3003${NC}"
echo -e "   • Admin MFE:     ${BLUE}http://localhost:3004${NC}"
echo -e "   • Backend API:   ${BLUE}http://localhost:5000${NC}"
echo -e "   • Shell App:     ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}🔐 Test Accounts:${NC}"
echo "   Atlassian: mike.cannon@atlassian.com / password123"
echo "   Zoho:      sridhar.vembu@zoho.com / password123"
echo ""
echo -e "${YELLOW}⏳ Wait 10-15 seconds for all services to start...${NC}"
echo -e "${GREEN}🌐 Then open: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping all services...'; kill $ORDERS_PID $BILLING_PID $ANALYTICS_PID $ADMIN_PID $BACKEND_PID $SHELL_PID 2>/dev/null; echo 'All services stopped.'; exit" INT
wait

