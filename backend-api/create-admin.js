const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin exists
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });

    if (admin) {
      console.log('✅ Admin user already exists');
      console.log('   Email:', admin.email);
      console.log('   Is Admin:', admin.is_admin);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Get first plan
    const firstPlan = await prisma.plan.findFirst();
    if (!firstPlan) {
      console.error('❌ No plans found in database. Please seed plans first.');
      return;
    }
    
    const newAdmin = await prisma.user.create({
      data: {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        planId: firstPlan.id,
        isAdmin: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('   Name:', newAdmin.fullName);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
