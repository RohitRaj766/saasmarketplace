# OptiFlow - Enterprise Multi-Tenant SaaS Platform

> A production-ready multi-tenant SaaS platform with complete organization isolation, role-based access control, and micro-frontend architecture.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-brightgreen)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

## 🎯 Overview

OptiFlow is a comprehensive multi-tenant SaaS operations platform demonstrating enterprise-grade patterns:

- **Multi-Tenant Architecture:** Complete data isolation per organization
- **4 Micro-Frontends:** Orders, Billing, Analytics, Admin
- **Role-Based Access:** Admin and Support roles with granular permissions
- **Subscription Plans:** Free, Starter, Professional, Enterprise tiers
- **Dynamic Dashboard:** Real-time metrics with auto-refresh
- **Team Management:** User creation with domain validation

## ✨ Key Features

### 🏢 Multi-Tenant Architecture
- **Complete Data Isolation:** Each organization has separate data
- **Organization Management:** Signup creates isolated organization
- **Subscription Plans:** User limits based on plan tier
- **Domain Validation:** Team members must use same email domain
- **Owner Protection:** Organization owners cannot be deleted

### 🔐 Role-Based Access Control
- **Admin Role:** Full access to all features including Analytics and Team
- **Support Role:** Access to Overview, Orders, and Billing only
- **Route Protection:** Unauthorized access automatically redirected
- **Dynamic Navigation:** Menu items shown based on user role

### 📦 Micro-Frontends
1. **Orders MFE** - Order management and tracking
2. **Billing MFE** - Invoices and payment history
3. **Analytics MFE** - Business intelligence (Admin only)
4. **Admin MFE** - Team management (Admin only)

### 📊 Dynamic Dashboard
- **Real-Time Metrics:** Auto-refresh every 30 seconds
- **Active Members:** Shows team size from organization
- **Revenue Tracking:** Month-over-month revenue changes
- **Recent Activity:** Paginated table with search and filters
- **Quick Actions:** Navigate to key features

### 👥 Team Management
- **User Creation:** Admin sets email and password
- **Domain Validation:** Users must match organization domain
- **Role Management:** Change between Admin and Support
- **User Deletion:** Remove team members (except owner)
- **Pagination & Search:** Professional table interface
- **Role Filtering:** Filter by Admin or Support

### 💳 Subscription Plans

| Plan | Max Users | Price | Features |
|------|-----------|-------|----------|
| Free | 5 | $0 | Basic features |
| Starter | 10 | $29/mo | Standard features |
| Professional | 50 | $99/mo | Advanced features |
| Enterprise | 999 | $299/mo | All features |

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
PostgreSQL 15+
Docker (optional)
npm or yarn
```

### One-Command Setup (Windows)

```bash
start.bat
```

This will:
1. Start PostgreSQL via Docker
2. Install all dependencies
3. Run database migrations
4. Seed demo data
5. Build all 4 MFEs
6. Start all services

Wait 10-15 seconds, then open http://localhost:3000

### Manual Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd SaasMarketplace
```

2. **Database Setup**
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
npx prisma migrate dev
npx prisma generate

# Seed demo data
npm run seed
```

3. **Start Services**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Shell
cd shell && npm run dev

# Terminal 3-6: MFEs (after building)
cd orders-mfe && npm run build && npm run preview
cd billing-mfe && npm run build && npm run preview
cd analytics-mfe && npm run build && npm run preview
cd admin-mfe && npm run build && npm run preview
```

4. **Access Application**
```
http://localhost:3000
```

## 🔐 Demo Account

After running the seed script:

**Email:** admin@example.com  
**Password:** password123  
**Role:** Admin (Owner)  
**Organization:** Demo Organization

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Shell Application               │
│    (React + Vite + Router)              │
│         Port: 3000                      │
│  - Authentication                       │
│  - Organization Context                 │
│  - Dynamic Navigation                   │
└─────────────────────────────────────────┘
                  │
                  │ Module Federation
                  │
    ┌─────────────┼─────────────┬─────────┐
    │             │             │         │
    ▼             ▼             ▼         ▼
┌─────────┐  ┌─────────┐  ┌─────────┐ ┌─────────┐
│ Orders  │  │ Billing │  │Analytics│ │  Admin  │
│  :3001  │  │  :3002  │  │  :3003  │ │  :3004  │
│ (All)   │  │ (All)   │  │ (Admin) │ │ (Admin) │
└─────────┘  └─────────┘  └─────────┘ └─────────┘
                  │
                  ▼
            ┌─────────────────────┐
            │   Backend API       │
            │   Port: 5000        │
            │ - JWT Auth          │
            │ - Organization      │
            │   Isolation         │
            │ - Role Validation   │
            └─────────────────────┘
                  │
                  ▼
            ┌─────────────────────┐
            │   PostgreSQL        │
            │ - Organizations     │
            │ - Users             │
            │ - Orders            │
            │ - Invoices          │
            └─────────────────────┘
