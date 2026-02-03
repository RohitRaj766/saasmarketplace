import { apiClient } from '../lib/api-client';

export interface DashboardMetrics {
  totalOrders: number;
  revenue: number;
  pendingInvoices: number;
  activeMembers: number;
  orderChange: number;
  revenueChange: number;
  invoiceChange: number;
  memberChange: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  time: string;
  type: 'order' | 'payment' | 'user' | 'report';
  relatedId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics');
      return response.data;
    } catch (error) {
      // Fallback to calculating from individual endpoints
      const [orders, invoices] = await Promise.all([
        apiClient.get<ApiResponse<any[]>>('/orders'),
        apiClient.get<ApiResponse<any[]>>('/billing/invoices'),
      ]);

      const ordersData = orders.data || [];
      const invoicesData = invoices.data || [];

      const totalOrders = ordersData.length;
      const pendingInvoices = invoicesData.filter((inv: any) => 
        inv.status === 'unpaid' || inv.status === 'pending'
      ).length;
      const revenue = invoicesData
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + (Number(inv.amount) || 0), 0);

      return {
        totalOrders,
        revenue,
        pendingInvoices,
        activeMembers: 0, // Would need team members endpoint
        orderChange: 0,
        revenueChange: 0,
        invoiceChange: 0,
        memberChange: 0,
      };
    }
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await apiClient.get<ApiResponse<RecentActivity[]>>('/dashboard/activity');
      return response.data;
    } catch (error) {
      // Fallback to recent orders
      const ordersResponse = await apiClient.get<ApiResponse<any[]>>('/orders');
      const orders = ordersResponse.data || [];
      
      return orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        action: `Order #${order.id.slice(0, 8)} ${order.status}`,
        time: formatTimeAgo(new Date(order.createdAt)),
        type: 'order' as const,
        relatedId: order.id,
      }));
    }
  },
};

function formatTimeAgo(date: Date): string {
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
