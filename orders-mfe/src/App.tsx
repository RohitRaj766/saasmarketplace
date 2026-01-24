import { useState, useEffect } from 'react';
import { OrderList } from './components/OrderList';
import { OrderDetail } from './components/OrderDetail';
import { CreateOrder } from './components/CreateOrder';
import { Order } from './types/order.types';
import './App.css';

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
      // Handle wrapped response from backend
      const data = response.data || response;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Mock data for demo
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          status: 'pending',
          totalAmount: 1250.00,
          items: [{ name: 'Product A', quantity: 2, price: 625 }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          status: 'completed',
          totalAmount: 850.00,
          items: [{ name: 'Product B', quantity: 1, price: 850 }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
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
      const response = await apiClient.post('/orders', orderData);
      const newOrder = response.data || response;
      setOrders([newOrder, ...orders]);
      setView('list');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedOrder(null);
  };

  return (
    <div className="orders-app">
      <div className="orders-header">
        <h1>Orders Management</h1>
        {view === 'list' && (
          <button onClick={() => setView('create')} className="btn-primary">
            Create Order
          </button>
        )}
        {view !== 'list' && (
          <button onClick={handleBack} className="btn-secondary">
            Back to List
          </button>
        )}
      </div>

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
    </div>
  );
}
