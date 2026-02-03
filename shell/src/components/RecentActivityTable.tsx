import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  action: string;
  time: string;
  type: 'order' | 'payment' | 'user' | 'report';
  relatedId?: string;
}

interface RecentActivityTableProps {
  activities: Activity[];
  isLoading: boolean;
  onActivityClick: (activity: Activity) => void;
}

export default function RecentActivityTable({ activities, isLoading, onActivityClick }: RecentActivityTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = activities || [];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    return filtered;
  }, [activities, searchQuery, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-500';
      case 'payment': return 'bg-green-500';
      case 'user': return 'bg-purple-500';
      case 'report': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      order: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      payment: 'bg-green-500/10 text-green-600 dark:text-green-400',
      user: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      report: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/10 text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="payment">Payments</option>
            <option value="user">Users</option>
            <option value="report">Reports</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Activity
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedActivities.map((activity) => (
              <motion.tr
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onActivityClick(activity)}
                className="hover:bg-accent/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(activity.type)}`}>
                    <span className={`w-2 h-2 rounded-full ${getTypeColor(activity.type)}`} />
                    {activity.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {activity.action}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground text-right whitespace-nowrap">
                  {activity.time}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredActivities.length)} of {filteredActivities.length} activities
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-border rounded-md text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-foreground hover:bg-accent'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-border rounded-md text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
