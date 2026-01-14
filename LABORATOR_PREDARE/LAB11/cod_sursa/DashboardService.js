const dashboardRepository = require('./DashboardRepository');
const { differenceInDays } = require('date-fns');

/**
 * Dashboard Service - Business Logic Layer
 * Responsabilitate: Logică de business, validări, orchestrare
 * Pattern: Service Layer Pattern
 */
class DashboardService {
  /**
   * Șterge un dashboard (soft delete)
   * Business Rules:
   * - User-ul trebuie să fie owner
   * - Default: soft delete (recuperabil)
   */
  async deleteDashboard(id, userId) {
    // 1. Verifică dacă dashboard-ul există și aparține user-ului
    const dashboard = await dashboardRepository.findById(id);
    
    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    if (dashboard.userId !== userId) {
      throw new Error('Unauthorized - you do not own this dashboard');
    }

    if (dashboard.deletedAt) {
      throw new Error('Dashboard already deleted');
    }

    // 2. Soft delete
    await dashboardRepository.softDelete(id);

    // 3. Log activitatea (pentru audit)
    console.log(`[SOFT DELETE] User ${userId} deleted dashboard ${id}`);

    return {
      message: 'Dashboard moved to trash',
      restorable: true,
      expiresIn: '30 days'
    };
  }

  /**
   * Recuperează un dashboard din trash
   * Business Rules:
   * - Poate fi recuperat doar în 30 de zile
   * - User-ul trebuie să fie owner
   */
  async restoreDashboard(id, userId) {
    const dashboard = await dashboardRepository.findById(id);

    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    if (dashboard.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (!dashboard.deletedAt) {
      throw new Error('Dashboard is not deleted');
    }

    // Business Rule: Verifică dacă nu a expirat (30 zile)
    const daysSinceDeleted = differenceInDays(new Date(), dashboard.deletedAt);
    
    if (daysSinceDeleted > 30) {
      throw new Error('Dashboard expired - cannot restore after 30 days');
    }

    // Restore
    await dashboardRepository.restore(id);

    console.log(`[RESTORE] User ${userId} restored dashboard ${id}`);

    return {
      message: 'Dashboard restored successfully',
      dashboard
    };
  }

  /**
   * Șterge definitiv un dashboard (hard delete)
   * Business Rules:
   * - Trebuie să fie deja soft-deleted
   * - Irrecuperabil - cerere de confirmare
   */
  async permanentlyDelete(id, userId) {
    const dashboard = await dashboardRepository.findById(id);

    if (!dashboard) {
      throw new Error('Dashboard not found');
    }

    if (dashboard.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Business Rule: Trebuie să fie deja în trash
    if (!dashboard.deletedAt) {
      throw new Error('Dashboard must be soft-deleted first. Move to trash before permanent deletion.');
    }

    // Hard delete - DEFINITIV
    await dashboardRepository.hardDelete(id);

    console.log(`[HARD DELETE] User ${userId} permanently deleted dashboard ${id}`);

    return {
      message: 'Dashboard permanently deleted',
      warning: 'This action cannot be undone'
    };
  }

  /**
   * Obține toate dashboards active
   */
  async getActiveDashboards(userId) {
    return dashboardRepository.findActive(userId);
  }

  /**
   * Obține trash (dashboards șterse)
   */
  async getTrash(userId) {
    const deleted = await dashboardRepository.findDeleted(userId);

    // Adaugă info despre expirare
    return deleted.map(dashboard => {
      const daysSinceDeleted = differenceInDays(new Date(), dashboard.deletedAt);
      const daysRemaining = 30 - daysSinceDeleted;

      return {
        ...dashboard,
        daysRemaining,
        canRestore: daysRemaining > 0
      };
    });
  }

  /**
   * Curăță automat dashboards expirate (cron job)
   */
  async autoCleanup() {
    const deletedCount = await dashboardRepository.cleanupExpired();
    
    console.log(`[AUTO CLEANUP] Deleted ${deletedCount} expired dashboards`);
    
    return { deletedCount };
  }
}

module.exports = new DashboardService();
