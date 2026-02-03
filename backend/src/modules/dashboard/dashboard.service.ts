import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  async getMetrics(userId: string, organizationId: string) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    // Get current month data (filtered by organization)
    const [currentOrders, currentInvoices] = await Promise.all([
      prisma.order.findMany({
        where: {
          organizationId,
          createdAt: { gte: lastMonth },
        },
      }),
      prisma.invoice.findMany({
        where: {
          organizationId,
          createdAt: { gte: lastMonth },
        },
      }),
    ]);

    // Get previous month data for comparison
    const [previousOrders, previousInvoices] = await Promise.all([
      prisma.order.findMany({
        where: {
          organizationId,
          createdAt: { gte: twoMonthsAgo, lt: lastMonth },
        },
      }),
      prisma.invoice.findMany({
        where: {
          organizationId,
          createdAt: { gte: twoMonthsAgo, lt: lastMonth },
        },
      }),
    ]);

    // Calculate metrics
    const totalOrders = await prisma.order.count({ where: { organizationId } });
    const pendingInvoices = await prisma.invoice.count({
      where: { organizationId, status: { in: ['unpaid', 'pending'] } },
    });

    // Calculate revenue from paid invoices (convert Decimal to number)
    const revenue = currentInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    const previousRevenue = previousInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    // Calculate percentage changes
    const orderChange = previousOrders.length > 0
      ? Math.round(((currentOrders.length - previousOrders.length) / previousOrders.length) * 100)
      : 0;

    const revenueChange = previousRevenue > 0
      ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100)
      : 0;

    const currentPendingCount = currentInvoices.filter(inv => ['unpaid', 'pending'].includes(inv.status)).length;
    const previousPendingCount = previousInvoices.filter(inv => ['unpaid', 'pending'].includes(inv.status)).length;
    const invoiceChange = currentPendingCount - previousPendingCount;

    // Get total team members count (all users in the organization)
    const activeMembers = await prisma.user.count({
      where: { 
        organizationId,
      },
    });

    // Get members from previous period for comparison
    const previousMembers = await prisma.user.count({
      where: { 
        organizationId,
        createdAt: { lt: lastMonth },
      },
    });

    const memberChange = activeMembers - previousMembers;

    return {
      totalOrders,
      revenue,
      pendingInvoices,
      activeMembers,
      orderChange,
      revenueChange,
      invoiceChange,
      memberChange,
    };
  }

  async getRecentActivity(userId: string, organizationId: string, limit: number = 10) {
    // Get recent orders (filtered by organization)
    const recentOrders = await prisma.order.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    // Get recent invoices (filtered by organization)
    const recentInvoices = await prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    // Combine and format activities
    const activities = [
      ...recentOrders.map((order) => ({
        id: order.id,
        action: `Order #${order.id.slice(0, 8)} ${order.status}`,
        time: this.formatTimeAgo(order.createdAt),
        type: 'order' as const,
        relatedId: order.id,
        timestamp: order.createdAt,
      })),
      ...recentInvoices.map((invoice) => ({
        id: invoice.id,
        action: `Invoice #${invoice.id.slice(0, 8)} ${invoice.status}`,
        time: this.formatTimeAgo(invoice.createdAt),
        type: invoice.status === 'paid' ? ('payment' as const) : ('order' as const),
        relatedId: invoice.id,
        timestamp: invoice.createdAt,
      })),
    ];

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .map(({ timestamp, ...activity }) => activity);
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
}
