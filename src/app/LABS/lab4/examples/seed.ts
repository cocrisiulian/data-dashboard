// Lab 4: Example seed script (TypeScript, Prisma-style)

// Ensure @prisma/client is installed by running: npm install @prisma/client
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.create({
    data: {
      id: 'plan-uuid',
      name: 'Free',
      max_files: 5,
      max_charts: 10,
      max_dashboards: 2,
      price: 0,
    },
  });

  await prisma.user.create({
    data: {
      id: 'user-uuid',
      email: 'user@example.com',
      full_name: 'Test User',
      plan_id: 'plan-uuid',
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
