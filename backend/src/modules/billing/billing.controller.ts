import { Response, NextFunction } from 'express';
import { BillingService } from './billing.service';
import { AuthRequest } from '../../common/types';
import { ResponseUtil } from '../../common/utils/response.util';

const billingService = new BillingService();

export class BillingController {
  async getInvoices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoices = await billingService.getInvoices(
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, invoices);
    } catch (error) {
      next(error);
    }
  }

  async getInvoiceById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoice = await billingService.getInvoiceById(
        req.params.id,
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, invoice);
    } catch (error) {
      next(error);
    }
  }

  async createInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoice = await billingService.createInvoice({
        userId: req.user!.userId,
        organizationId: req.user!.organizationId,
        tenantId: req.user!.tenantId,
        ...req.body,
      });
      return ResponseUtil.created(res, invoice, 'Invoice created successfully');
    } catch (error) {
      next(error);
    }
  }

  async payInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoice = await billingService.payInvoice(
        req.params.id,
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, invoice, 'Invoice paid successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateInvoiceStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const invoice = await billingService.updateInvoiceStatus(
        req.params.id,
        status,
        req.user!.userId,
        req.user!.tenantId
      );
      return ResponseUtil.success(res, invoice, 'Invoice status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
