import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type TenantTheme = 'atlassian' | 'zoho';

interface ThemeContextType {
  theme: Theme;
  tenantTheme: TenantTheme;
  toggleTheme: () => void;
  setTenantTheme: (theme: TenantTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultTenantTheme?: TenantTheme;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light',
  defaultTenantTheme = 'atlassian'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [tenantTheme, setTenantTheme] = useState<TenantTheme>(defaultTenantTheme);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedTenantTheme = localStorage.getItem('tenantTheme') as TenantTheme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    if (savedTenantTheme) {
      setTenantTheme(savedTenantTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'theme-atlassian', 'theme-zoho');
    
    // Add current theme classes
    root.classList.add(theme);
    root.classList.add(`theme-${tenantTheme}`);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('tenantTheme', tenantTheme);
  }, [theme, tenantTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetTenantTheme = (newTheme: TenantTheme) => {
    setTenantTheme(newTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        tenantTheme, 
        toggleTheme, 
        setTenantTheme: handleSetTenantTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
