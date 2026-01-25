import { lazy, Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api-client';

const AdminApp = lazy(() => import('admin_mfe/AdminApp'));

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div className="loading">Loading Team Management...</div>}>
      <AdminApp user={user} apiClient={apiClient} />
    </Suspense>
  );
}
