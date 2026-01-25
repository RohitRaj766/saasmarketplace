# OptiFlow - Enterprise SaaS Design System

## 🎨 Design Philosophy

OptiFlow follows a **clean, minimal, enterprise-grade** design language inspired by Stripe, Linear, Vercel, and Atlassian. The system prioritizes:

- **Clarity over decoration**
- **Consistency over creativity**
- **Accessibility over aesthetics**
- **Performance over perfection**

---

## 1. Design Tokens

### Color System

#### Neutral Colors (Base)
```javascript
const colors = {
  // Light Mode
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    border: {
      primary: '#E5E7EB',
      secondary: '#D1D5DB',
      focus: '#3B82F6',
    },
  },
  
  // Dark Mode
  dark: {
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      inverse: '#0F172A',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      focus: '#60A5FA',
    },
  },
}
```

#### Brand Colors (Tenant-Specific)

**Atlassian Theme:**
```javascript
atlassian: {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  accent: '#0052CC',
}
```

**Zoho Theme:**
```javascript
zoho: {
  primary: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  accent: '#E42527',
}
```

#### Semantic Colors
```javascript
semantic: {
  success: {
    light: '#10B981',
    dark: '#34D399',
  },
  warning: {
    light: '#F59E0B',
    dark: '#FBBF24',
  },
  error: {
    light: '#EF4444',
    dark: '#F87171',
  },
  info: {
    light: '#3B82F6',
    dark: '#60A5FA',
  },
}
```

### Typography

#### Font Stack
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale
```javascript
typography: {
  // Display
  display: {
    xl: { size: '4.5rem', lineHeight: '1.1', weight: '700' },
    lg: { size: '3.75rem', lineHeight: '1.1', weight: '700' },
    md: { size: '3rem', lineHeight: '1.2', weight: '700' },
    sm: { size: '2.25rem', lineHeight: '1.2', weight: '600' },
  },
  
  // Heading
  heading: {
    xl: { size: '1.875rem', lineHeight: '2.25rem', weight: '600' },
    lg: { size: '1.5rem', lineHeight: '2rem', weight: '600' },
    md: { size: '1.25rem', lineHeight: '1.75rem', weight: '600' },
    sm: { size: '1.125rem', lineHeight: '1.75rem', weight: '600' },
    xs: { size: '1rem', lineHeight: '1.5rem', weight: '600' },
  },
  
  // Body
  body: {
    lg: { size: '1.125rem', lineHeight: '1.75rem', weight: '400' },
    md: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
    sm: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
    xs: { size: '0.75rem', lineHeight: '1rem', weight: '400' },
  },
}
```

### Spacing System

```javascript
spacing: {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}
```

### Border Radius

```javascript
borderRadius: {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
}
```

### Shadows

```javascript
shadows: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}
```

---

## 2. Component Patterns

### Button Variants

```jsx
// Primary Button
<button className="
  px-4 py-2 
  bg-primary-600 hover:bg-primary-700 
  text-white font-medium 
  rounded-lg 
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Primary Action
</button>

// Secondary Button
<button className="
  px-4 py-2 
  bg-white dark:bg-gray-800 
  border border-gray-300 dark:border-gray-600 
  text-gray-700 dark:text-gray-200 
  font-medium rounded-lg 
  hover:bg-gray-50 dark:hover:bg-gray-700
  transition-colors duration-200
">
  Secondary Action
</button>

// Ghost Button
<button className="
  px-4 py-2 
  text-gray-700 dark:text-gray-200 
  font-medium rounded-lg 
  hover:bg-gray-100 dark:hover:bg-gray-800
  transition-colors duration-200
">
  Ghost Action
</button>
```

### Input Fields

```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email Address
  </label>
  <input
    type="email"
    className="
      w-full px-3 py-2
      bg-white dark:bg-gray-800
      border border-gray-300 dark:border-gray-600
      rounded-lg
      text-gray-900 dark:text-gray-100
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      transition-all duration-200
    "
    placeholder="you@example.com"
  />
  <p className="text-sm text-gray-500 dark:text-gray-400">
    We'll never share your email.
  </p>
</div>
```

### Cards

```jsx
<div className="
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-xl
  shadow-sm
  hover:shadow-md
  transition-shadow duration-200
  overflow-hidden
">
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Card Title
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      Card content goes here
    </p>
  </div>
</div>
```

### Status Badges

