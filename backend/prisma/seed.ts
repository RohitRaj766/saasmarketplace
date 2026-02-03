import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create demo organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      plan: 'professional',
      maxUsers: 50,
      isActive: true,
    },
  });

  console.log('✅ Created organization:', organization.name);

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      organizationId: organization.id,
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isOwner: true,
    },
  });

  console.log('✅ Created user:', user.email);

  // Delete ALL existing demo data (from all organizations)
  await prisma.invoice.deleteMany({});
  await prisma.order.deleteMany({});

  console.log('🗑️  Cleaned up all existing data');

  // Create demo orders
  const order1 = await prisma.order.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      orderNumber: 'ORD-001',
      status: 'completed',
      totalAmount: 1250.00,
      items: {
        items: [
          { name: 'Product A', quantity: 2, price: 625 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      orderNumber: 'ORD-002',
      status: 'pending',
      totalAmount: 850.00,
      items: {
        items: [
          { name: 'Product B', quantity: 1, price: 850 },
        ],
      },
    },
  });

  console.log('✅ Created orders:', order1.orderNumber, order2.orderNumber);

  // Create demo invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      orderId: order1.id,
      invoiceNumber: 'INV-001',
      amount: 1250.00,
      status: 'paid',
      dueDate: new Date('2024-02-15'),
      paidAt: new Date('2024-02-10'),
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      orderId: order2.id,
      invoiceNumber: 'INV-002',
      amount: 850.00,
      status: 'unpaid',
      dueDate: new Date('2024-03-01'),
    },
  });

  console.log('✅ Created invoices:', invoice1.invoiceNumber, invoice2.invoiceNumber);

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Demo credentials:');
  console.log('Email: admin@example.com');
  console.log('Password: password123');
}

seed()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
