import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class TenantsService {
  async getTenantBySlug(slug: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    if (!tenant.isActive) {
      throw new AppError('Tenant is inactive', 403);
    }

    return tenant;
  }

  async getTenantById(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    return tenant;
  }

  async getAllTenants() {
    return prisma.tenant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async checkFeatureEnabled(tenantId: string, featureKey: string): Promise<boolean> {
    const tenant = await this.getTenantById(tenantId);
    const features = tenant.features as any;
    return features[featureKey] === true;
  }
}