```jsx
// Success
<span className="
  inline-flex items-center px-2.5 py-0.5
  rounded-full text-xs font-medium
  bg-green-100 dark:bg-green-900/30
  text-green-800 dark:text-green-300
">
  Active
</span>

// Warning
<span className="
  inline-flex items-center px-2.5 py-0.5
  rounded-full text-xs font-medium
  bg-yellow-100 dark:bg-yellow-900/30
  text-yellow-800 dark:text-yellow-300
">
  Pending
</span>

// Error
<span className="
  inline-flex items-center px-2.5 py-0.5
  rounded-full text-xs font-medium
  bg-red-100 dark:bg-red-900/30
  text-red-800 dark:text-red-300
">
  Failed
</span>
```

---

## 3. Layout Patterns

### Page Container

```jsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
  </div>
</div>
```

### Section Header

```jsx
<div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
    Page Title
  </h1>
  <p className="mt-2 text-gray-600 dark:text-gray-400">
    Page description or subtitle
  </p>
</div>
```

### Grid Layouts

```jsx
// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>

// 2-column with sidebar
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">
    {/* Main content */}
  </div>
  <div className="lg:col-span-1">
    {/* Sidebar */}
  </div>
</div>
```

---

## 4. Animation & Motion

### Transition Utilities

```javascript
transitions: {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}
```

### Framer Motion Variants

```javascript
// Fade in
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

// Slide up
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

// Scale
const scale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 }
}
```

---

## 5. Accessibility Guidelines

### Focus States
- All interactive elements must have visible focus indicators
- Use `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- Never use `outline-none` without alternative focus indicator

### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

### Keyboard Navigation
- All interactive elements accessible via Tab
- Modal dialogs trap focus
- Escape key closes modals/dropdowns
- Arrow keys for navigation in lists

### Screen Reader Support
```jsx
// Hidden text for screen readers
<span className="sr-only">Screen reader only text</span>

// ARIA labels
<button aria-label="Close dialog">
  <XIcon className="w-5 h-5" />
</button>

// ARIA live regions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## 6. Responsive Breakpoints

```javascript
screens: {
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Mobile-First Approach
```jsx
<div className="
  w-full           // Mobile: full width
  md:w-1/2         // Tablet: half width
  lg:w-1/3         // Desktop: third width
  xl:w-1/4         // Large: quarter width
">
  Responsive content
</div>
```

---

## 7. Loading States

### Skeleton Loaders

```jsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
</div>
```

### Spinners

```jsx
<div className="flex items-center justify-center">
  <div className="
    animate-spin rounded-full 
    h-8 w-8 
    border-b-2 border-primary-600
  "></div>
</div>
```

---

## 8. Error States

### Inline Errors

```jsx
<div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <XCircleIcon className="h-5 w-5 text-red-400" />
    </div>
    <div className="ml-3">
      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
        Error occurred
      </h3>
      <div className="mt-2 text-sm text-red-700 dark:text-red-400">
        <p>Error message details here</p>
      </div>
    </div>
  </div>
</div>
```

### Empty States

```jsx
<div className="text-center py-12">
  <svg className="mx-auto h-12 w-12 text-gray-400" /* icon */ />
  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
    No items found
  </h3>
  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
    Get started by creating a new item.
  </p>
  <div className="mt-6">
    <button className="btn-primary">
      Create New Item
    </button>
  </div>
</div>
```

---

## 9. Theming Implementation

### Theme Provider

```jsx
// contexts/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type TenantTheme = 'atlassian' | 'zoho';

interface ThemeContextType {
  theme: Theme;
  tenantTheme: TenantTheme;
  toggleTheme: () => void;
  setTenantTheme: (theme: TenantTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [tenantTheme, setTenantTheme] = useState<TenantTheme>('atlassian');

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedTenantTheme = localStorage.getItem('tenantTheme') as TenantTheme;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedTenantTheme) setTenantTheme(savedTenantTheme);
    
    // Apply dark class to html
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, tenantTheme, toggleTheme, setTenantTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## 10. Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const OrdersPage = lazy(() => import('./pages/OrdersPage'));

<Suspense fallback={<LoadingSpinner />}>
  <OrdersPage />
</Suspense>
```

### Image Optimization
```jsx
<img
  src={imageUrl}
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### Memoization
```jsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(/* expensive operation */);
  }, [data]);
  
  return <div>{/* render */}</div>;
});
```

---

**Next:** Auth MFE UI Architecture →
