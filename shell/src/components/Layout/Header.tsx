import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">SaaS Marketplace</h1>
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
