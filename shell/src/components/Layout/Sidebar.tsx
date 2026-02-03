import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, ShoppingBag, CreditCard, BarChart3, Users } from 'lucide-react';

const navItems = [
  {
    name: 'Overview',
    path: '/app/overview',
    icon: Home,
    feature: null,
  },
  {
    name: 'Orders',
    path: '/app/orders',
    icon: ShoppingBag,
    feature: 'orders',
  },
  {
    name: 'Billing',
    path: '/app/billing',
    icon: CreditCard,
    feature: 'billing',
  },
  {
    name: 'Analytics',
    path: '/app/analytics',
    icon: BarChart3,
    feature: 'analytics',
  },
  {
    name: 'Team',
    path: '/app/team',
    icon: Users,
    feature: 'admin',
  },
];

export function Sidebar() {
  const { hasFeature } = useAuth();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="w-64 bg-card/50 backdrop-blur-sm border-r border-border flex-shrink-0"
    >
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          // Check if feature is required and user has access
          if (item.feature && !hasFeature(item.feature)) {
            return null;
          }

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 relative',
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full"
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

