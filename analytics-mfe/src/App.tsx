import { useState, useEffect } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import Dashboard from './components/Dashboard';
import RevenueChart from './components/RevenueChart';
import OrdersChart from './components/OrdersChart';
import TeamPerformance from './components/TeamPerformance';

interface AnalyticsAppProps {
  user?: any;
  apiClient: any;
}

export default function AnalyticsApp({ apiClient }: AnalyticsAppProps) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    pendingInvoices: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch dashboard metrics
      const metricsRes = await apiClient.get('/analytics/dashboard');
      setMetrics(metricsRes.data || metricsRes);

      // Fetch revenue data
      const revenueRes = await apiClient.get(`/analytics/revenue?range=${dateRange}`);
      setRevenueData(revenueRes.data || revenueRes);

      // Fetch orders data
      const ordersRes = await apiClient.get(`/analytics/orders?range=${dateRange}`);
      setOrdersData(ordersRes.data || ordersRes);

      // Fetch team performance
      const teamRes = await apiClient.get('/analytics/team');
      setTeamData(teamRes.data || teamRes);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
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

      {/* Team Performance */}
      <TeamPerformance data={teamData} />
    </div>
  );
}
