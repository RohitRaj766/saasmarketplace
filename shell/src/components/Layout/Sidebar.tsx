import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, ShoppingBag, CreditCard, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  {
    name: 'Overview',
    path: '/app/overview',
    icon: Home,
    feature: null,
    roles: ['admin', 'support'], // Available to all roles
  },
  {
    name: 'Orders',
    path: '/app/orders',
    icon: ShoppingBag,
    feature: 'orders',
    roles: ['admin', 'support'],
  },
  {
    name: 'Billing',
    path: '/app/billing',
    icon: CreditCard,
    feature: 'billing',
    roles: ['admin', 'support'],
  },
  {
    name: 'Analytics',
    path: '/app/analytics',
    icon: BarChart3,
    feature: 'analytics',
    roles: ['admin'], // Only admin can access
  },
  {
    name: 'Team',
    path: '/app/team',
    icon: Users,
    feature: 'admin',
    roles: ['admin'], // Only admin can access
  },
];

export function Sidebar() {
  const { user } = useAuth();

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="w-64 bg-card/50 backdrop-blur-sm border-r border-border flex-shrink-0 overflow-hidden"
    >
      <nav className="p-3 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 relative overflow-hidden',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="  w-1 h-8 bg-primary-foreground rounded-r-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                  <span className="text-sm">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
}
