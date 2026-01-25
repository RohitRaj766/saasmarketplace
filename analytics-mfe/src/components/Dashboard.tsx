import { DollarSign, ShoppingCart, TrendingUp, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface DashboardProps {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    pendingInvoices: number;
  };
}

export default function Dashboard({ metrics }: DashboardProps) {
  const metricCards = [
    {
      title: 'Total Revenue',
      value: `$${Number(metrics.totalRevenue).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toString(),
      change: '+8.3%',
      trend: 'up' as const,
      icon: ShoppingCart,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Avg Order Value',
      value: `$${Number(metrics.avgOrderValue).toLocaleString()}`,
      change: '+2.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Pending Invoices',
      value: metrics.pendingInvoices.toString(),
      change: '-5.2%',
      trend: 'down' as const,
      icon: Clock,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.iconBg}`}>
                <Icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                {metric.change}
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {metric.title}
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {metric.value}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              from last period
            </p>
          </div>
        );
      })}
    </div>
  );
}
