import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/billing"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          Billing
        </NavLink>
      </nav>
    </aside>
  );
}
