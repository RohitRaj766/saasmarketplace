import { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';

const OrdersApp = lazy(() => import('orders_mfe/OrdersApp'));

export default function OrdersPage() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div>Loading Orders...</div>}>
      <OrdersApp user={user} apiClient={apiClient} />
    </Suspense>
  );
}
