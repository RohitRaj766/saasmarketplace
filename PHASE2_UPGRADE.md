# Phase 2: Multi-Tenancy Upgrade Guide

This document outlines the steps to upgrade from Phase 1 (Single Tenant) to Phase 2 (Multi-Tenant).

## Overview

Phase 2 adds:
- Tenant-based data isolation
- Tenant-aware routing
- Feature flags per tenant
- Role-based access control (RBAC)
- Tenant theming and branding
- Admin dashboard for tenant management

## Database Migration

### 1. Run Multi-Tenant Migration

```bash
cd backend

# Create migration for tenant tables
pnpm prisma migrate dev --name add_multi_tenancy
```

The migration will:
- Create `tenants` table
- Add `tenant_id` columns to existing tables
- Create indexes for tenant isolation
- Add feature flags and roles tables

### 2. Seed Tenant Data

```bash
# Create seed script for tenants
pnpm tsx src/prisma/seed-tenants.ts
```

## Backend Changes

### 1. Enable Tenant Middleware

In `backend/src/config/database.ts`, uncomment the tenant middleware:

```typescript
prisma.$use(async (params, next) => {
  // Tenant isolation logic
  const tenantId = getTenantContext();
  
  if (tenantId && params.model) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { ...params.args.where, tenantId };
    }
    // ... rest of middleware
  }

  return next(params);
});
```

### 2. Add Tenant Context

Create `backend/src/common/context/tenant.context.ts`:

```typescript
import { AsyncLocalStorage } from 'async_hooks';

const tenantContext = new AsyncLocalStorage<string>();

export function setTenantContext(tenantId: string) {
  tenantContext.enterWith(tenantId);
}

export function getTenantContext(): string | undefined {
  return tenantContext.getStore();
}
```

### 3. Update Auth Middleware

Modify `backend/src/modules/auth/auth.middleware.ts`:

```typescript
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  // ... existing code
  
  // Set tenant context
  if (decoded.tenantId) {
    setTenantContext(decoded.tenantId);
  }
  
  next();
}
```

### 4. Add Tenant Routes

Create `backend/src/modules/tenants/` with:
- `tenants.controller.ts`
- `tenants.service.ts`
- `tenants.middleware.ts`

## Frontend Changes

### 1. Update Shell Routing

Modify `shell/src/App.tsx` to support tenant-aware routes:

```typescript
<Route path="/t/:tenantId/*" element={<TenantLayout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="orders/*" element={<OrdersPage />} />
  <Route path="billing/*" element={<BillingPage />} />
</Route>
```

### 2. Add Tenant Context

Create `shell/src/contexts/TenantContext.tsx`:

```typescript
export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  
  // Load tenant from URL or storage
  useEffect(() => {
    const tenantId = getTenantIdFromUrl();
    if (tenantId) {
      loadTenant(tenantId);
    }
  }, []);
  
  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}
```

### 3. Implement Theming

Create `shell/src/lib/theme.ts`:

```typescript
export function applyTenantTheme(theme: TenantTheme) {
  document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
  document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  
  if (theme.logo) {
    // Update logo
  }
  
  if (theme.favicon) {
    // Update favicon
  }
}
```

### 4. Add Feature Flags

Create `shell/src/hooks/useFeatureFlag.ts`:

```typescript
export function useFeatureFlag(featureKey: string): boolean {
  const { tenant } = useTenant();
  return tenant?.features[featureKey] ?? false;
}

// Usage in components
const ordersEnabled = useFeatureFlag('orders_module');
if (!ordersEnabled) return null;
```

## Testing Multi-Tenancy

### 1. Create Test Tenants

```bash
# Seed multiple tenants
pnpm seed:tenants
```

### 2. Test Tenant Isolation

```bash
# Login as Tenant A user
# Create orders
# Login as Tenant B user
# Verify Tenant A orders are not visible
```

### 3. Test Feature Flags

```bash
# Disable orders module for Tenant A
# Verify orders menu is hidden
# Verify direct URL access is blocked
```

## Admin Dashboard

### 1. Create Admin MFE

```bash
mkdir admin-mfe
cd admin-mfe
# Copy structure from orders-mfe
```

### 2. Add Tenant Management

Features:
- List all tenants
- Create/edit tenants
- Configure feature flags
- Manage tenant users
- View tenant analytics

### 3. Add to Shell

```typescript
// shell/vite.config.ts
remotes: {
  orders: '...',
  billing: '...',
  admin: 'http://localhost:3003/assets/remoteEntry.js', // New
}
```

## Security Considerations

### 1. Tenant Validation

```typescript
// Validate tenant exists and is active
if (!tenant || !tenant.isActive) {
  throw new AppError('Invalid tenant', 403);
}
```

### 2. Cross-Tenant Prevention

```typescript
// Ensure JWT tenant matches request tenant
if (req.user.tenantId !== req.params.tenantId) {
  throw new AppError('Tenant mismatch', 403);
}
```

### 3. Rate Limiting

```typescript
// Per-tenant rate limiting
const limiter = rateLimit({
  keyGenerator: (req) => req.user.tenantId,
  max: 100,
  windowMs: 15 * 60 * 1000,
});
```

## Performance Optimization

### 1. Database Indexes

```sql
CREATE INDEX idx_orders_tenant_user ON orders(tenant_id, user_id);
CREATE INDEX idx_invoices_tenant_user ON invoices(tenant_id, user_id);
```

### 2. Caching

```typescript
// Cache tenant data
const tenantCache = new Map<string, Tenant>();

async function getTenant(tenantId: string) {
  if (tenantCache.has(tenantId)) {
    return tenantCache.get(tenantId);
  }
  
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  tenantCache.set(tenantId, tenant);
  return tenant;
}
```

### 3. Connection Pooling

```typescript
// Increase pool size for multi-tenant
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_size = 20
}
```

## Monitoring

### 1. Tenant Metrics

Track per-tenant:
- API request count
- Error rates
- Response times
- Active users
- Storage usage

### 2. Logging

```typescript
logger.info('Order created', {
  tenantId: req.user.tenantId,
  userId: req.user.userId,
  orderId: order.id,
});
```

## Rollback Plan

If issues occur:

1. Disable tenant middleware
2. Revert to Phase 1 routing
3. Run rollback migration
4. Restore database backup

## Checklist

- [ ] Database migration completed
- [ ] Tenant middleware enabled
- [ ] Tenant context implemented
- [ ] Frontend routing updated
- [ ] Theming system implemented
- [ ] Feature flags working
- [ ] Admin dashboard created
- [ ] Security validation added
- [ ] Performance optimized
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Team trained

## Timeline

- Week 1: Database and backend changes
- Week 2: Frontend routing and context
- Week 3: Feature flags and theming
- Week 4: Admin dashboard and testing

## Support

For questions or issues during upgrade:
- Check logs in `backend/logs/`
- Review Prisma Studio for data issues
- Test with demo tenants first
- Gradual rollout recommended
