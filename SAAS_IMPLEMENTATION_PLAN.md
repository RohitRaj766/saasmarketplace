# OptiFlow SaaS - Complete Implementation Plan

## Executive Summary

This document outlines the complete transformation of the existing Micro-Frontend + Multi-Tenant platform into **OptiFlow** - a production-ready SaaS operations platform.

**Current State:** Basic micro-frontend architecture with tenant isolation  
**Target State:** Full-featured SaaS product with 2 real tenants (Atlassian, Zoho), 20 users, module subscriptions, and business logic

---

## Phase 1: Foundation Enhancement (Week 1-2)

### 1.1 Database Schema Upgrade
**File:** `backend/prisma/schema.prisma`

**Add New Tables:**
```prisma
model TenantFeature {
  id            String   @id @default(uuid())
  tenantId      String   @map("tenant_id")
  featureKey    String   @map("feature_key")
  isEnabled     Boolean  @default(true) @map("is_enabled")
  subscribedAt  DateTime @default(now()) @map("subscribed_at")
  expiresAt     DateTime? @map("expires_at")
  usageLimit    Int?     @map("usage_limit")
  usageCurrent  Int      @default(0) @map("usage_current")
  monthlyPrice  Decimal  @map("monthly_price") @db.Decimal(10, 2)
  config        Json     @default("{}")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, featureKey])
  @@map("tenant_features")
}

model AuditLog {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  userId      String?  @map("user_id")
  action      String
  entityType  String   @map("entity_type")
  entityId    String?  @map("entity_id")
  oldValues   Json?    @map("old_values")
  newValues   Json?    @map("new_values")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  metadata    Json     @default("{}")
  createdAt   DateTime @default(now()) @map("created_at")

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([userId])
  @@index([entityType, entityId])
  @@map("audit_logs")
}

model UsageMetric {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  metricType  String   @map("metric_type")
  metricValue Decimal  @map("metric_value") @db.Decimal(12, 2)
  featureKey  String?  @map("feature_key")
  userId      String?  @map("user_id")
  recordedAt  DateTime @default(now()) @map("recorded_at")
  periodStart DateTime? @map("period_start")
  periodEnd   DateTime? @map("period_end")
  metadata    Json     @default("{}")

  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([tenantId, metricType])
  @@map("usage_metrics")
}
```

**Update Existing Models:**
```prisma
model Tenant {
  // Add subscription fields
  subscriptionTier   String   @default("starter") @map("subscription_tier")
  subscriptionStatus String   @default("trial") @map("subscription_status")
  trialEndsAt        DateTime? @map("trial_ends_at")
  billingEmail       String?  @map("billing_email")
  industry           String?
  companySize        String?  @map("company_size")
  timezone           String   @default("UTC")
  currency           String   @default("USD")

  // Add relations
  features           TenantFeature[]
  auditLogs          AuditLog[]
  usageMetrics       UsageMetric[]
}

model User {
  // Add profile fields
  avatarUrl          String?  @map("avatar_url")
  phone              String?
  department         String?
  jobTitle           String?  @map("job_title")
  permissions        Json     @default("[]")
  emailVerified      Boolean  @default(false) @map("email_verified")
  lastLoginAt        DateTime? @map("last_login_at")
  invitedBy          String?  @map("invited_by")
  invitedAt          DateTime? @map("invited_at")
  invitationAcceptedAt DateTime? @map("invitation_accepted_at")

  // Add relations
  auditLogs          AuditLog[]
  usageMetrics       UsageMetric[]
}

model Order {
  // Add customer fields
  customerName       String   @map("customer_name")
  customerEmail      String?  @map("customer_email")
  customerPhone      String?  @map("customer_phone")
  customerAddress    Json?    @map("customer_address")
  
  // Add financial fields
  subtotal           Decimal  @db.Decimal(12, 2)
  taxAmount          Decimal  @default(0) @map("tax_amount") @db.Decimal(12, 2)
  discountAmount     Decimal  @default(0) @map("discount_amount") @db.Decimal(12, 2)
  currency           String   @default("USD")
  
  // Add fulfillment fields
  deliveryDate       DateTime? @map("delivery_date")
  deliveryAddress    Json?    @map("delivery_address")
  trackingNumber     String?  @map("tracking_number")
  
  // Add metadata
  notes              String?
  tags               Json     @default("[]")
  customFields       Json     @default("{}") @map("custom_fields")
  completedAt        DateTime? @map("completed_at")
  cancelledAt        DateTime? @map("cancelled_at")
}

model Invoice {
  // Add customer fields
  customerName       String   @map("customer_name")
  customerEmail      String?  @map("customer_email")
  customerAddress    Json?    @map("customer_address")
  
  // Add financial fields
  subtotal           Decimal  @db.Decimal(12, 2)
  taxAmount          Decimal  @default(0) @map("tax_amount") @db.Decimal(12, 2)
  discountAmount     Decimal  @default(0) @map("discount_amount") @db.Decimal(12, 2)
  amountPaid         Decimal  @default(0) @map("amount_paid") @db.Decimal(12, 2)
  amountDue          Decimal  @map("amount_due") @db.Decimal(12, 2)
  currency           String   @default("USD")
  
  // Add payment fields
  paymentTerms       String?  @map("payment_terms")
  paymentMethod      String?  @map("payment_method")
  paymentReference   String?  @map("payment_reference")
  
  // Add metadata
  notes              String?
  termsAndConditions String?  @map("terms_and_conditions")
  sentAt             DateTime? @map("sent_at")
  viewedAt           DateTime? @map("viewed_at")
}
```

