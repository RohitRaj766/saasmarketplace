import bcrypt from 'bcryptjs';
import prisma from '../../config/database';
import { AppError } from '../../common/middleware/error.middleware';

export class AdminService {
  async getTeamMembers(organizationId: string) {
    const users = await prisma.user.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isOwner: true,
        department: true,
        jobTitle: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async createUser(organizationId: string, adminEmail: string, data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: string;
    department?: string;
    jobTitle?: string;
  }) {
    // Extract domain from admin email
    const adminDomain = adminEmail.split('@')[1];
    const userDomain = data.email.split('@')[1];

    // Validate that user email is from the same domain
    if (adminDomain !== userDomain) {
      throw new AppError(`User email must be from the same domain (@${adminDomain})`, 400);
    }

    // Check organization user limit
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    if (organization._count.users >= organization.maxUsers) {
      throw new AppError(`User limit reached. Your plan allows ${organization.maxUsers} users. Please upgrade your plan.`, 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Validate role
    const validRoles = ['admin', 'support'];
    if (!validRoles.includes(data.role)) {
      throw new AppError('Invalid role. Must be admin or support', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          organizationId,
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          isOwner: false,
          department: data.department,
          jobTitle: data.jobTitle,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isOwner: true,
          department: true,
          jobTitle: true,
          createdAt: true,
        },
      });

      return user;
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new AppError('User with this email already exists', 400);
      }
      throw error;
    }
  }

  async updateUserRole(userId: string, role: string, organizationId: string) {
    // Validate role
    const validRoles = ['admin', 'support'];
    if (!validRoles.includes(role)) {
      throw new AppError('Invalid role. Must be admin or support', 400);
    }

    // Check if user exists and belongs to organization
    const user = await prisma.user.findFirst({
      where: { 
        id: userId,
        organizationId,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent changing owner role
    if (user.isOwner) {
      throw new AppError('Cannot change the role of the organization owner', 400);
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isOwner: true,
        department: true,
        jobTitle: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(userId: string, currentUserId: string, organizationId: string) {
    // Prevent self-deletion
    if (userId === currentUserId) {
      throw new AppError('You cannot delete your own account', 400);
    }

    // Check if user exists and belongs to organization
    const user = await prisma.user.findFirst({
      where: { 
        id: userId,
        organizationId,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent deleting owner
    if (user.isOwner) {
      throw new AppError('Cannot delete the organization owner', 400);
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });
  }

  async getActivityLogs(organizationId: string, limit: number = 50) {
    // Get recent orders and invoices as activity logs for this organization
    const [recentOrders, recentInvoices] = await Promise.all([
      prisma.order.findMany({
        where: { organizationId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.invoice.findMany({
        where: { organizationId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    // Combine and format activities
    const activities = [
      ...recentOrders.map((order) => ({
        id: order.id,
        type: 'order',
        action: `Order ${order.orderNumber} created`,
        user: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        timestamp: order.createdAt,
        status: order.status,
      })),
      ...recentInvoices.map((invoice) => ({
        id: invoice.id,
        type: 'invoice',
        action: `Invoice ${invoice.invoiceNumber} ${invoice.status}`,
        user: `${invoice.user.firstName} ${invoice.user.lastName}`,
        email: invoice.user.email,
        timestamp: invoice.createdAt,
        status: invoice.status,
      })),
    ];

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}
