import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTenants() {
  console.log('🌱 Seeding multi-tenant data...');

  // Create Tenant 1: Acme Corp
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      domain: 'acme.example.com',
      settings: {
        companyName: 'Acme Corporation',
        timezone: 'America/New_York',
        currency: 'USD'
      },
      theme: {
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        logo: '/logos/acme.png'
      },
      features: {
        orders_module: true,
        billing_module: true,
        analytics: true,
        api_access: true
      },
      isActive: true
    }
  });

  console.log('✅ Created tenant:', tenant1.name);

  // Create Tenant 2: TechStart Inc
  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'techstart' },
    update: {},
    create: {
      name: 'TechStart Inc',
      slug: 'techstart',
      domain: 'techstart.example.com',
      settings: {
        companyName: 'TechStart Inc',
        timezone: 'America/Los_Angeles',
        currency: 'USD'
      },
      theme: {
        primaryColor: '#4caf50',
        secondaryColor: '#ff9800',
        logo: '/logos/techstart.png'
      },
      features: {
        orders_module: true,
        billing_module: false, // Billing disabled for this tenant
        analytics: false,
        api_access: true
      },
      isActive: true
    }
  });

  console.log('✅ Created tenant:', tenant2.name);

  // Create users for Tenant 1
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      email: 'admin@acme.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      tenantId: tenant1.id
    }
  });

  console.log('✅ Created user:', user1.email, 'for', tenant1.name);

  const user2 = await prisma.user.upsert({
    where: { email: 'manager@acme.com' },
    update: {},
    create: {
      email: 'manager@acme.com',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'manager',
      tenantId: tenant1.id
    }
  });

  console.log('✅ Created user:', user2.email, 'for', tenant1.name);

  // Create users for Tenant 2
  const user3 = await prisma.user.upsert({
    where: { email: 'admin@techstart.com' },
    update: {},
    create: {
      email: 'admin@techstart.com',
      passwordHash,
      firstName: 'Bob',
      lastName: 'Johnson',
      role: 'admin',
      tenantId: tenant2.id
    }
  });

  console.log('✅ Created user:', user3.email, 'for', tenant2.name);

  // Create orders for Tenant 1
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      tenantId: tenant1.id,
      orderNumber: 'ACME-001',
      status: 'completed',
      totalAmount: 2500.00,
      items: [
        { name: 'Enterprise License', quantity: 5, price: 500 }
      ]
    }
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      tenantId: tenant1.id,
      orderNumber: 'ACME-002',
      status: 'pending',
      totalAmount: 1200.00,
      items: [
        { name: 'Support Package', quantity: 2, price: 600 }
      ]
    }
  });

  console.log('✅ Created orders for', tenant1.name);

  // Create orders for Tenant 2
  const order3 = await prisma.order.create({
    data: {
      userId: user3.id,
      tenantId: tenant2.id,
      orderNumber: 'TECH-001',
      status: 'completed',
      totalAmount: 999.00,
      items: [
        { name: 'Startup Plan', quantity: 1, price: 999 }
      ]
    }
  });

  console.log('✅ Created orders for', tenant2.name);

  // Create invoices for Tenant 1
  await prisma.invoice.create({
    data: {
      userId: user1.id,
      tenantId: tenant1.id,
      orderId: order1.id,
      invoiceNumber: 'INV-ACME-001',
      amount: 2500.00,
      status: 'paid',
      dueDate: new Date('2024-02-15'),
      paidAt: new Date('2024-02-10')
    }
  });

  await prisma.invoice.create({
    data: {
      userId: user2.id,
      tenantId: tenant1.id,
      orderId: order2.id,
      invoiceNumber: 'INV-ACME-002',
      amount: 1200.00,
      status: 'unpaid',
      dueDate: new Date('2024-03-01')
    }
  });

  console.log('✅ Created invoices for', tenant1.name);

  // Create invoices for Tenant 2
  await prisma.invoice.create({
    data: {
      userId: user3.id,
      tenantId: tenant2.id,
      orderId: order3.id,
      invoiceNumber: 'INV-TECH-001',
      amount: 999.00,
      status: 'paid',
      dueDate: new Date('2024-02-20'),
      paidAt: new Date('2024-02-18')
    }
  });

  console.log('✅ Created invoices for', tenant2.name);

  console.log('\n🎉 Multi-tenant seeding completed!');
  console.log('\n📝 Tenant 1 - Acme Corp:');
  console.log('   Email: admin@acme.com / password123');
  console.log('   Email: manager@acme.com / password123');
  console.log('   Features: All enabled');
  console.log('\n📝 Tenant 2 - TechStart:');
  console.log('   Email: admin@techstart.com / password123');
  console.log('   Features: Billing disabled');
}

seedTenants()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