```

## 📁 Project Structure

```
SaasMarketplace/
├── backend/                    # Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Demo data seeding
│   │   └── migrations/        # Database migrations
│   └── src/
│       ├── modules/
│       │   ├── auth/          # Authentication
│       │   ├── admin/         # Team management
│       │   ├── dashboard/     # Dashboard metrics
│       │   ├── orders/        # Order management
│       │   └── billing/       # Invoice management
│       └── app.ts
├── shell/                      # React Shell (Host)
│   └── src/
│       ├── contexts/          # Auth & Theme contexts
│       ├── components/        # Shared components
│       │   ├── Layout/        # Header & Sidebar
│       │   ├── ui/            # UI components
│       │   └── RecentActivityTable.tsx
│       ├── pages/             # Page components
│       │   ├── Dashboard.tsx  # Overview page
│       │   ├── Login.tsx
│       │   └── Signup.tsx
│       └── services/          # API services
├── orders-mfe/                 # Orders Micro-Frontend
├── billing-mfe/                # Billing Micro-Frontend
├── analytics-mfe/              # Analytics Micro-Frontend (Admin only)
└── admin-mfe/                  # Admin Micro-Frontend (Admin only)
    └── src/
        ├── App.tsx            # Team management with table
        └── components/
            └── InviteUserModal.tsx  # User creation form
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Module Federation:** @originjs/vite-plugin-federation
- **State Management:** React Context + React Query
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma 5
- **Database:** PostgreSQL 15+
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Zod

### DevOps
- **Containerization:** Docker + Docker Compose
- **Database Migrations:** Prisma Migrate
- **Environment Management:** dotenv

## 📊 Database Schema

### Core Tables
- **organizations** - Organization/tenant data with subscription plans
- **users** - User accounts with organizationId and role
- **orders** - Orders scoped to organization
- **invoices** - Invoices scoped to organization
- **refresh_tokens** - JWT refresh token management

### Key Relationships
- Users belong to one organization
- Orders belong to organization and user
- Invoices belong to organization and user
- All data isolated by organizationId

## 🎯 Key Features Implemented

✅ **Multi-Tenant Architecture**
- Complete data isolation per organization
- Organization created during signup
- All queries filtered by organizationId

✅ **Role-Based Access Control**
- Admin: Full access to all features
- Support: Limited to Overview, Orders, Billing
- Route-level protection
- Dynamic navigation based on role

✅ **Team Management**
- Create users with email/password
- Domain validation (must match admin's domain)
- Role management (Admin/Support)
- User deletion (except owner)
- Pagination and search
- Professional table interface

✅ **Dynamic Dashboard**
- Real-time metrics with auto-refresh
- Active Members count from team
- Revenue tracking with trends
- Recent activity table with pagination
- Search and filter capabilities

✅ **Subscription Management**
- User limits based on plan
- Plan enforcement during user creation
- Upgrade prompts when limit reached

✅ **Security**
- JWT authentication with organizationId
- Password hashing with bcrypt
- Owner protection (cannot be deleted)
- Domain validation for team members

## 🧪 Testing Scenarios

### 1. Organization Signup
1. Go to landing page
2. Select a plan (Professional recommended)
3. Fill company information
4. Create admin account
5. Complete payment (demo)
6. Login and verify organization created

### 2. Team Management
1. Login as admin
2. Navigate to Team
3. Click "Add New User"
4. Try email with different domain → Should fail
5. Use same domain as admin → Should succeed
6. Verify user appears in table
7. Test search and filtering
8. Change user role
9. Try to delete owner → Should fail
10. Delete regular user → Should succeed

### 3. Role-Based Access
1. Login as admin → See all menu items
2. Logout and login as support user
3. Verify only see: Overview, Orders, Billing
4. Try accessing /app/analytics → Redirected
5. Try accessing /app/team → Redirected

### 4. Data Isolation
1. Create Organization A with admin A
2. Create some orders and invoices
3. Create Organization B with admin B
4. Verify admin B cannot see Organization A's data
5. Verify completely separate dashboards

### 5. Dashboard Features
1. View real-time metrics
2. Check Active Members count
3. Verify revenue calculations
4. Test recent activity search
5. Test activity type filtering
6. Test pagination

## 🚧 Troubleshooting

### MFE not loading (404 on remoteEntry.js)
**Solution:** MFEs must be built first
```bash
cd admin-mfe && npm run build && npm run preview
```

### "User limit reached" error
**Solution:** Upgrade organization plan or delete users
```bash
# Update plan in database
UPDATE organizations SET plan = 'professional', max_users = 50 WHERE slug = 'your-org';
```

### Domain validation failing
**Solution:** Ensure new user email matches admin's domain
```
Admin: admin@company.com
New User: user@company.com ✅
New User: user@other.com ❌
```

### Database migration errors
**Solution:** Reset database and re-migrate
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npm run seed
```

### Port already in use
**Solution:** Kill processes on ports
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Create organization and owner
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Dashboard
- `GET /dashboard/metrics` - Get dashboard metrics
- `GET /dashboard/activity` - Get recent activity

### Team Management (Admin only)
- `GET /admin/team` - List team members
- `POST /admin/team` - Create new user
- `PATCH /admin/team/:userId/role` - Update user role
- `DELETE /admin/team/:userId` - Delete user

### Orders
- `GET /orders` - List orders (filtered by organization)
- `POST /orders` - Create order
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status

### Billing
- `GET /billing/invoices` - List invoices (filtered by organization)
- `POST /billing/invoices` - Create invoice
- `POST /billing/invoices/:id/pay` - Mark invoice as paid

## 🎓 Learning Resources

- [Multi-Tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/overview)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontends](https://martinfowler.com/articles/micro-frontends.html)
- [Prisma Multi-Tenancy](https://www.prisma.io/docs/guides/database/multi-tenancy)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 📝 License

MIT

## 👥 Contributors

Built as a demonstration of enterprise multi-tenant SaaS architecture patterns.

---

**Status:** ✅ Production Ready  
**Version:** 2.0.0  
**Last Updated:** February 3, 2026  
**Architecture:** Multi-Tenant with Complete Data Isolation
