import { useState } from 'react';
import { Order } from '../types/order.types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { Edit, RefreshCw } from 'lucide-react';

interface OrderDetailProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => Promise<void>;
}

const statusConfig = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  accepted: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  dispatched: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const statusFlow: Record<Order['status'], Order['status'][]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['dispatched', 'cancelled'],
  dispatched: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function OrderDetail({ order, onEdit, onStatusChange }: OrderDetailProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const canEdit = order.status !== 'dispatched' && order.status !== 'completed' && order.status !== 'cancelled';
  const canChangeStatus = statusFlow[order.status].length > 0;

  // Ensure items is always an array
  const orderItems = Array.isArray(order.items) ? order.items : [];

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!onStatusChange) return;
    
    setIsChangingStatus(true);
    try {
      await onStatusChange(order.id, newStatus);
      setShowStatusMenu(false);
    } catch (error: any) {
      console.error('Failed to change status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to change order status. Please try again.';
      alert(errorMessage);
    } finally {
      setIsChangingStatus(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Order Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.orderNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending}`}>
              <span className="capitalize">{order.status}</span>
            </span>
            
            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(order)}
                className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit Order
              </button>
            )}
            
            {canChangeStatus && onStatusChange && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  disabled={isChangingStatus}
                  className="inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isChangingStatus ? 'animate-spin' : ''}`} />
                  Change Status
                </button>
                
                {showStatusMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowStatusMenu(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                      <div className="py-1">
                        {statusFlow[order.status].map((status) => {
                          const statusLabels: Record<string, string> = {
                            pending: 'Mark as Pending',
                            accepted: 'Accept Order',
                            dispatched: 'Mark as Dispatched',
                            completed: 'Mark as Completed',
                            cancelled: 'Cancel Order',
                          };

                          const statusColors: Record<string, string> = {
                            pending: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
                            accepted: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                            dispatched: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
                            completed: 'hover:bg-green-50 dark:hover:bg-green-900/20',
                            cancelled: 'hover:bg-red-50 dark:hover:bg-red-900/20',
                          };

                          const label = statusLabels[status] || status;
                          const colorClass = statusColors[status] || 'hover:bg-gray-50 dark:hover:bg-gray-700';

                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(status)}
                              className={cn(
                                'w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 transition-colors cursor-pointer focus:outline-none',
                                colorClass
                              )}
                            >
                              <div className="font-medium">{label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                                Status: {status}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order Number
              </label>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {order.orderNumber}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </label>
              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {order.status}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Amount
              </label>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(Number(order.totalAmount))}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Items
              </label>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created At
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(order.createdAt, 'long')}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Updated
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(order.updatedAt, 'long')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Card */}
      {(order.customerName || order.customerEmail || order.customerPhone) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Information
              </h3>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {order.customerName && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.customerName}
                  </p>
                </div>
              )}

              {order.customerEmail && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <a href={`mailto:${order.customerEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {order.customerEmail}
                    </a>
                  </p>
                </div>
              )}

              {order.customerPhone && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <a href={`tel:${order.customerPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {order.customerPhone}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Address Card */}
      {order.shippingAddress && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shipping Address
              </h3>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Notes Card */}
      {order.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Notes
              </h3>
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {order.notes}
            </p>
          </div>
        </div>
      )}

      {/* Order Items Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Items
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'} in this order
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orderItems.map((item, index) => (
                <motion.tr
                  key={item.id || `item-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </div>
                        {item.sku && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {item.sku}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-semibold text-blue-800 dark:text-blue-300">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(Number(item.unitPrice))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.discount ? `${item.discount}%` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.tax ? `${item.tax}%` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Total:
                </td>
                <td className="px-6 py-4 text-right text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(Number(order.totalAmount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
