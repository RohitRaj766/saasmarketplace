import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Phase 2: Tenant isolation middleware
prisma.$use(async (params, next) => {
  // Skip for tenant and auth operations
  if (['Tenant', 'RefreshToken', 'User'].includes(params.model || '')) {
    return next(params);
  }

  // For now, we'll handle tenant filtering in the service layer
  // This middleware can be enhanced to automatically inject tenantId
  return next(params);
});

export default prisma;
