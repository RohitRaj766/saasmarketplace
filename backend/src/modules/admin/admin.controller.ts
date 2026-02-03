import { Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { AuthRequest } from '../../common/types';
import { ResponseUtil } from '../../common/utils/response.util';

const adminService = new AdminService();

export class AdminController {
  async getTeamMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const organizationId = req.user!.organizationId;
      const members = await adminService.getTeamMembers(organizationId);
      return ResponseUtil.success(res, members);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const organizationId = req.user!.organizationId;
      const adminEmail = req.user!.email;
      const { email, password, firstName, lastName, role, department, jobTitle } = req.body;
      
      const user = await adminService.createUser(organizationId, adminEmail, {
        email,
        password,
        firstName,
        lastName,
        role,
        department,
        jobTitle,
      });
      
      return ResponseUtil.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const organizationId = req.user!.organizationId;
      
      const user = await adminService.updateUserRole(userId, role, organizationId);
      return ResponseUtil.success(res, user, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user!.userId;
      const organizationId = req.user!.organizationId;
      
      await adminService.deleteUser(userId, currentUserId, organizationId);
      return ResponseUtil.noContent(res);
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const organizationId = req.user!.organizationId;
      const logs = await adminService.getActivityLogs(organizationId, limit);
      return ResponseUtil.success(res, logs);
    } catch (error) {
      next(error);
    }
  }
}
