/**
 * LABORATORUL 3 - PRISMA ORM
 * Exemple de utilizare Prisma Client în aplicație
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ===========================
// 1. EXEMPLU CREATE (INSERT)
// ===========================

async function exempluCreate() {
  // Creare utilizator nou cu plan Free
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed_password_here',
      fullName: 'Test User',
      planId: 'uuid-of-free-plan'
    }
  })

  console.log('User created:', user)
  return user
}

// ===========================
// 2. EXEMPLU READ (SELECT)
// ===========================

async function exempluFindMany() {
  // Găsește toți utilizatorii cu planul lor
  const users = await prisma.user.findMany({
    include: {
      plan: true,  // Include relația cu Plan
      files: true, // Include relația cu File[]
    }
  })
  
  console.log('Users with relations:', users)
  return users
}

async function exempluFindUnique() {
  // Găsește un singur utilizator după email
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
    include: {
      plan: true,
      dashboards: {
        include: {
          charts: true // Nested include
        }
      }
    }
  })
  
  console.log('User with nested relations:', user)
  return user
}

// ===========================
// 3. EXEMPLU UPDATE
// ===========================

async function exempluUpdate() {
  // Actualizează planul utilizatorului
  const updatedUser = await prisma.user.update({
    where: { email: 'test@example.com' },
    data: {
      planId: 'uuid-of-premium-plan'
    }
  })
  
  console.log('User updated:', updatedUser)
  return updatedUser
}

// ===========================
// 4. EXEMPLU DELETE
// ===========================

async function exempluDelete() {
  // Șterge un fișier (cascadează la charts datorită onDelete: Cascade)
  const deletedFile = await prisma.file.delete({
    where: { id: 'file-uuid-here' }
  })
  
  console.log('File deleted:', deletedFile)
  return deletedFile
}

// ===========================
// 5. EXEMPLU WHERE FILTERS
// ===========================

async function exempluWhere() {
  // Găsește dashboard-uri create în ultimele 7 zile
  const recentDashboards = await prisma.dashboard.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      userId: 'specific-user-id'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log('Recent dashboards:', recentDashboards)
  return recentDashboards
}

// ===========================
// 6. EXEMPLU TRANSACTIONS
// ===========================

async function exempluTransaction() {
  // Creare dashboard și chart în aceeași tranzacție
  const result = await prisma.$transaction(async (tx) => {
    // Creează dashboard
    const dashboard = await tx.dashboard.create({
      data: {
        userId: 'user-id',
        name: 'Sales Dashboard',
        description: 'Q4 sales analytics'
      }
    })
    
    // Creează chart asociat
    const chart = await tx.chart.create({
      data: {
        dashboardId: dashboard.id,
        fileId: 'file-id',
        chartType: 'bar',
        title: 'Monthly Revenue',
        chartConfig: {
          xAxis: 'month',
          yAxis: 'revenue'
        }
      }
    })
    
    return { dashboard, chart }
  })
  
  console.log('Transaction result:', result)
  return result
}

// ===========================
// 7. EXEMPLU RELATIONS
// ===========================

async function exempluRelations() {
  // Găsește plan cu toți utilizatorii săi
  const plan = await prisma.plan.findUnique({
    where: { name: 'Premium' },
    include: {
      users: {
        select: {
          email: true,
          fullName: true,
          createdAt: true
        }
      }
    }
  })
  
  console.log('Plan with users:', plan)
  console.log('Total users on Premium:', plan.users.length)
  return plan
}

// ===========================
// 8. EXEMPLU AGGREGATIONS
// ===========================

async function exempluAggregations() {
  // Numără fișiere per utilizator
  const fileCount = await prisma.file.groupBy({
    by: ['userId'],
    _count: {
      id: true
    },
    _sum: {
      fileSize: true
    }
  })
  
  console.log('File statistics:', fileCount)
  return fileCount
}

// ===========================
// 9. EXEMPLU RAW QUERIES
// ===========================

async function exempluRawQuery() {
  // Query raw pentru cazuri complexe
  const result = await prisma.$queryRaw`
    SELECT u.email, COUNT(f.id) as file_count
    FROM users u
    LEFT JOIN files f ON f.user_id = u.id
    GROUP BY u.email
    HAVING COUNT(f.id) > 0
  `
  
  console.log('Raw query result:', result)
  return result
}

// ===========================
// 10. EXEMPLU DIN APLICAȚIE
// ===========================

// Extras din authController.js (linia 34-47)
async function registerUserWithPlan() {
  // Găsește planul Free
  const freePlan = await prisma.plan.findUnique({ 
    where: { name: 'Free' } 
  })
  
  // Creează utilizator cu plan
  const user = await prisma.user.create({
    data: {
      email: 'newuser@example.com',
      password: 'hashed_password',
      fullName: 'New User',
      planId: freePlan.id
    },
    include: {
      plan: true
    }
  })
  
  // Log acțiune
  await prisma.usageLog.create({
    data: {
      userId: user.id,
      action: 'user_registered',
      details: { email: user.email }
    }
  })
  
  return user
}

// Export toate exemplele
module.exports = {
  exempluCreate,
  exempluFindMany,
  exempluFindUnique,
  exempluUpdate,
  exempluDelete,
  exempluWhere,
  exempluTransaction,
  exempluRelations,
  exempluAggregations,
  exempluRawQuery,
  registerUserWithPlan
}
