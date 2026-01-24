export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId?: string;
  orderId?: string;
  tenantId?: string; // Phase 2
  amount: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
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
