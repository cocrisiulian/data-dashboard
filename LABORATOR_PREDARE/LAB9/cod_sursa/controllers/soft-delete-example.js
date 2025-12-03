// Lab 9: Soft Delete Controller Implementation
// Example: Files Controller with Soft Delete

const prisma = require('../../config/prisma');

// =====================================================
// SOFT DELETE IMPLEMENTATION
// =====================================================

/**
 * Get all files (excluding soft deleted)
 * GET /api/files
 */
exports.getAllFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✨ SOFT DELETE FILTER: Only return non-deleted files
    const files = await prisma.file.findMany({
      where: {
        userId: userId,
        isDeleted: false  // 🔑 Filter out soft deleted files
      },
      orderBy: {
        uploadedAt: 'desc'
      },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        uploadedAt: true,
        isDeleted: true,
        deletedAt: true
      }
    });

    res.json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files'
    });
  }
};

/**
 * Get file by ID (excluding soft deleted)
 * GET /api/files/:id
 */
exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // ✨ SOFT DELETE FILTER: Check isDeleted flag
    const file = await prisma.file.findFirst({
      where: {
        id: id,
        userId: userId,
        isDeleted: false  // 🔑 Ensure file is not soft deleted
      },
      include: {
        charts: {
          where: {
            dashboard: {
              isDeleted: false  // 🔑 Also filter related entities
            }
          }
        }
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found or has been deleted'
      });
    }

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file'
    });
  }
};

/**
 * Soft delete a file
 * DELETE /api/files/:id
 */
exports.softDeleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership and that file is not already deleted
    const file = await prisma.file.findFirst({
      where: {
        id: id,
        userId: userId,
        isDeleted: false
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found or already deleted'
      });
    }

    // ✨ SOFT DELETE: Update isDeleted flag instead of actual deletion
    const deletedFile = await prisma.file.update({
      where: { id: id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'File soft deleted successfully',
      data: {
        id: deletedFile.id,
        fileName: deletedFile.fileName,
        deletedAt: deletedFile.deletedAt
      }
    });
  } catch (error) {
    console.error('Error soft deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
};

/**
 * Restore a soft deleted file
 * POST /api/files/:id/restore
 */
exports.restoreFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find soft deleted file
    const file = await prisma.file.findFirst({
      where: {
        id: id,
        userId: userId,
        isDeleted: true  // Only restore soft deleted files
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Deleted file not found'
      });
    }

    // ✨ RESTORE: Reset isDeleted flag
    const restoredFile = await prisma.file.update({
      where: { id: id },
      data: {
        isDeleted: false,
        deletedAt: null
      }
    });

    res.json({
      success: true,
      message: 'File restored successfully',
      data: {
        id: restoredFile.id,
        fileName: restoredFile.fileName,
        restoredAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error restoring file:', error);
    res.status(500).json({
      success: false,
      message: 'Error restoring file'
    });
  }
};

/**
 * Get soft deleted files (trash/recycle bin)
 * GET /api/files/trash
 */
exports.getSoftDeletedFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedFiles = await prisma.file.findMany({
      where: {
        userId: userId,
        isDeleted: true  // 🔑 Only soft deleted files
      },
      orderBy: {
        deletedAt: 'desc'
      },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        uploadedAt: true,
        deletedAt: true
      }
    });

    res.json({
      success: true,
      count: deletedFiles.length,
      data: deletedFiles
    });
  } catch (error) {
    console.error('Error fetching deleted files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deleted files'
    });
  }
};

/**
 * Permanent delete (hard delete) a soft deleted file
 * DELETE /api/files/:id/permanent
 */
exports.permanentDeleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Only allow permanent deletion of soft deleted files
    const file = await prisma.file.findFirst({
      where: {
        id: id,
        userId: userId,
        isDeleted: true  // Must be soft deleted first
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Soft deleted file not found'
      });
    }

    // ⚠️ HARD DELETE: Permanently remove from database
    await prisma.file.delete({
      where: { id: id }
    });

    res.json({
      success: true,
      message: 'File permanently deleted'
    });
  } catch (error) {
    console.error('Error permanently deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting file'
    });
  }
};

// =====================================================
// BATCH OPERATIONS
// =====================================================

/**
 * Bulk soft delete files
 * POST /api/files/bulk-delete
 */
exports.bulkSoftDelete = async (req, res) => {
  try {
    const { fileIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File IDs array is required'
      });
    }

    // Soft delete multiple files
    const result = await prisma.file.updateMany({
      where: {
        id: { in: fileIds },
        userId: userId,
        isDeleted: false
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: `${result.count} files soft deleted`,
      count: result.count
    });
  } catch (error) {
    console.error('Error bulk soft deleting files:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting files'
    });
  }
};

/**
 * Auto-cleanup: Permanently delete files soft deleted > 30 days ago
 * DELETE /api/files/cleanup
 */
exports.cleanupOldDeletedFiles = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find soft deleted files older than 30 days
    const oldDeletedFiles = await prisma.file.findMany({
      where: {
        isDeleted: true,
        deletedAt: {
          lt: thirtyDaysAgo
        }
      },
      select: { id: true }
    });

    // Permanently delete them
    const result = await prisma.file.deleteMany({
      where: {
        id: {
          in: oldDeletedFiles.map(f => f.id)
        }
      }
    });

    res.json({
      success: true,
      message: `Cleaned up ${result.count} old deleted files`,
      count: result.count
    });
  } catch (error) {
    console.error('Error cleaning up old files:', error);
    res.status(500).json({
      success: false,
      message: 'Error during cleanup'
    });
  }
};

module.exports = exports;
