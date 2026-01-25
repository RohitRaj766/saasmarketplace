import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface OrdersChartProps {
  data: any[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  // Mock data if empty
  const chartData = data.length > 0 ? data : [
    { date: 'Jan 1', completed: 45, pending: 12, cancelled: 3 },
    { date: 'Jan 8', completed: 52, pending: 15, cancelled: 2 },
    { date: 'Jan 15', completed: 61, pending: 18, cancelled: 4 },
    { date: 'Jan 22', completed: 48, pending: 10, cancelled: 1 },
    { date: 'Jan 29', completed: 67, pending: 20, cancelled: 5 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Orders by Status</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="date" 
            className="text-muted-foreground"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-muted-foreground"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend />
          <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          <Bar dataKey="cancelled" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
