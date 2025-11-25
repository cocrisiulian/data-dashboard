/**
 * LABORATORUL 3 - PRISMA ORM
 * Configurație Prisma Client (Singleton Pattern)
 *
 * Fișier: labs_api/config/prisma.js
 */

const { PrismaClient } = require('@prisma/client')

// Singleton pattern pentru Prisma Client
// Previne crearea de multiple instanțe în development (hot reload)
const globalForPrisma = global

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']  // Logging detaliat în development
    : ['error'],                   // Doar erori în production
})

// Salvează instanța în global pentru reutilizare
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

module.exports = prisma

/**
 * EXPLICAȚIE:
 *
 * 1. Singleton Pattern:
 *    - Previne memory leaks în Next.js development
 *    - O singură instanță PrismaClient per aplicație
 *
 * 2. Logging:
 *    - Development: afișează toate query-urile SQL
 *    - Production: doar erori pentru performanță
 *
 * 3. Global Object:
 *    - Node.js persistă variabilele globale între hot reloads
 *    - Reutilizăm conexiunea existentă
 *
 * 4. Utilizare în controllere:
 *    ```javascript
 *    const prisma = require('./config/prisma')
 *    const users = await prisma.user.findMany()
 *    ```
 */
