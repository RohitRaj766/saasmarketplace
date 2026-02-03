import { Invoice, OrderItem } from '../types/billing.types';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import './InvoiceDetail.css';

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: (invoice: Invoice) => void;
  onStatusChange?: (invoiceId: string, newStatus: string) => Promise<void>;
}

export function InvoiceDetail({ invoice, onClose, onDownload, onStatusChange }: InvoiceDetailProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!onStatusChange) return;
    
    setIsChangingStatus(true);
    try {
      await onStatusChange(invoice.id, newStatus);
      setShowStatusMenu(false);
    } catch (error: any) {
      console.error('Failed to change status:', error);
      // Error toast is handled in parent component
    } finally {
      setIsChangingStatus(false);
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 print-hide">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Invoice Details
          </h2>
          <div className="flex items-center gap-2">
            {onStatusChange && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={isChangingStatus}
                  className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className={`h-4 w-4 mr-2 ${isChangingStatus ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Change Status
                </button>
                
                {showStatusMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowStatusMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                      <div className="py-1">
                        {['unpaid', 'paid', 'overdue', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={invoice.status === status}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              invoice.status === status
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <span className="capitalize">{status}</span>
                            {invoice.status === status && (
                              <span className="ml-2 text-xs">(current)</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <button
              onClick={() => onDownload(invoice)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-8 invoice-print-content print:p-0">
          <div className="max-w-3xl mx-auto bg-white print:shadow-none">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-600">Invoice #{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-2">Your Company</div>
                <p className="text-sm text-gray-600">123 Business Street</p>
                <p className="text-sm text-gray-600">City, State 12345</p>
                <p className="text-sm text-gray-600">contact@company.com</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To:</h3>
                <p className="text-gray-900 font-medium">{order?.customerName || 'N/A'}</p>
                <p className="text-gray-600 text-sm">{order?.customerEmail}</p>
                {order?.customerPhone && (
                  <p className="text-gray-600 text-sm">{order?.customerPhone}</p>
                )}
                {order?.shippingAddress && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Invoice Date</p>
                  <p className="text-gray-900 font-medium">{formatDate(invoice.createdAt)}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-gray-900 font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="text-gray-900 font-medium">{order?.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-semibold text-gray-700">Item</th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Unit Price</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Discount</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Tax</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-gray-200">
                      <td className="py-4">
                        <div className="text-gray-900 font-medium">{item.productName}</div>
                        {item.sku && (
                          <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                        )}
                      </td>
                      <td className="text-center py-4 text-gray-700">{item.quantity}</td>
                      <td className="text-right py-4 text-gray-700">{formatCurrency(Number(item.unitPrice))}</td>
                      <td className="text-right py-4 text-gray-600">{item.discount ? `${item.discount}%` : '-'}</td>
                      <td className="text-right py-4 text-gray-600">{item.tax ? `${item.tax}%` : '-'}</td>
                      <td className="text-right py-4 text-gray-900 font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(Number(invoice.amount))}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(Number(invoice.amount))}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order?.notes && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
              <p>Thank you for your business!</p>
              <p className="mt-2">For questions about this invoice, please contact us at billing@company.com</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
