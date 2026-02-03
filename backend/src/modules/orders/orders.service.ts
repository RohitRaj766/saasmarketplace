import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class OrdersService {
  async getOrders(userId: string, tenantId?: string) {
    return prisma.order.findMany({
      where: {
        userId,
        ...(tenantId && { tenantId }), // Phase 2
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: string, userId: string, tenantId?: string) {
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
        ...(tenantId && { tenantId }), // Phase 2
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  async createOrder(data: {
    userId: string;
    items: any[];
    totalAmount: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingAddress?: any;
    notes?: string;
    tenantId?: string;
  }) {
    const orderNumber = `ORD-${Date.now()}`;

    return prisma.order.create({
      data: {
        userId: data.userId,
        orderNumber,
        items: {
          items: data.items,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
        },
        totalAmount: data.totalAmount,
        status: 'pending',
        ...(data.tenantId && { tenantId: data.tenantId }),
      },
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    userId: string,
    tenantId?: string
  ) {
    const order = await this.getOrderById(id, userId, tenantId);

    return prisma.order.update({
      where: { id: order.id },
      data: { status },
    });
  }

  async deleteOrder(id: string, userId: string, tenantId?: string) {
    const order = await this.getOrderById(id, userId, tenantId);

    await prisma.order.delete({
      where: { id: order.id },
    });
  }
}