### 1.2 Seed Production Data
**File:** `backend/prisma/seed-production.ts`

Create comprehensive seed with:
- 2 Tenants (Atlassian, Zoho)
- 10 users per tenant (various roles)
- Feature subscriptions per tenant
- Sample orders and invoices
- Audit logs
- Usage metrics

---

## Phase 2: Backend Services (Week 3-4)

### 2.1 Feature Flag Service
**File:** `backend/src/modules/features/features.service.ts`

```typescript
export class FeaturesService {
  async checkFeatureAccess(tenantId: string, featureKey: string): Promise<boolean>
  async getEnabledFeatures(tenantId: string): Promise<string[]>
  async subscribeToFeature(tenantId: string, featureKey: string): Promise<void>
  async unsubscribeFromFeature(tenantId: string, featureKey: string): Promise<void>
  async trackFeatureUsage(tenantId: string, featureKey: string): Promise<void>
}
```

### 2.2 Audit Logging Service
**File:** `backend/src/modules/audit/audit.service.ts`

```typescript
export class AuditService {
  async log(params: {
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId?: string;
    oldValues?: any;
    newValues?: any;
  }): Promise<void>
  
  async getAuditLogs(tenantId: string, filters: AuditFilters): Promise<AuditLog[]>
}
```

### 2.3 Analytics Service
**File:** `backend/src/modules/analytics/analytics.service.ts`

```typescript
export class AnalyticsService {
  async getDashboardMetrics(tenantId: string): Promise<DashboardMetrics>
  async getOrdersAnalytics(tenantId: string, dateRange: DateRange): Promise<OrdersAnalytics>
  async getRevenueAnalytics(tenantId: string, dateRange: DateRange): Promise<RevenueAnalytics>
  async getTeamPerformance(tenantId: string): Promise<TeamPerformance[]>
}
```

### 2.4 Admin Service
**File:** `backend/src/modules/admin/admin.service.ts`

```typescript
export class AdminService {
  async inviteUser(tenantId: string, email: string, role: string): Promise<void>
  async updateUserRole(userId: string, role: string): Promise<void>
  async deactivateUser(userId: string): Promise<void>
  async getTeamMembers(tenantId: string): Promise<User[]>
  async getActivityLogs(tenantId: string): Promise<AuditLog[]>
}
```

---

## Phase 3: Frontend Enhancements (Week 5-6)

### 3.1 Feature-Based Navigation
**File:** `shell/src/components/Layout/Sidebar.tsx`

```typescript
export function Sidebar() {
  const { tenant } = useTenant();
  const features = tenant?.features || {};

  return (
    <nav>
      <NavLink to="/dashboard">Dashboard</NavLink>
      
      {features.orders && (
        <NavLink to="/orders">Orders</NavLink>
      )}
      
      {features.billing && (
        <NavLink to="/billing">Billing</NavLink>
      )}
      
      {features.analytics && (
        <NavLink to="/analytics">Analytics</NavLink>
      )}
      
      {features.admin && (
        <NavLink to="/admin">Team</NavLink>
      )}
    </nav>
  );
}
```

### 3.2 Analytics MFE
**New Module:** `analytics-mfe/`

Components:
- Dashboard with key metrics
- Charts (orders, revenue, trends)
- Date range filters
- Export functionality

