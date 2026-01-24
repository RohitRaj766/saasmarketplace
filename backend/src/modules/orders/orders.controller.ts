import { Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { AuthRequest } from '../../common/types';
import { ResponseUtil } from '../../common/utils/response.util';

const ordersService = new OrdersService();

export class OrdersController {
  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await ordersService.getOrders(
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await ordersService.getOrderById(
        req.params.id,
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, order);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await ordersService.createOrder({
        userId: req.user!.userId,
        tenantId: req.user!.tenantId,
        ...req.body,
      });
      return ResponseUtil.created(res, order, 'Order created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await ordersService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, order, 'Order updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ordersService.deleteOrder(
        req.params.id,
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}
