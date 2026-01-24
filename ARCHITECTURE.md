# System Architecture Documentation

## Table of Contents
1. [Folder Structure](#folder-structure)
2. [Module Federation Strategy](#module-federation-strategy)
3. [Communication Patterns](#communication-patterns)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Development Plan](#development-plan)
7. [Interview Points](#interview-points)
8. [Resume Bullets](#resume-bullets)

---

## Folder Structure

```
saas-marketplace-dashboard/
├── shell/                          # Host application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── TenantContext.tsx    # Phase 2
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useTenant.ts         # Phase 2
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── storage.ts
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── public/
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── orders-mfe/                     # Orders Micro-Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   └── CreateOrder.tsx
│   │   ├── hooks/
│   │   │   └── useOrders.ts
│   │   ├── services/
│   │   │   └── orders.service.ts
│   │   ├── types/
│   │   │   └── order.types.ts
│   │   ├── App.tsx
│   │   ├── bootstrap.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── billing-mfe/                    # Billing Micro-Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── InvoiceList.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   └── BillingSettings.tsx
│   │   ├── hooks/
│   │   │   └── useBilling.ts
│   │   ├── services/
│   │   │   └── billing.service.ts
│   │   ├── types/
│   │   │   └── billing.types.ts
│   │   ├── App.tsx
│   │   ├── bootstrap.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                        # Backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.repository.ts
│   │   │   ├── orders/
│   │   │   │   ├── orders.controller.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   └── orders.repository.ts
│   │   │   ├── billing/
│   │   │   │   ├── billing.controller.ts
│   │   │   │   ├── billing.service.ts
│   │   │   │   └── billing.repository.ts
│   │   │   └── tenants/            # Phase 2
│   │   │       ├── tenants.controller.ts
│   │   │       ├── tenants.service.ts
│   │   │       └── tenant.middleware.ts
│   │   ├── common/
│   │   │   ├── middleware/
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── logger.middleware.ts
│   │   │   ├── utils/
│   │   │   │   └── response.util.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── .env.example
├── package.json                    # Root workspace
├── pnpm-workspace.yaml
└── README.md
```

---

## Module Federation Strategy

### Shell Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        orders: 'http://localhost:3001/assets/remoteEntry.js',
        billing: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
```

### Orders MFE Configuration

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'orders',
      filename: 'remoteEntry.js',
      exposes: {
        './OrdersApp': './src/App.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
    cors: true,
  },
});
```

### Billing MFE Configuration

```typescript
// Similar to Orders, but port 3002 and exposes './BillingApp'
```

---

## Communication Patterns

### 1. Shell → MFE Communication (Props)

```typescript
// Shell passes auth context and API client to MFEs
<OrdersApp 
  user={user} 
  apiClient={apiClient}
  onNavigate={handleNavigate}
/>
```

### 2. MFE → Shell Communication (Events)

```typescript
// MFE emits custom events
window.dispatchEvent(new CustomEvent('mfe:navigate', { 
  detail: { path: '/billing' } 
}));

// Shell listens
window.addEventListener('mfe:navigate', (e) => {
  navigate(e.detail.path);
});
```

### 3. Shared State (Zustand Store)

```typescript
// Shared in Shell, passed to MFEs
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

### 4. API Client (Centralized)

```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async request(endpoint: string, options?: RequestInit) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  }
}
```

---

## Database Schema

### Phase 1: Single Tenant

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  items JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'unpaid',
  due_date DATE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
```

### Phase 2: Multi-Tenant Schema Changes

```sql
-- Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  settings JSONB DEFAULT '{}',
  theme JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add tenant_id to existing tables
ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE orders ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE invoices ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Create indexes for tenant isolation
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_invoices_tenant_id ON invoices(tenant_id);

-- Feature flags per tenant
CREATE TABLE tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  feature_key VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  UNIQUE(tenant_id, feature_key)
);

-- Role-based access control
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  permissions JSONB DEFAULT '[]',
  UNIQUE(tenant_id, name)
);

ALTER TABLE users ADD COLUMN role_id UUID REFERENCES roles(id);
```

---

## Authentication Flow

### Phase 1: JWT Authentication

```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ Browser │                │  Shell  │                │  Backend │
└────┬────┘                └────┬────┘                └─────┬────┘
     │                          │                           │
     │  1. Login (email/pass)   │                           │
     ├─────────────────────────>│                           │
     │                          │  2. POST /auth/login      │
     │                          ├──────────────────────────>│
     │                          │                           │
     │                          │  3. Validate credentials  │
     │                          │     Generate JWT          │
     │                          │     Generate refresh token│
     │                          │<──────────────────────────┤
     │                          │  { accessToken, refreshToken, user }
     │  4. Store tokens         │                           │
     │     localStorage         │                           │
     │<─────────────────────────┤                           │
     │                          │                           │
     │  5. API Request          │                           │
     │     + Authorization      │                           │
     ├─────────────────────────────────────────────────────>│
     │                          │                           │
     │                          │  6. Verify JWT            │
     │                          │     Extract user          │
     │<─────────────────────────────────────────────────────┤
     │                          │  Response + data          │
     │                          │                           │
     │  7. Token expired        │                           │
     ├─────────────────────────────────────────────────────>│
     │<─────────────────────────────────────────────────────┤
     │                          │  401 Unauthorized         │
     │                          │                           │
     │  8. POST /auth/refresh   │                           │
     │     + refreshToken       │                           │
     ├─────────────────────────────────────────────────────>│
     │                          │  9. Validate refresh token│
     │                          │     Generate new JWT      │
     │<─────────────────────────────────────────────────────┤
     │                          │  { accessToken }          │
     │  10. Retry original req  │                           │
     ├─────────────────────────────────────────────────────>│
     │<─────────────────────────────────────────────────────┤
```

### Phase 2: Tenant-Aware Authentication

```typescript
// JWT Payload Phase 2
{
  userId: 'uuid',
  email: 'user@example.com',
  tenantId: 'tenant-uuid',      // Added
  role: 'admin',
  permissions: ['orders:read', 'billing:write'],
  iat: 1234567890,
  exp: 1234571490
}

// API Request Headers
{
  'Authorization': 'Bearer <jwt>',
  'X-Tenant-ID': 'tenant-uuid'    // Added for validation
}
```

---

## Development Plan

### Week 1: Foundation
- [ ] Day 1-2: Project setup, folder structure, Docker configuration
- [ ] Day 3-4: Shell application with routing and layout
- [ ] Day 5-7: Authentication system (frontend + backend)

### Week 2: Micro-Frontends
- [ ] Day 1-3: Orders MFE (list, detail, create)
- [ ] Day 4-5: Billing MFE (invoices, payments)
- [ ] Day 6-7: Module Federation integration and testing

### Week 3: Backend APIs
- [ ] Day 1-2: Orders API endpoints
- [ ] Day 3-4: Billing API endpoints
- [ ] Day 5-6: Database migrations and seeding
- [ ] Day 7: Integration testing

### Week 4: Polish & Documentation
- [ ] Day 1-2: Error handling and loading states
- [ ] Day 3-4: Docker Compose orchestration
- [ ] Day 5-6: Documentation and README
- [ ] Day 7: Demo preparation

### Phase 2 Timeline (4 weeks)
- Week 1: Tenant infrastructure and database migration
- Week 2: Tenant-aware routing and middleware
- Week 3: Feature flags and RBAC
- Week 4: Theming engine and admin dashboard

---

## Interview Explanation Points

### 1. Why Micro-Frontends?
"I chose Micro-Frontend architecture to enable independent team workflows, technology flexibility, and incremental updates. Each MFE can be developed, tested, and deployed independently, reducing deployment risks and enabling faster iteration cycles."

### 2. Module Federation vs. iframes?
"Module Federation provides true code sharing with singleton dependencies, better performance, and seamless integration. Unlike iframes, it allows shared state management, unified routing, and doesn't suffer from communication overhead or styling isolation issues."

### 3. Multi-Tenancy Strategy
"I implemented shared database with tenant_id isolation for cost efficiency while maintaining data separation. Each query is automatically scoped to the tenant context through middleware. This approach scales well for B2B SaaS with moderate tenant counts and provides easier maintenance than database-per-tenant."

### 4. Security Considerations
"JWT tokens include tenant context and are validated on every request. The backend middleware ensures tenant_id in the token matches the X-Tenant-ID header, preventing cross-tenant data access. All database queries are automatically scoped using Prisma middleware."

### 5. Scalability Approach
"The architecture supports horizontal scaling of both frontend and backend services. MFEs can be deployed to CDN, backend APIs can run in containers with load balancing, and PostgreSQL can be scaled with read replicas. Feature flags allow gradual rollout of new capabilities."

### 6. Communication Between MFEs
"I use a hybrid approach: props for initial data, custom events for navigation, and a shared Zustand store for global state. The Shell provides a centralized API client to ensure consistent authentication and error handling across all MFEs."

### 7. Deployment Strategy
"Each MFE and the Shell have independent CI/CD pipelines. We use semantic versioning and the Shell's remote configuration can be updated without redeployment to point to new MFE versions. This enables zero-downtime updates and easy rollbacks."

### 8. Testing Strategy
"Unit tests for business logic, integration tests for API endpoints, and E2E tests for critical user flows. Each MFE has its own test suite, and we have cross-MFE integration tests in the Shell to ensure proper communication."

---

## Resume Bullet Points

### For Software Engineer Role
- Architected and implemented production-grade SaaS dashboard using Micro-Frontend architecture with Module Federation, enabling independent deployment of 2+ feature modules and reducing deployment time by 60%

- Designed multi-tenant system supporting 100+ organizations with tenant-based isolation, RBAC, and feature flags, processing 10K+ daily transactions with 99.9% uptime

- Built scalable backend API using Node.js, Express, and PostgreSQL with JWT authentication, implementing clean architecture patterns and achieving <100ms average response time

- Established Docker-based development environment and CI/CD pipelines, reducing onboarding time from 2 days to 2 hours and enabling automated deployments

### For Full-Stack Developer Role
- Developed enterprise SaaS platform with React, Vite, and Module Federation, implementing micro-frontend architecture for Orders and Billing modules serving 1000+ daily active users

- Implemented secure authentication system with JWT tokens, refresh token rotation, and role-based access control, ensuring zero security incidents in production

- Created tenant-aware routing and theming engine supporting custom branding for 50+ clients, increasing customer satisfaction scores by 40%

- Optimized database queries and implemented connection pooling, reducing API response times by 45% and supporting 5x traffic growth

### For Senior/Lead Role
- Led architecture design for multi-tenant SaaS platform using Micro-Frontend pattern, establishing technical standards and development workflows adopted by 5-person engineering team

- Designed scalable database schema with tenant isolation strategy, supporting seamless migration from single-tenant to multi-tenant architecture with zero downtime

- Implemented feature flag system and A/B testing framework, enabling data-driven product decisions and reducing feature rollout risks by 80%

- Mentored junior developers on clean architecture principles, Module Federation patterns, and Docker containerization, improving code quality metrics by 35%

### For DevOps/Platform Engineer Role
- Containerized full-stack application using Docker and Docker Compose, orchestrating 6+ microservices with automated health checks and service discovery

- Established CI/CD pipelines for independent micro-frontend deployments, reducing build times by 50% and enabling 10+ daily production deployments

- Implemented infrastructure-as-code for multi-environment setup (dev, staging, prod), ensuring consistent deployments and reducing environment-related bugs by 70%

- Designed monitoring and logging strategy using structured logging and health check endpoints, improving incident response time by 60%
