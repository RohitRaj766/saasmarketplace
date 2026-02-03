import { useState, useEffect } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import Dashboard from './components/Dashboard';
import RevenueChart from './components/RevenueChart';
import OrdersChart from './components/OrdersChart';
import InvoiceStatusChart from './components/InvoiceStatusChart';
import TopProducts from './components/TopProducts';

interface AnalyticsAppProps {
  user?: any;
  apiClient: any;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: any[];
  createdAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

export default function AnalyticsApp(_props: AnalyticsAppProps) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [invoiceStatusData, setInvoiceStatusData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch orders data
      const ordersResponse = await fetch('http://localhost:4000/orders', { headers });
      const ordersResult = await ordersResponse.json();
      const orders: Order[] = Array.isArray(ordersResult) ? ordersResult : (ordersResult.data || []);

      // Fetch invoices data
      const invoicesResponse = await fetch('http://localhost:4000/billing/invoices', { headers });
      const invoicesResult = await invoicesResponse.json();
      const invoices: Invoice[] = Array.isArray(invoicesResult) ? invoicesResult : (invoicesResult.data || []);

      // Calculate metrics
      const now = new Date();
      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const filteredOrders = orders.filter(o => new Date(o.createdAt) >= cutoffDate);
      const filteredInvoices = invoices.filter(i => new Date(i.createdAt) >= cutoffDate);

      const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const totalOrders = filteredOrders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const pendingInvoices = filteredInvoices.filter(i => i.status === 'unpaid').length;
      const paidInvoices = filteredInvoices.filter(i => i.status === 'paid').length;
      const overdueInvoices = filteredInvoices.filter(i => i.status === 'overdue').length;

      setMetrics({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        pendingInvoices,
        paidInvoices,
        overdueInvoices,
      });

      // Process revenue data by date
      const revenueByDate = processRevenueData(filteredOrders, daysAgo);
      setRevenueData(revenueByDate);

      // Process orders by status
      const ordersByStatus = processOrdersData(filteredOrders);
      setOrdersData(ordersByStatus);

      // Process invoice status data
      const invoiceStatus = [
        { name: 'Paid', value: paidInvoices, color: '#10b981' },
        { name: 'Unpaid', value: pendingInvoices, color: '#f59e0b' },
        { name: 'Overdue', value: overdueInvoices, color: '#ef4444' },
      ];
      setInvoiceStatusData(invoiceStatus);

      // Process top products
      const products = processTopProducts(filteredOrders);
      setTopProducts(products);

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (orders: Order[], days: number) => {
    const dataMap = new Map<string, number>();
    const now = new Date();
    
    // Initialize all dates with 0
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dataMap.set(key, 0);
    }

    // Aggregate revenue by date
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dataMap.has(key)) {
        dataMap.set(key, dataMap.get(key)! + Number(order.totalAmount));
      }
    });

    return Array.from(dataMap.entries()).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));
  };

  const processOrdersData = (orders: Order[]) => {
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
    }));
  };

  const processTopProducts = (orders: Order[]) => {
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    orders.forEach(order => {
      let items = order.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch (e) {
          items = [];
        }
      }

      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          const existing = productMap.get(item.productName) || { name: item.productName, quantity: 0, revenue: 0 };
          existing.quantity += item.quantity;
          existing.revenue += item.total;
          productMap.set(item.productName, existing);
        });
      }
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
            <p className="text-sm text-muted-foreground">Track your business performance</p>
          </div>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1">
          <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
          <button
            onClick={() => setDateRange('7d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === '7d'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === '30d'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateRange === '90d'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <Dashboard metrics={metrics} />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvoiceStatusChart data={invoiceStatusData} />
        <TopProducts data={topProducts} />
      </div>
    </div>
  );
}
