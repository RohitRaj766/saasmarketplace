import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="header-title">
            {tenant?.name || 'SaaS Marketplace'}
          </h1>
          {tenant && (
            <span className="header-tenant-slug">({tenant.slug})</span>
          )}
        </div>
        <div className="header-actions">
          <span className="header-user">
            {user?.firstName} {user?.lastName}
          </span>
          <button onClick={logout} className="header-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
