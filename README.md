# OptiFlow - Enterprise SaaS Operations Platform

> A production-ready SaaS platform built with Micro-Frontend architecture, featuring multi-tenancy, feature flags, and dynamic module loading.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-brightgreen)](https://www.prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)

## 🎯 Overview

OptiFlow is a comprehensive SaaS operations management platform demonstrating enterprise-grade patterns:

- **4 Micro-Frontends:** Orders, Billing, Analytics, Admin
- **Multi-Tenancy:** Database-level isolation with 2 production tenants
- **Feature Flags:** Subscription-based module access
- **Dynamic Loading:** Runtime MFE integration via Module Federation
- **Production Data:** 20 users, realistic transactional data

## ✨ Features

### 🏢 Multi-Tenant Architecture
- **Atlassian** (Professional Tier): Orders + Billing + Analytics
- **Zoho** (Starter Tier): Orders + Admin
- Database-level tenant isolation
- Custom branding per tenant

### 📦 Micro-Frontends
1. **Orders MFE** - Order management and tracking
2. **Billing MFE** - Invoices and payment history
3. **Analytics MFE** - Business intelligence with charts
4. **Admin MFE** - Team management and activity logs

### 🔐 Security & Auth
- JWT-based authentication
- Role-based access control (Admin, Manager, User)
- Tenant context in tokens
- Password hashing with bcrypt

### 📊 Analytics & Reporting
- Revenue trend charts
- Order status tracking
- Team performance metrics
- Date range filtering

### 👥 Team Management
- User invitation system
- Role management
- Activity timeline
- Audit logging

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
PostgreSQL
npm or yarn
```

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd SaasMarketplace

# Install all dependencies
npm install --prefix backend
npm install --prefix shell
npm install --prefix orders-mfe
npm install --prefix billing-mfe
npm install --prefix analytics-mfe
npm install --prefix admin-mfe
```

2. **Database Setup**
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations and seed
npx prisma migrate dev
npx tsx prisma/seed-production.ts
```

3. **Start Everything**

**One Command Startup (Easiest):**

Windows:
```bash
start-all.bat
```

Linux/Mac:
```bash
chmod +x start-all.sh
./start-all.sh
```

This will:
- Build all 4 MFEs
- Start all MFE preview servers
- Start the backend API
- Start the Shell application

Wait 10-15 seconds for all services to start, then open http://localhost:3000

**Manual Startup (If needed):**
```bash
# Terminal 1: All MFEs
start-mfe-dev.bat  # Windows
./start-mfe-dev.sh # Linux/Mac

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Shell
cd shell && npm run dev
```

4. **Access Application**
```
http://localhost:3000
```

## 🔐 Test Accounts

### Atlassian (Professional Tier)
**Features:** Orders + Billing + Analytics

| Email | Password | Role |
|-------|----------|------|
| mike.cannon@atlassian.com | password123 | Admin |
| sarah.chen@atlassian.com | password123 | Manager |
| emma.wilson@atlassian.com | password123 | User |

### Zoho (Starter Tier)
**Features:** Orders + Admin

| Email | Password | Role |
|-------|----------|------|
| sridhar.vembu@zoho.com | password123 | Admin |
| priya.sharma@zoho.com | password123 | Manager |
| neha.reddy@zoho.com | password123 | User |

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Shell Application               │
│      (React + Vite + Router)            │
│           Port: 3000                    │
└─────────────────────────────────────────┘
                  │
                  │ Module Federation
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Orders  │  │ Billing │  │Analytics│
│  :3001  │  │  :3002  │  │  :3003  │
└─────────┘  └─────────┘  └─────────┘
                  │
                  ▼
            ┌─────────┐
            │  Admin  │
            │  :3004  │
            └─────────┘
                  │
                  ▼
            ┌─────────┐
            │ Backend │
            │  :5000  │
            └─────────┘
                  │
                  ▼
            ┌─────────┐
            │   DB    │
            └─────────┘
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
│       ├── components/
│       └── pages/
├── orders-mfe/           # Orders Micro-Frontend
├── billing-mfe/          # Billing Micro-Frontend
├── analytics-mfe/        # Analytics Micro-Frontend
├── admin-mfe/            # Admin Micro-Frontend
└── docs/                 # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Module Federation:** @originjs/vite-plugin-federation
- **State Management:** React Context + React Query
- **Routing:** React Router v6
- **Charts:** Recharts
- **Styling:** CSS Modules

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma 5
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

### DevOps
- **Containerization:** Docker + Docker Compose
- **Database Migrations:** Prisma Migrate
- **Environment Management:** dotenv

## 📊 Database Schema

- **tenants** - Tenant configuration and subscriptions
- **tenant_features** - Module subscriptions per tenant
- **users** - User accounts with tenant association
- **refresh_tokens** - JWT refresh token management
- **orders** - Order management (tenant-isolated)
- **invoices** - Billing and invoices (tenant-isolated)
- **audit_logs** - Activity tracking and compliance
- **usage_metrics** - Analytics and usage data

## 🧪 Testing

### Feature Flag Testing
1. Login as Atlassian user → See Orders, Billing, Analytics
2. Login as Zoho user → See Orders, Team (no Billing/Analytics)

### Analytics Testing
1. Login as Atlassian user
2. Navigate to Analytics
3. View dashboard metrics
4. Check revenue and order charts
5. Review team performance

### Admin Testing
1. Login as Zoho admin
2. Navigate to Team
3. View team members
4. Invite new user
5. Update user role
6. Check activity logs

## 📚 Documentation

- **[COMPLETE_PROJECT_SUMMARY.md](./COMPLETE_PROJECT_SUMMARY.md)** - Full project overview
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - 5-minute setup
- **[NEW_MFES_GUIDE.md](./NEW_MFES_GUIDE.md)** - Analytics & Admin MFE guide
- **[PHASE2_UPGRADE.md](./PHASE2_UPGRADE.md)** - Multi-tenancy details
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[PRODUCT_REQUIREMENTS.md](./PRODUCT_REQUIREMENTS.md)** - Product vision
- **[DATABASE_SCHEMA_SAAS.md](./DATABASE_SCHEMA_SAAS.md)** - Database design
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues

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
✅ Analytics with interactive charts  
✅ Team management with activity logs  

## 🚧 Troubleshooting

### MFE not loading (404 on remoteEntry.js)
**Solution:** MFEs must be built and run in preview mode
```bash
cd orders-mfe && npm run build && npm run preview
```

### Login fails
**Solution:** Ensure seed script was run
```bash
cd backend && npx tsx prisma/seed-production.ts
```

### Database connection error
**Solution:** Check DATABASE_URL in `backend/.env`

### Port already in use
**Solution:** Kill processes on ports 3000-3004, 5000

## 🎓 Learning Resources

- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Multi-Tenancy](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview)
- [Prisma ORM](https://www.prisma.io/docs)
- [Recharts](https://recharts.org/)

## 📝 License

MIT

## 👥 Contributors

Built as a demonstration of enterprise SaaS architecture patterns.

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** January 25, 2026
