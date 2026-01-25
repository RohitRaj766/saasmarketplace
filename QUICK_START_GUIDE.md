# OptiFlow SaaS - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use Neon/Supabase)
- Git

### Step 1: Environment Setup

1. **Backend Environment:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your database URL:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   JWT_SECRET="your-secret-key-here"
   REFRESH_TOKEN_SECRET="your-refresh-secret-here"
   ```

2. **Install Dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Shell
   cd ../shell
   npm install

   # Orders MFE
   cd ../orders-mfe
   npm install

   # Billing MFE
   cd ../billing-mfe
   npm install
   ```

### Step 2: Database Setup

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Seed production data (Atlassian + Zoho)
npx tsx prisma/seed-production.ts
```

You should see:
```
🎉 Production SaaS seeding completed successfully!
📊 SUMMARY:
   • 2 Tenants (Atlassian, Zoho)
   • 20 Users (10 per tenant)
   • 5 Feature subscriptions
   • 6 Orders
   • 6 Invoices
```

### Step 3: Start the Application

**Option A: Using Scripts (Recommended)**

Windows:
```bash
# Terminal 1: Start backend + MFEs
start-mfe-dev.bat

# Terminal 2: Start shell
cd shell
npm run dev
```

Linux/Mac:
```bash
# Terminal 1: Start backend + MFEs
./start-mfe-dev.sh

# Terminal 2: Start shell
cd shell
npm run dev
```

**Option B: Manual Start**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Orders MFE
cd orders-mfe
npm run build && npm run preview

# Terminal 3: Billing MFE
cd billing-mfe
npm run build && npm run preview

# Terminal 4: Shell
cd shell
npm run dev
```

### Step 4: Access the Application

Open your browser to: **http://localhost:3000**

## 🔐 Test Accounts

### Atlassian (Professional Tier)
**Features:** Orders + Billing + Analytics

| Email | Password | Role |
|-------|----------|------|
| mike.cannon@atlassian.com | password123 | Admin |
| scott.farquhar@atlassian.com | password123 | Admin |
| sarah.chen@atlassian.com | password123 | Manager |
| emma.wilson@atlassian.com | password123 | User |

**What to expect:**
- See "Atlassian" in header
- "Professional Plan" badge
- Sidebar shows: Dashboard, Orders, Billing, Analytics

### Zoho (Starter Tier)
**Features:** Orders + Admin

| Email | Password | Role |
|-------|----------|------|
| sridhar.vembu@zoho.com | password123 | Admin |
| raju.vegesna@zoho.com | password123 | Admin |
| priya.sharma@zoho.com | password123 | Manager |
| neha.reddy@zoho.com | password123 | User |

**What to expect:**
- See "Zoho Corporation" in header
- "Starter Plan" badge
- Sidebar shows: Dashboard, Orders, Team

## 🧪 Testing Scenarios

### Scenario 1: Feature-Based Navigation
1. Login as Atlassian user
2. Notice sidebar has: Orders, Billing, Analytics
3. Logout
4. Login as Zoho user
5. Notice sidebar has: Orders, Team (no Billing or Analytics)

### Scenario 2: Tenant Branding
1. Login as Atlassian user
2. Header shows "Atlassian" and "Professional Plan"
3. Logout
4. Login as Zoho user
5. Header shows "Zoho Corporation" and "Starter Plan"

### Scenario 3: Orders Module
1. Login as any user
2. Click "Orders" in sidebar
3. See list of orders for that tenant
4. Orders are tenant-isolated (Atlassian sees only their orders)

### Scenario 4: Billing Module
1. Login as Atlassian user (has billing feature)
2. Click "Billing" in sidebar
3. See invoices and payment history
4. Logout and login as Zoho user
5. Notice "Billing" is not in sidebar (feature disabled)

## 📊 Database Inspection

View your data using Prisma Studio:
```bash
cd backend
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- Browse all tenants
- View users per tenant
- Check feature subscriptions
- Inspect orders and invoices
- Review audit logs

## 🔧 Troubleshooting

### Issue: MFE not loading (404 on remoteEntry.js)
**Solution:** MFEs must be built and run in preview mode
```bash
cd orders-mfe
npm run build && npm run preview

cd billing-mfe
npm run build && npm run preview
```

### Issue: Login fails with "Invalid credentials"
**Solution:** Make sure you ran the seed script
```bash
cd backend
npx tsx prisma/seed-production.ts
```

### Issue: Database connection error
**Solution:** Check your DATABASE_URL in `backend/.env`
```bash
# Test connection
cd backend
npx prisma db pull
```

### Issue: Port already in use
**Solution:** Kill processes on ports 3000, 3001, 3002, 5000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📁 Project Structure

```
SaasMarketplace/
├── backend/              # Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed-production.ts
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── orders/
│       │   ├── billing/
│       │   └── tenants/
│       └── app.ts
├── shell/                # React Shell (Host)
│   └── src/
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── components/
│       └── pages/
├── orders-mfe/           # Orders Micro-Frontend
├── billing-mfe/          # Billing Micro-Frontend
└── docs/
    ├── PHASE2_UPGRADE.md
    ├── PRODUCT_REQUIREMENTS.md
    └── SAAS_IMPLEMENTATION_PLAN.md
```

## 🎯 Key Features Implemented

✅ Multi-tenant database with tenant isolation  
✅ Feature flag system (module subscriptions)  
✅ Dynamic navigation based on features  
✅ Tenant branding (name, subscription tier)  
✅ Role-based access control  
✅ JWT authentication with tenant context  
✅ Micro-frontend architecture  
✅ Module Federation for runtime loading  
✅ Audit logging system  
✅ Usage metrics tracking  

## 📚 Additional Documentation

- **PHASE2_UPGRADE.md** - Complete upgrade details
- **PRODUCT_REQUIREMENTS.md** - Product vision and requirements
- **SAAS_IMPLEMENTATION_PLAN.md** - Implementation roadmap
- **DATABASE_SCHEMA_SAAS.md** - Database design
- **ARCHITECTURE.md** - System architecture
- **RESUME_INTERVIEW_GUIDE.md** - Interview prep

## 🆘 Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Review **START_HERE.md** for detailed setup
3. Inspect **CHECKLIST.md** for step-by-step guide

## 🎓 Learning Resources

### Micro-Frontend Pattern
- Module Federation: https://webpack.js.org/concepts/module-federation/
- MFE Best Practices: https://martinfowler.com/articles/micro-frontends.html

### Multi-Tenancy
- Database Isolation: https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview
- SaaS Architecture: https://aws.amazon.com/saas/

### Tech Stack
- Prisma ORM: https://www.prisma.io/docs
- React Query: https://tanstack.com/query/latest
- Express.js: https://expressjs.com/

---

**Happy Coding! 🚀**
