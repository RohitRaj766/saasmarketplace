import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './Layout.css';

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
