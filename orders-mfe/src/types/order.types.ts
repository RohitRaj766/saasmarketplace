export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  tenantId?: string; // Phase 2
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  items: OrderItem[];
  totalAmount: number;
}
