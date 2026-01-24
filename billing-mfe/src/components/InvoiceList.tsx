import { Invoice } from '../types/billing.types';
import './InvoiceList.css';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export function InvoiceList({ invoices, isLoading }: InvoiceListProps) {
  if (isLoading) {
    return <div className="loading">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return <div className="empty-state">No invoices found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#22c55e';
      case 'unpaid':
        return '#3b82f6';
      case 'overdue':
        return '#ef4444';
      case 'cancelled':
        return '#666';
      default:
        return '#666';
    }
  };

  return (
    <div className="invoice-list">
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Paid At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="invoice-number">{invoice.invoiceNumber}</td>
              <td className="amount">${Number(invoice.amount).toFixed(2)}</td>
              <td>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(invoice.status) }}
                >
                  {invoice.status}
                </span>
              </td>
              <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
              <td>
                {invoice.paidAt 
                  ? new Date(invoice.paidAt).toLocaleDateString() 
                  : '-'}
              </td>
              <td>
                <button className="btn-download">Download</button>
                {invoice.status === 'unpaid' && (
                  <button className="btn-pay">Pay Now</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
