import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class BillingService {
  async getInvoices(userId: string, tenantId?: string) {
    return prisma.invoice.findMany({
      where: {
        userId,
        ...(tenantId && { tenantId }), // Phase 2
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInvoiceById(id: string, userId: string, tenantId?: string) {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
        ...(tenantId && { tenantId }), // Phase 2
      },
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    return invoice;
  }

  async createInvoice(data: {
    userId: string;
    orderId?: string;
    amount: number;
    dueDate: Date;
    tenantId?: string; // Phase 2
  }) {
    const invoiceNumber = `INV-${Date.now()}`;

    return prisma.invoice.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        invoiceNumber,
        amount: data.amount,
        dueDate: data.dueDate,
        status: 'unpaid',
        ...(data.tenantId && { tenantId: data.tenantId }), // Phase 2
      },
    });
  }

  async payInvoice(id: string, userId: string, tenantId?: string) {
    const invoice = await this.getInvoiceById(id, userId, tenantId);

    if (invoice.status === 'paid') {
      throw new AppError('Invoice already paid', 400);
    }

    return prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }
}
