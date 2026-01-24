import { Order } from '../types/order.types';
import './OrderList.css';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
}

export function OrderList({ orders, isLoading, onViewOrder }: OrderListProps) {
  if (isLoading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p>No orders found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'processing':
        return '#f59e0b';
      case 'pending':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#666';
    }
  };

  return (
    <div className="order-list">
      <table className="order-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Items</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="order-number">{order.orderNumber}</td>
              <td>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </td>
              <td className="amount">${Number(order.totalAmount).toFixed(2)}</td>
              <td>{order.items.length} items</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => onViewOrder(order)}
                  className="btn-view"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
