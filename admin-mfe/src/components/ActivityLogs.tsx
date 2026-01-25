import { Clock, Plus, Edit, Trash2, DollarSign, FileText } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  userId?: string;
  userName?: string;
  createdAt: string;
  metadata?: any;
}

interface ActivityLogsProps {
  logs: ActivityLog[];
}

export default function ActivityLogs({ logs }: ActivityLogsProps) {
  // Mock data if empty
  const activityData = logs.length > 0 ? logs : [
    {
      id: '1',
      action: 'user.created',
      entityType: 'user',
      userName: 'Mike Cannon-Brookes',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      metadata: { email: 'emma.wilson@atlassian.com' }
    },
    {
      id: '2',
      action: 'order.created',
      entityType: 'order',
      userName: 'Sarah Chen',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      metadata: { orderNumber: 'ATL-2024-001' }
    },
    {
      id: '3',
      action: 'user.role_updated',
      entityType: 'user',
      userName: 'Scott Farquhar',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      metadata: { from: 'user', to: 'manager' }
    },
    {
      id: '4',
      action: 'invoice.paid',
      entityType: 'invoice',
      userName: 'David Kim',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      metadata: { invoiceNumber: 'INV-ATL-2024-002', amount: 8500 }
    },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('created')) return <Plus className="h-4 w-4" />;
    if (action.includes('updated')) return <Edit className="h-4 w-4" />;
    if (action.includes('deleted')) return <Trash2 className="h-4 w-4" />;
    if (action.includes('paid')) return <DollarSign className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('created')) return 'bg-green-500/10 text-green-600 dark:text-green-400';
    if (action.includes('updated')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    if (action.includes('deleted')) return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (action.includes('paid')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAction = (action: string) => {
    return action.split('.').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).replace('_', ' ')
    ).join(' ');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-4">
        {activityData.map((log, index) => (
          <div key={log.id} className="relative">
            {/* Timeline Line */}
            {index !== activityData.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
            )}
            
            {/* Activity Item */}
            <div className="flex gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${getActionColor(log.action)}`}>
                {getActionIcon(log.action)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-8">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {formatAction(log.action)}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">{log.userName || 'System'}</span>
                      {' '}performed action on{' '}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-foreground text-xs font-medium">
                        {log.entityType}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {formatTime(log.createdAt)}
                  </div>
                </div>

                {/* Metadata */}
                {log.metadata && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <div key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-accent rounded-md text-xs">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium text-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
