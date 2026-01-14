const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Dashboard Repository - Data Access Layer
 * Responsabilitate: Interacțiune directă cu baza de date
 * Pattern: Repository Pattern
 */
class DashboardRepository {
  /**
   * Găsește toate dashboards active (ne-șterse)
   */
  async findActive(userId) {
    return prisma.dashboard.findMany({
      where: {
        userId,
        deletedAt: null // 🔑 Excludem cele soft-deleted
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Găsește toate dashboards șterse (Trash)
   */
  async findDeleted(userId) {
    return prisma.dashboard.findMany({
      where: {
        userId,
        deletedAt: { not: null } // 🔑 Doar cele soft-deleted
      },
      orderBy: { deletedAt: 'desc' }
    });
  }

  /**
   * Găsește un dashboard specific (inclusiv șters)
   */
  async findById(id) {
    return prisma.dashboard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        charts: true
      }
    });
  }

  /**
   * Soft Delete - Marchează ca șters
   * Nu elimină din bază de date
   */
  async softDelete(id) {
    return prisma.dashboard.update({
      where: { id },
      data: {
        deletedAt: new Date() // 🔑 Setează timestamp de ștergere
      }
    });
  }

  /**
   * Restore - Recuperează din trash
   * Setează deletedAt la null
   */
  async restore(id) {
    return prisma.dashboard.update({
      where: { id },
      data: {
        deletedAt: null // 🔑 Elimină timestamp-ul
      }
    });
  }

  /**
   * Hard Delete - Șterge definitiv din bază de date
   * ATENȚIE: Irrecuperabil!
   */
  async hardDelete(id) {
    return prisma.dashboard.delete({
      where: { id }
    });
  }

  /**
   * Curăță dashboards expirate (> 30 zile în trash)
   * Pentru GDPR compliance
   */
  async cleanupExpired() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.dashboard.deleteMany({
      where: {
        deletedAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    return result.count;
  }
}

module.exports = new DashboardRepository();
