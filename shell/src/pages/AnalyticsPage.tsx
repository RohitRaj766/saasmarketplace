import { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';

const AnalyticsApp = lazy(() => import('analytics_mfe/AnalyticsApp'));

export default function AnalyticsPage() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div className="loading">Loading Analytics...</div>}>
      <AnalyticsApp user={user} apiClient={apiClient} />
    </Suspense>
  );
}
