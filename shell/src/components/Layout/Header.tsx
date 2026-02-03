import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-border/50"
    >
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - App name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  OptiFlow
                </h1>
                {/* <p className="text-xs text-muted-foreground">
                  Microfrontend Platform
                </p> */}
              </div>
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200 border border-border"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-accent/50">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                {user?.role && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

