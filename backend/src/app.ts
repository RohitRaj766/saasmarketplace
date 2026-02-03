import express from 'express';
import cors from 'cors';
import { logger } from './common/middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './common/middleware/error.middleware';
import { AuthController } from './modules/auth/auth.controller';
import { OrdersController } from './modules/orders/orders.controller';
import { BillingController } from './modules/billing/billing.controller';
import { TenantsController } from './modules/tenants/tenants.controller';
import { DashboardController } from './modules/dashboard/dashboard.controller';
import { AdminController } from './modules/admin/admin.controller';
import { authenticate, authorize } from './modules/auth/auth.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Controllers
const authController = new AuthController();
const ordersController = new OrdersController();
const billingController = new BillingController();
const tenantsController = new TenantsController();
const dashboardController = new DashboardController();
const adminController = new AdminController();

// Auth routes
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.post('/auth/refresh', authController.refresh);
app.post('/auth/logout', authController.logout);

// Tenant routes
app.get('/tenants', tenantsController.getAllTenants);
app.get('/tenants/:slug', tenantsController.getTenantBySlug);

// Dashboard routes
app.get('/dashboard/metrics', authenticate, dashboardController.getMetrics);
app.get('/dashboard/activity', authenticate, dashboardController.getRecentActivity);

// Orders routes
app.get('/orders', authenticate, ordersController.getOrders);
app.get('/orders/:id', authenticate, ordersController.getOrderById);
app.post('/orders', authenticate, ordersController.createOrder);
app.put('/orders/:id', authenticate, ordersController.updateOrder);
app.patch('/orders/:id/status', authenticate, ordersController.updateOrderStatus);
app.delete('/orders/:id', authenticate, authorize('admin'), ordersController.deleteOrder);

// Billing routes
app.get('/billing/invoices', authenticate, billingController.getInvoices);
app.get('/billing/invoices/:id', authenticate, billingController.getInvoiceById);
app.post('/billing/invoices', authenticate, billingController.createInvoice);
app.post('/billing/invoices/:id/pay', authenticate, billingController.payInvoice);
app.patch('/billing/invoices/:id/status', authenticate, billingController.updateInvoiceStatus);

// Admin routes (only for admin role)
app.get('/admin/team', authenticate, authorize('admin'), adminController.getTeamMembers);
app.post('/admin/team', authenticate, authorize('admin'), adminController.createUser);
app.patch('/admin/team/:userId/role', authenticate, authorize('admin'), adminController.updateUserRole);
app.delete('/admin/team/:userId', authenticate, authorize('admin'), adminController.deleteUser);
app.get('/admin/activity-logs', authenticate, authorize('admin'), adminController.getActivityLogs);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
