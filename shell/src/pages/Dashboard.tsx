import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome back, {user?.firstName}!</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p className="dashboard-metric">156</p>
          <span className="dashboard-change positive">+12% from last month</span>
        </div>

        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p className="dashboard-metric">$45,231</p>
          <span className="dashboard-change positive">+8% from last month</span>
        </div>

        <div className="dashboard-card">
          <h3>Pending Invoices</h3>
          <p className="dashboard-metric">23</p>
          <span className="dashboard-change negative">+3 from last week</span>
        </div>

        <div className="dashboard-card">
          <h3>Active Customers</h3>
          <p className="dashboard-metric">89</p>
          <span className="dashboard-change positive">+5 this month</span>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-button">Create New Order</button>
          <button className="action-button">Generate Invoice</button>
          <button className="action-button">View Reports</button>
        </div>
      </div>
    </div>
  );
}
