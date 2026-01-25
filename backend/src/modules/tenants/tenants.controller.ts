import { Request, Response, NextFunction } from 'express';
import { TenantsService } from './tenants.service';
import { ResponseUtil } from '../../common/utils/response.util';

const tenantsService = new TenantsService();

export class TenantsController {
  async getTenantBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const tenant = await tenantsService.getTenantBySlug(slug);
      return ResponseUtil.success(res, tenant);
    } catch (error) {
      next(error);
    }
  }

  async getAllTenants(_req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await tenantsService.getAllTenants();
      return ResponseUtil.success(res, tenants);
    } catch (error) {
      next(error);
    }
  }
}
