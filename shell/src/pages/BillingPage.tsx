import { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';

const BillingApp = lazy(() => import('billing/BillingApp'));

export default function BillingPage() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div>Loading Billing...</div>}>
      <BillingApp user={user} apiClient={apiClient} />
    </Suspense>
  );
}
