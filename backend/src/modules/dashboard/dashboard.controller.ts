import { Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthRequest } from '../../common/types';
import { ResponseUtil } from '../../common/utils/response.util';

const dashboardService = new DashboardService();

export class DashboardController {
  async getMetrics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const metrics = await dashboardService.getMetrics(
        req.user!.userId,
        req.user!.organizationId
      );
      return ResponseUtil.success(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await dashboardService.getRecentActivity(
        req.user!.userId,
        req.user!.organizationId,
        limit
      );
      return ResponseUtil.success(res, activities);
    } catch (error) {
      next(error);
    }
  }
}
