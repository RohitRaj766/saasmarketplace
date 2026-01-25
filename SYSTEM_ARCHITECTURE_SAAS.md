# System Architecture - OptiFlow SaaS Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS (Browser)                              │
│  ┌──────────────────┐              ┌──────────────────┐            │
│  │  Atlassian Team  │              │   Zoho Team      │            │
│  │  (10 employees)  │              │  (10 employees)  │            │
│  └────────┬─────────┘              └────────┬─────────┘            │
└───────────┼──────────────────────────────────┼──────────────────────┘
            │                                  │
            │ HTTPS                            │ HTTPS
            │                                  │
┌───────────▼──────────────────────────────────▼──────────────────────┐
│                         CDN (CloudFront)                             │
│                    Static Assets Distribution                        │
└───────────┬──────────────────────────────────┬──────────────────────┘
            │                                  │
┌───────────▼──────────────────────────────────▼──────────────────────┐
│                    SHELL APPLICATION (Host)                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  • Authentication & Session Management                         │ │
│  │  • Tenant Context Resolution                                   │ │
│  │  • Feature Flag Evaluation                                     │ │
│  │  • Dynamic Module Loading                                      │ │
│  │  • Shared Layout & Navigation                                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────┬──────────────────────────────────┬──────────────────────┘
            │                                  │
            │ Module Federation                │
            │                                  │
┌───────────▼──────────┐  ┌──────────▼────────┐  ┌──────────────────┐
│   Orders MFE         │  │  Billing MFE      │  │  Analytics MFE   │
│   (Remote Module)    │  │  (Remote Module)  │  │  (Remote Module) │
└──────────────────────┘  └───────────────────┘  └──────────────────┘
            │                      │                      │
            └──────────────────────┴──────────────────────┘
                                   │
                                   │ REST API (JWT)
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                         API GATEWAY / LOAD BALANCER                  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                         BACKEND API (Node.js)                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Middleware Layer:                                             │ │
│  │  • JWT Validation                                              │ │
│  │  • Tenant Context Injection                                    │ │
│  │  • Feature Flag Validation                                     │ │
│  │  • Rate Limiting                                               │ │
│  │  • Audit Logging                                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Service Layer:                                                │ │
│  │  • Auth Service                                                │ │
│  │  • Tenant Service                                              │ │
│  │  • Orders Service                                              │ │
│  │  • Billing Service                                             │ │
│  │  • Analytics Service                                           │ │
│  │  • Admin Service                                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                    DATABASE (PostgreSQL + Prisma)                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Tables:                                                       │ │
│  │  • tenants (Atlassian, Zoho)                                  │ │
│  │  • users (20 total: 10 per tenant)                            │ │
│  │  • tenant_features (module subscriptions)                     │ │
│  │  • orders (tenant_id isolation)                               │ │
│  │  • invoices (tenant_id isolation)                             │ │
│  │  • audit_logs (all actions)                                   │ │
│  │  • usage_metrics (billing data)                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Tenant Isolation Flow

```
User Login (admin@atlassian.com)
         │
         ▼
┌─────────────────────────────────┐
│  1. Authentication              │
│  • Validate credentials         │
│  • Lookup user's tenant         │
│  • Check tenant is active       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  2. Generate JWT Token          │
│  {                              │
│    userId: "uuid",              │
│    email: "admin@atlassian.com",│
│    tenantId: "atlassian-uuid",  │
│    role: "admin",               │
│    features: ["orders",         │
│                "billing",       │
│                "analytics"]     │
│  }                              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  3. Every API Request           │
│  Headers:                       │
│  • Authorization: Bearer <JWT>  │
│  • X-Tenant-ID: atlassian-uuid  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  4. Middleware Validation       │
│  • Verify JWT signature         │
│  • Extract tenantId from token  │
│  • Validate X-Tenant-ID matches │
│  • Check feature access         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  5. Database Query              │
│  SELECT * FROM orders           │
│  WHERE tenant_id = 'atlassian'  │
│    AND user_id = 'uuid'         │
│  • Automatic tenant filtering   │
│  • No cross-tenant data access  │
└─────────────────────────────────┘
```

## Module Loading Strategy

```
Shell Initialization
         │
         ▼
┌─────────────────────────────────┐
│  1. User Authenticates          │
│  • Receives JWT with features   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  2. Fetch Tenant Config         │
│  GET /api/tenants/config        │
│  Response: {                    │
│    tenant: {...},               │
│    features: {                  │
│      orders: true,              │
│      billing: true,             │
│      analytics: true,           │
│      admin: false               │
│    },                           │
│    theme: {...}                 │
│  }                              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  3. Build Navigation            │
│  if (features.orders)           │
│    → Show "Orders" menu         │
│  if (features.billing)          │
│    → Show "Billing" menu        │
│  if (features.analytics)        │
│    → Show "Analytics" menu      │
│  if (features.admin)            │
│    → Show "Admin" menu          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  4. Lazy Load Modules           │
│  User clicks "Orders"           │
│  → Fetch remoteEntry.js         │
│  → Load OrdersApp component     │
│  → Render in Shell              │
└─────────────────────────────────┘
```

