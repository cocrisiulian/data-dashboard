const { PrismaClient } = require('@prisma/client')
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

  console.log('✨ Seeding completed!')
  await prisma.$disconnect()
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
