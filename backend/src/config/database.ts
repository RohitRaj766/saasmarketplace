import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Phase 2: Tenant isolation middleware
// Uncomment when implementing multi-tenancy
/*
prisma.$use(async (params, next) => {
  // Skip for tenant and auth operations
  if (['Tenant', 'RefreshToken'].includes(params.model || '')) {
    return next(params);
  }

  // Get tenant context from async local storage or request context
  const tenantId = getTenantContext();
  
  if (tenantId && params.model) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { ...params.args.where, tenantId };
    }
    
    if (params.action === 'create') {
      params.args.data = { ...params.args.data, tenantId };
    }
    
    if (params.action === 'update' || params.action === 'delete') {
      params.args.where = { ...params.args.where, tenantId };
    }
  }

  return next(params);
});
*/

export default prisma;
