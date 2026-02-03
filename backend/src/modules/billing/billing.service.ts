import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class BillingService {
  private formatOrderData(order: any) {
    // Parse the items JSON if it's stored as nested object
    if (order && order.items && typeof order.items === 'object') {
      return {
        ...order,
        items: order.items.items || [],
        customerName: order.items.customerName,
        customerEmail: order.items.customerEmail,
        customerPhone: order.items.customerPhone,
        shippingAddress: order.items.shippingAddress,
        notes: order.items.notes,
      };
    }
    return order;
  }

  async getInvoices(userId: string, tenantId?: string) {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        ...(tenantId && { tenantId }), // Phase 2
      },
      include: {
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format order data for each invoice
    return invoices.map(invoice => ({
      ...invoice,
      order: invoice.order ? this.formatOrderData(invoice.order) : null,
    }));
  }

  async getInvoiceById(id: string, userId: string, tenantId?: string) {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId,
        ...(tenantId && { tenantId }), // Phase 2
      },
      include: {
        order: true,
      },
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    return {
      ...invoice,
      order: invoice.order ? this.formatOrderData(invoice.order) : null,
    };
  }

  async createInvoice(data: {
    userId: string;
    orderId?: string;
    amount: number;
    dueDate: Date | string;
    status?: string;
    tenantId?: string; // Phase 2
  }) {
    const invoiceNumber = `INV-${Date.now()}`;

    return prisma.invoice.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        invoiceNumber,
        amount: data.amount,
        dueDate: typeof data.dueDate === 'string' ? new Date(data.dueDate) : data.dueDate,
        status: data.status || 'unpaid',
        ...(data.tenantId && { tenantId: data.tenantId }), // Phase 2
      },
      include: {
        order: true,
      },
    });
  }

  async payInvoice(id: string, userId: string, tenantId?: string) {
    const invoice = await this.getInvoiceById(id, userId, tenantId);

    if (invoice.status === 'paid') {
      throw new AppError('Invoice already paid', 400);
    }

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
      include: {
        order: true,
      },
    });

    return {
      ...updated,
      order: updated.order ? this.formatOrderData(updated.order) : null,
    };
  }

  async updateInvoiceStatus(id: string, status: string, userId: string, tenantId?: string) {
    const invoice = await this.getInvoiceById(id, userId, tenantId);

    const validStatuses = ['unpaid', 'paid', 'overdue', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const updateData: any = { status };
    
    // Set paidAt when marking as paid
    if (status === 'paid' && invoice.status !== 'paid') {
      updateData.paidAt = new Date();
    }
    
    // Clear paidAt when marking as unpaid
    if (status === 'unpaid' && invoice.status === 'paid') {
      updateData.paidAt = null;
    }

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: updateData,
      include: {
        order: true,
      },
    });

    return {
      ...updated,
      order: updated.order ? this.formatOrderData(updated.order) : null,
    };
  }
}
