import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { Layout } from './components/Layout/Layout';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import BillingPage from './pages/BillingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/overview" replace />} />
                <Route path="/app/overview" element={<Dashboard />} />
                <Route path="/app/orders/*" element={<OrdersPage />} />
                <Route path="/app/billing/*" element={<BillingPage />} />
                <Route 
                  path="/app/analytics/*" 
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AnalyticsPage />
                    </RoleProtectedRoute>
                  } 
                />
                <Route 
                  path="/app/team/*" 
                  element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                      <AdminPage />
                    </RoleProtectedRoute>
                  } 
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
