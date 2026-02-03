import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class OrdersService {
  private formatOrderResponse(order: any) {
    // Parse the items JSON if it's stored as nested object
    if (order.items && typeof order.items === 'object') {
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

  async getOrders(userId: string, status?: string) {
    const orders = await prisma.order.findMany({
      where: { 
        userId,
        ...(status && { status })
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(order => this.formatOrderResponse(order));
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

    return this.formatOrderResponse(order);
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

    const order = await prisma.order.create({
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

    return this.formatOrderResponse(order);
  }

  async updateOrder(
    id: string,
    data: {
      items?: any[];
      totalAmount?: number;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      shippingAddress?: any;
      notes?: string;
    },
    userId: string
  ) {
    const order = await this.getOrderById(id, userId);

    // Check if order can be edited
    if (order.status === 'dispatched' || order.status === 'completed' || order.status === 'cancelled') {
      throw new AppError('Cannot edit order after it has been dispatched', 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        items: {
          items: data.items,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
        },
        totalAmount: data.totalAmount,
      },
    });

    return this.formatOrderResponse(updatedOrder);
  }

  async updateOrderStatus(
    id: string,
    status: string,
    userId: string
  ) {
    const order = await this.getOrderById(id, userId);

    // Validate status transitions
    const validStatuses = ['pending', 'accepted', 'dispatched', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });

    return this.formatOrderResponse(updatedOrder);
  }

  async deleteOrder(id: string, userId: string) {
    const order = await this.getOrderById(id, userId);

    await prisma.order.delete({
      where: { id: order.id },
    });
  }
}
