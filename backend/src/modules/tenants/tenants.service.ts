import { AppError } from '../../common/middleware/error.middleware';

export class TenantsService {
  async getTenantBySlug(_slug: string) {
    // Phase 2: Multi-tenancy feature
    // const tenant = await prisma.tenant.findUnique({
    //   where: { slug },
    // });

    // if (!tenant) {
    //   throw new AppError('Tenant not found', 404);
    // }

    // if (!tenant.isActive) {
    //   throw new AppError('Tenant is inactive', 403);
    // }

    // return tenant;
    throw new AppError('Multi-tenancy feature not yet implemented', 501);
  }

  async getTenantById(_id: string) {
    // Phase 2: Multi-tenancy feature
    // const tenant = await prisma.tenant.findUnique({
    //   where: { id },
    // });

    // if (!tenant) {
    //   throw new AppError('Tenant not found', 404);
    // }

    // return tenant;
    throw new AppError('Multi-tenancy feature not yet implemented', 501);
  }

  async getAllTenants() {
    // Phase 2: Multi-tenancy feature
    // return prisma.tenant.findMany({
    //   where: { isActive: true },
    //   select: {
    //     id: true,
    //     name: true,
    //     slug: true,
    //     domain: true,
    //     isActive: true,
    //     createdAt: true,
    //   },
    // });
    return [];
  }

  async checkFeatureEnabled(_tenantId: string, _featureKey: string): Promise<boolean> {
    // Phase 2: Multi-tenancy feature
    // const feature = await prisma.tenantFeature.findUnique({
    //   where: {
    //     tenantId_featureKey: {
    //       tenantId,
    //       featureKey
    //     }
    //   }
    // });
    // return feature?.isEnabled === true;
    return false;
  }
}
