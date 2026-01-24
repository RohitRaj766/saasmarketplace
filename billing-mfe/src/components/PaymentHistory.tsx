import { Payment } from '../types/billing.types';
import './PaymentHistory.css';

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading: boolean;
}

export function PaymentHistory({ payments, isLoading }: PaymentHistoryProps) {
  if (isLoading) {
    return <div className="loading">Loading payment history...</div>;
  }

  if (payments.length === 0) {
    return <div className="empty-state">No payments found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#666';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  return (
    <div className="payment-history">
      <table className="payment-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="transaction-id">
                {payment.transactionId || payment.id}
              </td>
              <td className="amount">${Number(payment.amount).toFixed(2)}</td>
              <td>{getMethodLabel(payment.method)}</td>
              <td>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(payment.status) }}
                >
                  {payment.status}
                </span>
              </td>
              <td>{new Date(payment.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
