import { Users } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  ordersProcessed: number;
  revenue: number;
  avgResponseTime: string;
}

interface TeamPerformanceProps {
  data: TeamMember[];
}

export default function TeamPerformance({ data }: TeamPerformanceProps) {
  // Mock data if empty
  const teamData = data.length > 0 ? data : [
    { id: '1', name: 'Sarah Chen', role: 'Sales Manager', ordersProcessed: 156, revenue: 234500, avgResponseTime: '2.3h' },
    { id: '2', name: 'Emma Wilson', role: 'Sales Rep', ordersProcessed: 142, revenue: 198700, avgResponseTime: '3.1h' },
    { id: '3', name: 'James Brown', role: 'Sales Rep', ordersProcessed: 128, revenue: 187300, avgResponseTime: '2.8h' },
    { id: '4', name: 'David Kim', role: 'Finance Manager', ordersProcessed: 89, revenue: 156200, avgResponseTime: '4.2h' },
    { id: '5', name: 'Lisa Anderson', role: 'Accountant', ordersProcessed: 76, revenue: 134800, avgResponseTime: '3.5h' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Team Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Team Member</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orders Processed</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue Generated</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Avg Response Time</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member) => (
              <tr key={member.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-foreground">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted-foreground">{member.role}</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {member.ordersProcessed}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="font-semibold text-foreground">
                    ${Number(member.revenue).toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    {member.avgResponseTime}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
