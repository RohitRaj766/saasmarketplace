import { useState, useEffect } from 'react';
import { InvoiceList } from './components/InvoiceList';
import { PaymentHistory } from './components/PaymentHistory';
import { BillingSettings } from './components/BillingSettings';
import { Invoice, Payment } from './types/billing.types';
import './App.css';

interface BillingAppProps {
  user: any;
  apiClient: any;
}

export default function BillingApp({ user }: BillingAppProps) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'settings'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Try to load from API
      try {
        const invoicesResponse = await fetch('http://localhost:4000/billing/invoices', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          const invoices = invoicesData.data || invoicesData;
          setInvoices(Array.isArray(invoices) ? invoices : []);
          setIsLoading(false);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Mock data for demo
      setInvoices([
        {
          id: '1',
          invoiceNumber: 'INV-001',
          amount: 1250.00,
          status: 'paid',
          dueDate: '2024-02-15',
          paidAt: '2024-02-10',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          invoiceNumber: 'INV-002',
          amount: 850.00,
          status: 'unpaid',
          dueDate: '2024-03-01',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);

      setPayments([
        {
          id: '1',
          invoiceId: '1',
          amount: 1250.00,
          method: 'credit_card',
          status: 'completed',
          transactionId: 'TXN-12345',
          createdAt: '2024-02-10'
        }
      ]);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="billing-app">
      <div className="billing-header">
        <h1>Billing Management</h1>
      </div>

      <div className="billing-tabs">
        <button
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
        <button
          className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payment History
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="billing-content">
        {activeTab === 'invoices' && (
          <InvoiceList invoices={invoices} isLoading={isLoading} />
        )}
        {activeTab === 'payments' && (
          <PaymentHistory payments={payments} isLoading={isLoading} />
        )}
        {activeTab === 'settings' && (
          <BillingSettings user={user} />
        )}
      </div>
    </div>
  );
}
