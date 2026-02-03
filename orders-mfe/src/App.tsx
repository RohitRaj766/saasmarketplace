import { useState, useEffect } from 'react';
import { OrderList } from './components/OrderList';
import { OrderDetail } from './components/OrderDetail';
import { CreateOrder } from './components/CreateOrder';
import { Order } from './types/order.types';
import { motion } from 'framer-motion';

interface OrdersAppProps {
  user: any;
  apiClient: any;
}

export default function OrdersApp({ apiClient }: OrdersAppProps) {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/orders');
      const data = response.data || response;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setView('detail');
  };

  const handleCreateOrder = async (orderData: any) => {
    try {
      await apiClient.post('/orders', orderData);
      await loadOrders(); // Reload orders from server
      setView('list');
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Orders Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {view === 'list' && `${orders.length} total orders`}
              {view === 'detail' && 'Order details'}
              {view === 'create' && 'Create a new order'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {view === 'list' && (
              <button
                onClick={() => setView('create')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Order
              </button>
            )}
            {view !== 'list' && (
              <button
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'list' && (
            <OrderList 
              orders={orders} 
              isLoading={isLoading}
              onViewOrder={handleViewOrder}
            />
          )}

          {view === 'detail' && selectedOrder && (
            <OrderDetail order={selectedOrder} />
          )}

          {view === 'create' && (
            <CreateOrder onSubmit={handleCreateOrder} onCancel={handleBack} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