### 3.3 Admin MFE
**New Module:** `admin-mfe/`

Components:
- Team members list
- Invite user form
- Role management
- Activity logs viewer
- Usage metrics

---

## Phase 4: Business Logic (Week 7-8)

### 4.1 Subscription Management
- Module pricing calculation
- Trial period handling
- Subscription upgrades/downgrades
- Usage-based billing

### 4.2 RBAC Implementation
**Roles:**
- **Admin:** Full access, user management, billing
- **Manager:** Team oversight, reporting, approvals
- **User:** Basic operations, own data only

**Permissions Matrix:**
```
Feature    | Admin | Manager | User
-----------|-------|---------|------
Orders     | CRUD  | CRUD    | CR
Billing    | CRUD  | Read    | Read
Analytics  | Full  | Full    | Limited
Admin      | Full  | Read    | None
```

### 4.3 Tenant Onboarding Flow
1. Signup form
2. Module selection
3. Payment setup
4. Team invitation
5. Data import (optional)
6. Onboarding checklist

---

## Phase 5: Production Readiness (Week 9-10)

### 5.1 Security Hardening
- Rate limiting per tenant
- API key management
- CORS configuration
- SQL injection prevention
- XSS protection
- CSRF tokens

### 5.2 Performance Optimization
- Database query optimization
- Caching strategy (Redis)
- CDN configuration
- Image optimization
- Code splitting
- Lazy loading

### 5.3 Monitoring & Logging
- Application monitoring (Sentry)
- Infrastructure monitoring (CloudWatch)
- Log aggregation (ELK stack)
- Uptime monitoring
- Performance metrics

---

## API Contracts

### Authentication
```typescript
POST /auth/login
Request: {
  email: string;
  password: string;
}
Response: {
  success: true,
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      tenantId: string;
    },
    accessToken: string;
    refreshToken: string;
    features: string[];  // ["orders", "billing", "analytics"]
  }
}
```

### Tenant Configuration
```typescript
GET /api/tenants/config
Response: {
  success: true,
  data: {
    tenant: {
      id: string;
      name: string;
      slug: string;
      theme: {
        primaryColor: string;
        logo: string;
      }
    },
    features: {
      orders: boolean;
      billing: boolean;
      analytics: boolean;
      admin: boolean;
    },
    subscription: {
      tier: string;
      status: string;
      trialEndsAt: string;
    }
  }
}
```

### Orders API
```typescript
GET /api/orders
POST /api/orders
GET /api/orders/:id
PATCH /api/orders/:id
DELETE /api/orders/:id
```

### Billing API
```typescript
GET /api/billing/invoices
POST /api/billing/invoices
GET /api/billing/invoices/:id
POST /api/billing/invoices/:id/send
POST /api/billing/invoices/:id/pay
```

### Analytics API
```typescript
GET /api/analytics/dashboard
GET /api/analytics/orders
GET /api/analytics/revenue
GET /api/analytics/team-performance
```

### Admin API
```typescript
GET /api/admin/team
POST /api/admin/team/invite
PATCH /api/admin/team/:id/role
DELETE /api/admin/team/:id
GET /api/admin/activity-logs
GET /api/admin/usage-metrics
```

---

## Pricing Model

### Subscription Tiers

**Starter** - $68/month
- Orders Module ($49)
- Admin Module ($19)
- Up to 10 users
- 500 orders/month
- Email support

**Professional** - $117/month
- Orders Module ($49)
- Billing Module ($39)
- Analytics Module ($29)
- Up to 25 users
- 2,000 orders/month
- Priority support

**Enterprise** - Custom
- All modules
- Unlimited users
- Unlimited orders
- Custom integrations
- Dedicated support
- SLA guarantee

### Module Pricing (À la carte)
- Orders: $49/month
- Billing: $39/month
- Analytics: $29/month
- Admin: $19/month

---

## Success Metrics

### Business KPIs
- MRR: $50K by Month 6
- Active Tenants: 100+
- Churn Rate: < 5%
- NPS: > 50

### Technical KPIs
- Uptime: 99.9%
- API Response: < 200ms
- Page Load: < 2s
- Error Rate: < 0.1%

---

## Next Steps

1. Review and approve this plan
2. Update database schema
3. Run production seed data
4. Implement backend services
5. Build Analytics and Admin MFEs
6. Test end-to-end workflows
7. Deploy to staging
8. User acceptance testing
9. Production deployment
10. Monitor and iterate

