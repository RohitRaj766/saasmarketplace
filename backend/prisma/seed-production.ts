import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProduction() {
  console.log('🌱 Seeding production SaaS data for OptiFlow...\n');

  const passwordHash = await bcrypt.hash('password123', 10);

  // ============================================
  // TENANT 1: ATLASSIAN
  // ============================================
  console.log('📦 Creating Atlassian tenant...');
  
  const atlassian = await prisma.tenant.upsert({
    where: { slug: 'atlassian' },
    update: {},
    create: {
      name: 'Atlassian',
      slug: 'atlassian',
      domain: 'atlassian.optiflow.com',
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionStartsAt: new Date('2024-01-01'),
      subscriptionEndsAt: new Date('2025-01-01'),
      billingEmail: 'billing@atlassian.com',
      industry: 'Software',
      companySize: '5000+',
      timezone: 'Australia/Sydney',
      currency: 'USD',
      settings: {
        companyName: 'Atlassian',
        website: 'https://www.atlassian.com',
        address: '341 George St, Sydney NSW 2000, Australia'
      },
      theme: {
        primaryColor: '#0052CC',
        secondaryColor: '#172B4D',
        logo: '/logos/atlassian.png'
      },
      isActive: true
    }
  });

  console.log('✅ Created tenant: Atlassian\n');

  // Atlassian Features
  console.log('🔧 Adding features for Atlassian...');
  
  await prisma.tenantFeature.createMany({
    data: [
      {
        tenantId: atlassian.id,
        featureKey: 'orders',
        isEnabled: true,
        monthlyPrice: 49.00,
        usageLimit: 2000,
        usageCurrent: 156,
        config: { exportFormats: ['csv', 'pdf', 'excel'] }
      },
      {
        tenantId: atlassian.id,
        featureKey: 'billing',
        isEnabled: true,
        monthlyPrice: 39.00,
        usageLimit: 1000,
        usageCurrent: 89,
        config: { paymentGateways: ['stripe', 'paypal'] }
      },
      {
        tenantId: atlassian.id,
        featureKey: 'analytics',
        isEnabled: true,
        monthlyPrice: 29.00,
        config: { dashboards: ['revenue', 'orders', 'team'] }
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Added 3 features for Atlassian\n');

  // Atlassian Users (10 employees)
  console.log('👥 Creating 10 users for Atlassian...');
  
  const atlassianUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'mike.cannon@atlassian.com' },
      update: {},
      create: {
        email: 'mike.cannon@atlassian.com',
        passwordHash,
        firstName: 'Mike',
        lastName: 'Cannon-Brookes',
        role: 'admin',
        tenantId: atlassian.id,
        department: 'Executive',
        jobTitle: 'Co-CEO'
      }
    }),
    prisma.user.upsert({
      where: { email: 'scott.farquhar@atlassian.com' },
      update: {},
      create: {
        email: 'scott.farquhar@atlassian.com',
        passwordHash,
        firstName: 'Scott',
        lastName: 'Farquhar',
        role: 'admin',
        tenantId: atlassian.id,
        department: 'Executive',
        jobTitle: 'Co-CEO'
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.chen@atlassian.com' },
      update: {},
      create: {
        email: 'sarah.chen@atlassian.com',
        passwordHash,
        firstName: 'Sarah',
        lastName: 'Chen',
        role: 'manager',
        tenantId: atlassian.id,
        department: 'Sales',
        jobTitle: 'Sales Manager'
      }
    }),
    prisma.user.upsert({
      where: { email: 'david.kim@atlassian.com' },
      update: {},
      create: {
        email: 'david.kim@atlassian.com',
        passwordHash,
        firstName: 'David',
        lastName: 'Kim',
        role: 'manager',
        tenantId: atlassian.id,
        department: 'Finance',
        jobTitle: 'Finance Manager'
      }
    }),
    prisma.user.upsert({
      where: { email: 'emma.wilson@atlassian.com' },
      update: {},
      create: {
        email: 'emma.wilson@atlassian.com',
        passwordHash,
        firstName: 'Emma',
        lastName: 'Wilson',
        role: 'user',
        tenantId: atlassian.id,
        department: 'Sales',
        jobTitle: 'Sales Representative'
      }
    }),
    prisma.user.upsert({
      where: { email: 'james.brown@atlassian.com' },
      update: {},
      create: {
        email: 'james.brown@atlassian.com',
        passwordHash,
        firstName: 'James',
        lastName: 'Brown',
        role: 'user',
        tenantId: atlassian.id,
        department: 'Sales',
        jobTitle: 'Sales Representative'
      }
    }),
    prisma.user.upsert({
      where: { email: 'lisa.anderson@atlassian.com' },
      update: {},
      create: {
        email: 'lisa.anderson@atlassian.com',
        passwordHash,
        firstName: 'Lisa',
        lastName: 'Anderson',
        role: 'user',
        tenantId: atlassian.id,
        department: 'Finance',
        jobTitle: 'Accountant'
      }
    }),
    prisma.user.upsert({
      where: { email: 'robert.taylor@atlassian.com' },
      update: {},
      create: {
        email: 'robert.taylor@atlassian.com',
        passwordHash,
        firstName: 'Robert',
        lastName: 'Taylor',
        role: 'user',
        tenantId: atlassian.id,
        department: 'Finance',
        jobTitle: 'Financial Analyst'
      }
    }),
    prisma.user.upsert({
      where: { email: 'maria.garcia@atlassian.com' },
      update: {},
      create: {
        email: 'maria.garcia@atlassian.com',
        passwordHash,
        firstName: 'Maria',
        lastName: 'Garcia',
        role: 'user',
        tenantId: atlassian.id,
        department: 'Operations',
        jobTitle: 'Operations Specialist'
      }
    }),
    prisma.user.upsert({
      where: { email: 'john.martinez@atlassian.com' },
      update: {},
      create: {
        email: 'john.martinez@atlassian.com',
        passwordHash,
        firstName: 'John',
        lastName: 'Martinez',
        role: 'user',
        tenantId: atlassian.id,
        department: 'Operations',
        jobTitle: 'Operations Coordinator'
      }
    })
  ]);

  console.log('✅ Created 10 users for Atlassian\n');

  // ============================================
  // TENANT 2: ZOHO
  // ============================================
  console.log('📦 Creating Zoho tenant...');
  
  const zoho = await prisma.tenant.upsert({
    where: { slug: 'zoho' },
    update: {},
    create: {
      name: 'Zoho Corporation',
      slug: 'zoho',
      domain: 'zoho.optiflow.com',
      subscriptionTier: 'starter',
      subscriptionStatus: 'active',
      subscriptionStartsAt: new Date('2024-02-01'),
      subscriptionEndsAt: new Date('2025-02-01'),
      billingEmail: 'billing@zoho.com',
      industry: 'Software',
      companySize: '10000+',
      timezone: 'Asia/Kolkata',
      currency: 'USD',
      settings: {
        companyName: 'Zoho Corporation',
        website: 'https://www.zoho.com',
        address: 'Estancia IT Park, Chennai, Tamil Nadu, India'
      },
      theme: {
        primaryColor: '#E42527',
        secondaryColor: '#1A1A1A',
        logo: '/logos/zoho.png'
      },
      isActive: true
    }
  });

  console.log('✅ Created tenant: Zoho Corporation\n');

  // Zoho Features
  console.log('🔧 Adding features for Zoho...');
  
  await prisma.tenantFeature.createMany({
    data: [
      {
        tenantId: zoho.id,
        featureKey: 'orders',
        isEnabled: true,
        monthlyPrice: 49.00,
        usageLimit: 500,
        usageCurrent: 234,
        config: { exportFormats: ['csv', 'pdf'] }
      },
      {
        tenantId: zoho.id,
        featureKey: 'admin',
        isEnabled: true,
        monthlyPrice: 19.00,
        config: { maxUsers: 25 }
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Added 2 features for Zoho\n');

  // Zoho Users (10 employees)
  console.log('👥 Creating 10 users for Zoho...');
  
  const zohoUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sridhar.vembu@zoho.com' },
      update: {},
      create: {
        email: 'sridhar.vembu@zoho.com',
        passwordHash,
        firstName: 'Sridhar',
        lastName: 'Vembu',
        role: 'admin',
        tenantId: zoho.id,
        department: 'Executive',
        jobTitle: 'CEO'
      }
    }),
    prisma.user.upsert({
      where: { email: 'raju.vegesna@zoho.com' },
      update: {},
      create: {
        email: 'raju.vegesna@zoho.com',
        passwordHash,
        firstName: 'Raju',
        lastName: 'Vegesna',
        role: 'admin',
        tenantId: zoho.id,
        department: 'Product',
        jobTitle: 'Chief Evangelist'
      }
    }),
    prisma.user.upsert({
      where: { email: 'priya.sharma@zoho.com' },
      update: {},
      create: {
        email: 'priya.sharma@zoho.com',
        passwordHash,
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'manager',
        tenantId: zoho.id,
        department: 'Sales',
        jobTitle: 'Sales Director'
      }
    }),
    prisma.user.upsert({
      where: { email: 'amit.patel@zoho.com' },
      update: {},
      create: {
        email: 'amit.patel@zoho.com',
        passwordHash,
        firstName: 'Amit',
        lastName: 'Patel',
        role: 'manager',
        tenantId: zoho.id,
        department: 'Operations',
        jobTitle: 'Operations Manager'
      }
    }),
    prisma.user.upsert({
      where: { email: 'neha.reddy@zoho.com' },
      update: {},
      create: {
        email: 'neha.reddy@zoho.com',
        passwordHash,
        firstName: 'Neha',
        lastName: 'Reddy',
        role: 'user',
        tenantId: zoho.id,
        department: 'Sales',
        jobTitle: 'Account Executive'
      }
    }),
    prisma.user.upsert({
      where: { email: 'vikram.singh@zoho.com' },
      update: {},
      create: {
        email: 'vikram.singh@zoho.com',
        passwordHash,
        firstName: 'Vikram',
        lastName: 'Singh',
        role: 'user',
        tenantId: zoho.id,
        department: 'Sales',
        jobTitle: 'Sales Representative'
      }
    }),
    prisma.user.upsert({
      where: { email: 'anjali.kumar@zoho.com' },
      update: {},
      create: {
        email: 'anjali.kumar@zoho.com',
        passwordHash,
        firstName: 'Anjali',
        lastName: 'Kumar',
        role: 'user',
        tenantId: zoho.id,
        department: 'Operations',
        jobTitle: 'Operations Specialist'
      }
    }),
    prisma.user.upsert({
      where: { email: 'rahul.mehta@zoho.com' },
      update: {},
      create: {
        email: 'rahul.mehta@zoho.com',
        passwordHash,
        firstName: 'Rahul',
        lastName: 'Mehta',
        role: 'user',
        tenantId: zoho.id,
        department: 'Operations',
        jobTitle: 'Operations Coordinator'
      }
    }),
    prisma.user.upsert({
      where: { email: 'kavya.nair@zoho.com' },
      update: {},
      create: {
        email: 'kavya.nair@zoho.com',
        passwordHash,
        firstName: 'Kavya',
        lastName: 'Nair',
        role: 'user',
        tenantId: zoho.id,
        department: 'Customer Success',
        jobTitle: 'Customer Success Manager'
      }
    }),
    prisma.user.upsert({
      where: { email: 'arjun.desai@zoho.com' },
      update: {},
      create: {
        email: 'arjun.desai@zoho.com',
        passwordHash,
        firstName: 'Arjun',
        lastName: 'Desai',
        role: 'user',
        tenantId: zoho.id,
        department: 'Customer Success',
        jobTitle: 'Support Specialist'
      }
    })
  ]);

  console.log('✅ Created 10 users for Zoho\n');

  // ============================================
  // SAMPLE ORDERS - ATLASSIAN
  // ============================================
  console.log('📦 Creating sample orders for Atlassian...');
  
  const atlassianOrders = await Promise.all([
    prisma.order.create({
      data: {
        userId: atlassianUsers[2].id,
        tenantId: atlassian.id,
        orderNumber: 'ATL-2024-001',
        status: 'completed',
        totalAmount: 15750.00,
        items: [
          { sku: 'JIRA-ENT-100', name: 'Jira Enterprise License', quantity: 100, price: 150, total: 15000 },
          { sku: 'SUPPORT-PREM', name: 'Premium Support', quantity: 1, price: 750, total: 750 }
        ]
      }
    }),
    prisma.order.create({
      data: {
        userId: atlassianUsers[4].id,
        tenantId: atlassian.id,
        orderNumber: 'ATL-2024-002',
        status: 'completed',
        totalAmount: 8500.00,
        items: [
          { sku: 'CONF-ENT-50', name: 'Confluence Enterprise', quantity: 50, price: 170, total: 8500 }
        ]
      }
    }),
    prisma.order.create({
      data: {
        userId: atlassianUsers[5].id,
        tenantId: atlassian.id,
        orderNumber: 'ATL-2024-003',
        status: 'pending',
        totalAmount: 12000.00,
        items: [
          { sku: 'BITBUCKET-ENT', name: 'Bitbucket Enterprise', quantity: 75, price: 160, total: 12000 }
        ]
      }
    })
  ]);

  console.log('✅ Created 3 orders for Atlassian\n');

  // ============================================
  // SAMPLE INVOICES - ATLASSIAN
  // ============================================
  console.log('💰 Creating sample invoices for Atlassian...');
  
  await Promise.all([
    prisma.invoice.create({
      data: {
        userId: atlassianUsers[2].id,
        tenantId: atlassian.id,
        orderId: atlassianOrders[0].id,
        invoiceNumber: 'INV-ATL-2024-001',
        amount: 15750.00,
        status: 'paid',
        dueDate: new Date('2024-02-15'),
        paidAt: new Date('2024-02-10')
      }
    }),
    prisma.invoice.create({
      data: {
        userId: atlassianUsers[4].id,
        tenantId: atlassian.id,
        orderId: atlassianOrders[1].id,
        invoiceNumber: 'INV-ATL-2024-002',
        amount: 8500.00,
        status: 'paid',
        dueDate: new Date('2024-03-01'),
        paidAt: new Date('2024-02-28')
      }
    }),
    prisma.invoice.create({
      data: {
        userId: atlassianUsers[5].id,
        tenantId: atlassian.id,
        orderId: atlassianOrders[2].id,
        invoiceNumber: 'INV-ATL-2024-003',
        amount: 12000.00,
        status: 'unpaid',
        dueDate: new Date('2024-04-15')
      }
    })
  ]);

  console.log('✅ Created 3 invoices for Atlassian\n');

  // ============================================
  // SAMPLE ORDERS - ZOHO
  // ============================================
  console.log('📦 Creating sample orders for Zoho...');
  
  const zohoOrders = await Promise.all([
    prisma.order.create({
      data: {
        userId: zohoUsers[2].id,
        tenantId: zoho.id,
        orderNumber: 'ZHO-2024-001',
        status: 'completed',
        totalAmount: 9500.00,
        items: [
          { sku: 'ZOHO-CRM-PRO', name: 'Zoho CRM Professional', quantity: 50, price: 190, total: 9500 }
        ]
      }
    }),
    prisma.order.create({
      data: {
        userId: zohoUsers[4].id,
        tenantId: zoho.id,
        orderNumber: 'ZHO-2024-002',
        status: 'completed',
        totalAmount: 6750.00,
        items: [
          { sku: 'ZOHO-DESK-ENT', name: 'Zoho Desk Enterprise', quantity: 25, price: 270, total: 6750 }
        ]
      }
    }),
    prisma.order.create({
      data: {
        userId: zohoUsers[5].id,
        tenantId: zoho.id,
        orderNumber: 'ZHO-2024-003',
        status: 'processing',
        totalAmount: 4200.00,
        items: [
          { sku: 'ZOHO-BOOKS', name: 'Zoho Books Premium', quantity: 30, price: 140, total: 4200 }
        ]
      }
    })
  ]);

  console.log('✅ Created 3 orders for Zoho\n');

  // ============================================
  // SAMPLE INVOICES - ZOHO
  // ============================================
  console.log('💰 Creating sample invoices for Zoho...');
  
  await Promise.all([
    prisma.invoice.create({
      data: {
        userId: zohoUsers[2].id,
        tenantId: zoho.id,
        orderId: zohoOrders[0].id,
        invoiceNumber: 'INV-ZHO-2024-001',
        amount: 9500.00,
        status: 'paid',
        dueDate: new Date('2024-03-01'),
        paidAt: new Date('2024-02-25')
      }
    }),
    prisma.invoice.create({
      data: {
        userId: zohoUsers[4].id,
        tenantId: zoho.id,
        orderId: zohoOrders[1].id,
        invoiceNumber: 'INV-ZHO-2024-002',
        amount: 6750.00,
        status: 'paid',
        dueDate: new Date('2024-03-15'),
        paidAt: new Date('2024-03-10')
      }
    }),
    prisma.invoice.create({
      data: {
        userId: zohoUsers[5].id,
        tenantId: zoho.id,
        orderId: zohoOrders[2].id,
        invoiceNumber: 'INV-ZHO-2024-003',
        amount: 4200.00,
        status: 'unpaid',
        dueDate: new Date('2024-04-01')
      }
    })
  ]);

  console.log('✅ Created 3 invoices for Zoho\n');

  // ============================================
  // AUDIT LOGS
  // ============================================
  console.log('📝 Creating sample audit logs...');
  
  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: atlassian.id,
        userId: atlassianUsers[0].id,
        action: 'user.created',
        entityType: 'user',
        entityId: atlassianUsers[4].id,
        newValues: { email: 'emma.wilson@atlassian.com', role: 'user' },
        ipAddress: '203.0.113.42',
        userAgent: 'Mozilla/5.0'
      },
      {
        tenantId: atlassian.id,
        userId: atlassianUsers[2].id,
        action: 'order.created',
        entityType: 'order',
        entityId: atlassianOrders[0].id,
        newValues: { orderNumber: 'ATL-2024-001', totalAmount: 15750 },
        ipAddress: '203.0.113.43'
      },
      {
        tenantId: zoho.id,
        userId: zohoUsers[0].id,
        action: 'feature.subscribed',
        entityType: 'tenant_feature',
        newValues: { featureKey: 'orders', monthlyPrice: 49 },
        ipAddress: '198.51.100.10'
      }
    ]
  });

  console.log('✅ Created audit logs\n');

  // ============================================
  // USAGE METRICS
  // ============================================
  console.log('📊 Creating usage metrics...');
  
  await prisma.usageMetric.createMany({
    data: [
      {
        tenantId: atlassian.id,
        metricType: 'orders_created',
        metricValue: 156,
        featureKey: 'orders',
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31')
      },
      {
        tenantId: atlassian.id,
        metricType: 'invoices_generated',
        metricValue: 89,
        featureKey: 'billing',
        periodStart: new Date('2024-01-01'),
        periodEnd: new Date('2024-01-31')
      },
      {
        tenantId: zoho.id,
        metricType: 'orders_created',
        metricValue: 234,
        featureKey: 'orders',
        periodStart: new Date('2024-02-01'),
        periodEnd: new Date('2024-02-29')
      }
    ]
  });

  console.log('✅ Created usage metrics\n');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎉 Production SaaS seeding completed successfully!\n');
  console.log('📊 SUMMARY:');
  console.log('   • 2 Tenants (Atlassian, Zoho)');
  console.log('   • 20 Users (10 per tenant)');
  console.log('   • 5 Feature subscriptions');
  console.log('   • 6 Orders');
  console.log('   • 6 Invoices');
  console.log('   • 3 Audit logs');
  console.log('   • 3 Usage metrics\n');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('🔐 LOGIN CREDENTIALS:\n');
  console.log('ATLASSIAN (Professional Tier):');
  console.log('   Features: Orders + Billing + Analytics');
  console.log('   Admin: mike.cannon@atlassian.com / password123');
  console.log('   Admin: scott.farquhar@atlassian.com / password123');
  console.log('   Manager: sarah.chen@atlassian.com / password123');
  console.log('   User: emma.wilson@atlassian.com / password123\n');
  console.log('ZOHO (Starter Tier):');
  console.log('   Features: Orders + Admin');
  console.log('   Admin: sridhar.vembu@zoho.com / password123');
  console.log('   Admin: raju.vegesna@zoho.com / password123');
  console.log('   Manager: priya.sharma@zoho.com / password123');
  console.log('   User: neha.reddy@zoho.com / password123\n');
  console.log('═══════════════════════════════════════════════════════');
}

seedProduction()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
