export interface OrderItem {
  id?: string;
  productName: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  tenantId?: string;
  status: 'pending' | 'accepted' | 'dispatched' | 'completed' | 'cancelled';
  totalAmount: number;
  items: OrderItem[] | string; // Can be array or JSON string from DB
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId?: string;
  orderId?: string;
  tenantId?: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: string;
}
