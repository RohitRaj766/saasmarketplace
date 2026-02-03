import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class OrdersService {
  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
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
      },
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    userId: string
  ) {
    const order = await this.getOrderById(id, userId);

    return prisma.order.update({
      where: { id: order.id },
      data: { status },
    });
  }

  async deleteOrder(id: string, userId: string) {
    const order = await this.getOrderById(id, userId);

    await prisma.order.delete({
      where: { id: order.id },
    });
  }
}
