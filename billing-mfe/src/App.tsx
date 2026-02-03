import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { InvoiceList } from './components/InvoiceList';
import { AcceptedOrders } from './components/AcceptedOrders';
import { InvoiceDetail } from './components/InvoiceDetail';
import { Invoice, Order, OrderItem } from './types/billing.types';
import { motion } from 'framer-motion';
import { cn } from './lib/utils';
import toast from 'react-hot-toast';
import './toast-styles.css';

interface BillingAppProps {
  user: any;
  apiClient: any;
}

const tabs = [
  { id: 'orders', label: 'Accepted Orders', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )},
  { id: 'invoices', label: 'Invoices', icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
];

export default function BillingApp(_props: BillingAppProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

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
        }
      } catch (apiError) {
        console.log('API not available, using empty data');
        setInvoices([]);
      }
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInvoice = async (order: Order) => {
    try {
      // Calculate due date (30 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const invoiceData = {
        orderId: order.id,
        amount: order.totalAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'unpaid'
      };

      const response = await fetch('http://localhost:4000/billing/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        const newInvoice = await response.json();
        setInvoices(prev => [newInvoice.data || newInvoice, ...prev]);
        setActiveTab('invoices');
        toast.success('Invoice generated successfully!');
      } else {
        throw new Error('Failed to generate invoice');
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to generate invoice. Please try again.');
    }
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      // Fetch full invoice details with order data
      const response = await fetch(`http://localhost:4000/billing/invoices/${invoice.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const fullInvoice = await response.json();
        setSelectedInvoice(fullInvoice.data || fullInvoice);
      } else {
        setSelectedInvoice(invoice);
      }
    } catch (error) {
      console.error('Failed to load invoice details:', error);
      setSelectedInvoice(invoice);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    try {
      // Create a simple HTML invoice for download
      const invoiceHTML = generateInvoiceHTML(invoice);
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:4000/billing/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedInvoice = await response.json();
        const invoiceData = updatedInvoice.data || updatedInvoice;
        
        // Update the invoice in the list
        setInvoices(prev => prev.map(inv => 
          inv.id === invoiceId ? invoiceData : inv
        ));
        
        // Update the selected invoice if it's open
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(invoiceData);
        }
        
        toast.success(`Invoice status updated to ${newStatus}!`);
      } else {
        throw new Error('Failed to update invoice status');
      }
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      toast.error('Failed to update invoice status. Please try again.');
      throw error;
    }
  };

  const generateInvoiceHTML = (invoice: Invoice) => {
    const order = invoice.order;
    // Handle items - could be JSON string or array
    let items: OrderItem[] = [];
    if (order?.items) {
      if (typeof order.items === 'string') {
        try {
          items = JSON.parse(order.items);
        } catch (e) {
          console.error('Failed to parse order items:', e);
          items = [];
        }
      } else if (Array.isArray(order.items)) {
        items = order.items;
      }
    }
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .company { text-align: right; }
    .invoice-title { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #d1d5db; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .total-row { font-weight: bold; font-size: 18px; background: #f9fafb; }
    .footer { text-align: center; color: #6b7280; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <p>Invoice #${invoice.invoiceNumber}</p>
    </div>
    <div class="company">
      <h2>Your Company</h2>
      <p>123 Business Street<br>City, State 12345<br>contact@company.com</p>
    </div>
  </div>
  
  <div class="info-grid">
    <div>
      <h3>Bill To:</h3>
      <p><strong>${order?.customerName || 'N/A'}</strong><br>
      ${order?.customerEmail || ''}<br>
      ${order?.customerPhone || ''}</p>
      ${order?.shippingAddress ? `
      <p>${order.shippingAddress.street}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
      ${order.shippingAddress.country}</p>
      ` : ''}
    </div>
    <div style="text-align: right;">
      <p><strong>Invoice Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
      <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
      <p><strong>Order Number:</strong> ${order?.orderNumber || 'N/A'}</p>
      <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Discount</th>
        <th style="text-align: right;">Tax</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
      <tr>
        <td>${item.productName}${item.sku ? `<br><small>SKU: ${item.sku}</small>` : ''}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">$${Number(item.unitPrice).toFixed(2)}</td>
        <td style="text-align: right;">${item.discount ? `${item.discount}%` : '-'}</td>
        <td style="text-align: right;">${item.tax ? `${item.tax}%` : '-'}</td>
        <td style="text-align: right;">$${item.total.toFixed(2)}</td>
      </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="5" style="text-align: right;">TOTAL:</td>
        <td style="text-align: right;">$${Number(invoice.amount).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
  
  ${order?.notes ? `
  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 40px;">
    <h3>Notes:</h3>
    <p>${order.notes}</p>
  </div>
  ` : ''}
  
  <div class="footer">
    <p>Thank you for your business!</p>
    <p>For questions about this invoice, please contact us at billing@company.com</p>
  </div>
</body>
</html>
    `.trim();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'dark:bg-gray-800 dark:text-white',
          style: {
            background: 'var(--toast-bg, #fff)',
            color: 'var(--toast-color, #363636)',
            border: '1px solid var(--toast-border, #e5e7eb)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
          {activeTab === 'orders' && (
            <AcceptedOrders onGenerateInvoice={handleGenerateInvoice} invoices={invoices} />
          )}
          {activeTab === 'invoices' && (
            <InvoiceList 
              invoices={invoices} 
              isLoading={isLoading}
              onViewInvoice={handleViewInvoice}
              onDownloadInvoice={handleDownloadInvoice}
            />
          )}
        </motion.div>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            onDownload={handleDownloadInvoice}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
