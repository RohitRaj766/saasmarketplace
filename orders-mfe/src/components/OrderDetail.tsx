import { Order } from '../types/order.types';
import './OrderDetail.css';

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="order-detail">
      <div className="detail-card">
        <div className="detail-header">
          <h2>Order Details</h2>
          <span className={`status-badge ${order.status}`}>
            {order.status}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Order Number</label>
            <p>{order.orderNumber}</p>
          </div>

          <div className="detail-item">
            <label>Total Amount</label>
            <p className="amount">${Number(order.totalAmount).toFixed(2)}</p>
          </div>

          <div className="detail-item">
            <label>Created At</label>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="detail-item">
            <label>Last Updated</label>
            <p>{new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="items-section">
          <h3>Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>${(item.quantity * Number(item.price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
