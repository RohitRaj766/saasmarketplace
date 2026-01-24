import express from 'express';
import cors from 'cors';
import { logger } from './common/middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './common/middleware/error.middleware';
import { AuthController } from './modules/auth/auth.controller';
import { OrdersController } from './modules/orders/orders.controller';
import { BillingController } from './modules/billing/billing.controller';
import { authenticate, authorize } from './modules/auth/auth.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Controllers
const authController = new AuthController();
const ordersController = new OrdersController();
const billingController = new BillingController();

// Auth routes
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.post('/auth/refresh', authController.refresh);
app.post('/auth/logout', authController.logout);

// Orders routes
app.get('/orders', authenticate, ordersController.getOrders);
app.get('/orders/:id', authenticate, ordersController.getOrderById);
app.post('/orders', authenticate, ordersController.createOrder);
app.patch('/orders/:id/status', authenticate, ordersController.updateOrderStatus);
app.delete('/orders/:id', authenticate, authorize('admin'), ordersController.deleteOrder);

// Billing routes
app.get('/billing/invoices', authenticate, billingController.getInvoices);
app.get('/billing/invoices/:id', authenticate, billingController.getInvoiceById);
app.post('/billing/invoices', authenticate, billingController.createInvoice);
app.post('/billing/invoices/:id/pay', authenticate, billingController.payInvoice);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
