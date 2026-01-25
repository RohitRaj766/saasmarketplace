import { useState, useEffect } from 'react';
import { InvoiceList } from './components/InvoiceList';
import { PaymentHistory } from './components/PaymentHistory';
import { BillingSettings } from './components/BillingSettings';
import { Invoice, Payment } from './types/billing.types';
import { motion } from 'framer-motion';
import { cn } from './lib/utils';

interface BillingAppProps {
  user: any;
  apiClient: any;
}

const tabs = [
  { id: 'invoices', label: 'Invoices', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { id: 'payments', label: 'Payment History', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )},
  { id: 'settings', label: 'Settings', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
];

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
        },
        {
          id: '3',
          invoiceNumber: 'INV-003',
          amount: 2100.00,
          status: 'overdue',
          dueDate: '2024-01-15',
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
        },
        {
          id: '2',
          invoiceId: '2',
          amount: 850.00,
          method: 'bank_transfer',
          status: 'pending',
          transactionId: 'TXN-12346',
          createdAt: '2024-02-12'
        }
      ]);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your invoices, payments, and billing settings
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <span className={cn(
                    'mr-2 transition-colors duration-200',
                    activeTab === tab.id
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'invoices' && (
            <InvoiceList invoices={invoices} isLoading={isLoading} />
          )}
          {activeTab === 'payments' && (
            <PaymentHistory payments={payments} isLoading={isLoading} />
          )}
          {activeTab === 'settings' && (
            <BillingSettings user={user} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
