const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database...')

  // Create plans
  const plans = [
    {
      name: 'Free',
      maxFiles: 2,
      maxCharts: 3,
      maxDashboards: 1,
      price: 0
    },
    {
      name: 'Pro',
      maxFiles: 20,
      maxCharts: 50,
      maxDashboards: 10,
      price: 9.99
    },
    {
      name: 'Custom',
      maxFiles: -1, // unlimited
      maxCharts: -1,
      maxDashboards: -1,
      price: 49.99
    },
    {
      name: 'Admin',
      maxFiles: -1, // unlimited
      maxCharts: -1, // unlimited
      maxDashboards: -1, // unlimited
      price: 0
    }
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    })
    console.log(`✅ Plan created: ${plan.name}`)
  }

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@datainsight.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const adminPlan = await prisma.plan.findUnique({ where: { name: 'Admin' } })

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { 
      isAdmin: true,
      password: hashedPassword,
      planId: adminPlan?.id
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Admin User',
      isAdmin: true,
      planId: adminPlan?.id
    }
  })
  console.log(`✅ Admin user created: ${adminEmail}`)

  console.log('✨ Seeding completed!')
  await prisma.$disconnect()
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
