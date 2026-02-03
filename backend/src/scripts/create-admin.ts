import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create Admin User Script
 * 
 * Usage:
 * 1. Default: npm run create-admin
 *    Creates admin@example.com with password Admin@123
 * 
 * 2. Custom: Set environment variables and run
 *    ADMIN_EMAIL=admin@company.com ADMIN_PASSWORD=SecurePass123 npm run create-admin
 * 
 * 3. Update existing user to admin:
 *    The script will update an existing user's role to admin if the email matches
 */

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME || 'User';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists.`);
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        await prisma.user.update({
          where: { email },
          data: { role: 'admin' },
        });
        console.log(`✅ Updated user ${email} to admin role.`);
      } else {
        console.log(`✅ User ${email} is already an admin.`);
      }
      
      return;
    }

    // Create new admin user
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('⚠️  Please change the password after first login.');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
