// Lab 9: Soft Delete Middleware
// Automatically filter out soft-deleted records in Prisma queries

const { PrismaClient } = require('@prisma/client');

/**
 * Prisma Middleware for Soft Delete
 * Automatically adds isDeleted: false filter to all queries
 */
function createSoftDeleteMiddleware() {
  return async (params, next) => {
    // Models that use soft delete
    const softDeleteModels = ['user', 'file', 'dashboard'];

    // Check if this operation is on a soft-delete model
    if (softDeleteModels.includes(params.model?.toLowerCase())) {
      
      // =====================================================
      // FIND OPERATIONS (findMany, findFirst, findUnique)
      // =====================================================
      if (params.action === 'findMany' || params.action === 'findFirst') {
        // Add isDeleted: false to where clause
        if (!params.args.where) {
          params.args.where = {};
        }
        
        // Only filter if isDeleted is not explicitly set
        if (params.args.where.isDeleted === undefined) {
          params.args.where.isDeleted = false;
        }
      }

      // =====================================================
      // COUNT OPERATION
      // =====================================================
      if (params.action === 'count') {
        if (!params.args.where) {
          params.args.where = {};
        }
        
        if (params.args.where.isDeleted === undefined) {
          params.args.where.isDeleted = false;
        }
      }

      // =====================================================
      // UPDATE OPERATIONS
      // =====================================================
      if (params.action === 'update' || params.action === 'updateMany') {
        // Ensure we only update non-deleted records
        if (!params.args.where) {
          params.args.where = {};
        }
        
        if (params.args.where.isDeleted === undefined) {
          params.args.where.isDeleted = false;
        }
      }

      // =====================================================
      // DELETE OPERATIONS → Convert to SOFT DELETE
      // =====================================================
      if (params.action === 'delete') {
        // Convert hard delete to soft delete
        params.action = 'update';
        params.args.data = {
          isDeleted: true,
          deletedAt: new Date()
        };
      }

      if (params.action === 'deleteMany') {
        // Convert hard delete to soft delete
        params.action = 'updateMany';
        params.args.data = {
          isDeleted: true,
          deletedAt: new Date()
        };
      }
    }

    // Continue with the query
    return next(params);
  };
}

/**
 * Setup Prisma Client with Soft Delete Middleware
 */
function setupPrismaWithSoftDelete() {
  const prisma = new PrismaClient();
  
  // Apply soft delete middleware
  prisma.$use(createSoftDeleteMiddleware());
  
  return prisma;
}

/**
 * Extended Prisma Client with Soft Delete Helpers
 */
function createExtendedPrismaClient() {
  const prisma = new PrismaClient();
  
  // Apply middleware
  prisma.$use(createSoftDeleteMiddleware());

  // =====================================================
  // Helper Methods for Soft Delete Operations
  // =====================================================

  /**
   * Soft delete a record
   */
  prisma.softDelete = async (model, where) => {
    return await prisma[model].update({
      where,
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });
  };

  /**
   * Restore a soft deleted record
   */
  prisma.restore = async (model, where) => {
    return await prisma[model].update({
      where,
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });
  };

  /**
   * Find soft deleted records
   */
  prisma.findDeleted = async (model, options = {}) => {
    return await prisma[model].findMany({
      ...options,
      where: {
        ...options.where,
        isDeleted: true
      }
    });
  };

  /**
   * Permanently delete a soft deleted record
   */
  prisma.forceDelete = async (model, where) => {
    // First check if record is soft deleted
    const record = await prisma[model].findFirst({
      where: {
        ...where,
        isDeleted: true
      }
    });

    if (!record) {
      throw new Error('Record not found or not soft deleted');
    }

    // Perform hard delete using raw query to bypass middleware
    return await prisma.$executeRawUnsafe(
      `DELETE FROM ${model}s WHERE id = '${record.id}'`
    );
  };

  /**
   * Include soft deleted records in query
   */
  prisma.withDeleted = (model) => {
    return {
      findMany: (args = {}) => {
        return prisma[model].findMany({
          ...args,
          where: {
            ...args.where,
            // Don't filter by isDeleted - include all records
          }
        });
      },
      findFirst: (args = {}) => {
        return prisma[model].findFirst({
          ...args,
          where: {
            ...args.where,
            // Don't filter by isDeleted
          }
        });
      }
    };
  };

  return prisma;
}

// =====================================================
// Usage Examples
// =====================================================

/*
// Example 1: Basic usage with middleware
const prisma = setupPrismaWithSoftDelete();

// This will automatically exclude soft-deleted users
const users = await prisma.user.findMany();

// This will soft delete the user (not hard delete)
await prisma.user.delete({ where: { id: userId } });


// Example 2: Extended client with helpers
const prisma = createExtendedPrismaClient();

// Soft delete a user
await prisma.softDelete('user', { id: userId });

// Restore a user
await prisma.restore('user', { id: userId });

// Find all soft deleted users
const deletedUsers = await prisma.findDeleted('user');

// Include soft deleted users in query
const allUsers = await prisma.withDeleted('user').findMany();

// Permanently delete a soft deleted user
await prisma.forceDelete('user', { id: userId });


// Example 3: Explicitly include deleted records
const allFiles = await prisma.file.findMany({
  where: {
    userId: userId,
    isDeleted: true  // Explicitly query deleted files
  }
});
*/

module.exports = {
  createSoftDeleteMiddleware,
  setupPrismaWithSoftDelete,
  createExtendedPrismaClient
};
