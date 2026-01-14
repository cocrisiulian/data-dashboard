const prisma = require('../config/prisma');
const path = require('path');
const fs = require('fs').promises;

// Get all files for authenticated user (excluding soft deleted)
exports.getAllFiles = async (req, res, next) => {
  try {
    const files = await prisma.file.findMany({
      where: { 
        userId: req.user.id,
        deletedAt: null  // 🔑 Exclude soft deleted files
      },
      orderBy: { uploadedAt: 'desc' }
    });

    // Transform to snake_case for frontend compatibility
    const transformedFiles = files.map(file => ({
      id: file.id,
      user_id: file.userId,
      file_name: file.fileName,
      file_path: file.filePath,
      file_size: file.fileSize,
      file_type: file.fileType,
      uploaded_at: file.uploadedAt
    }));

    res.json(transformedFiles);
  } catch (error) {
    next(error);
  }
};

// Get single file
exports.getFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: null  // 🔑 Exclude soft deleted files
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Transform to snake_case for frontend
    const transformedFile = {
      id: file.id,
      user_id: file.userId,
      file_name: file.fileName,
      file_path: file.filePath,
      file_size: file.fileSize,
      file_type: file.fileType,
      uploaded_at: file.uploadedAt
    };

    res.json(transformedFile);
  } catch (error) {
    next(error);
  }
};

// Upload file
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        plan: true, 
        files: {
          where: { deletedAt: null }  // 🔑 Only count non-deleted files
        }
      }
    });

    if (user.plan.max_files !== -1 && user.files.length >= user.plan.max_files) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      return res.status(403).json({
        message: `File limit reached. Your ${user.plan.name} plan allows ${user.plan.max_files} files.`
      });
    }

    // Create file record
    // Store only the filename, not the full path
    const filename = path.basename(req.file.path);
    
    const file = await prisma.file.create({
      data: {
        userId: req.user.id,
        fileName: req.file.originalname,
        filePath: filename,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'FILE_UPLOADED',
        entity: 'File',
        entityId: file.id,
        metadata: {
          fileName: file.fileName,
          fileSize: file.fileSize,
          fileType: file.fileType
        },
        level: 'INFO'
      }
    }).catch(err => console.error('Failed to log activity:', err));

    // Transform to snake_case for frontend
    const transformedFile = {
      id: file.id,
      user_id: file.userId,
      file_name: file.fileName,
      file_path: file.filePath,
      file_size: file.fileSize,
      file_type: file.fileType,
      uploaded_at: file.uploadedAt
    };

    res.status(201).json(transformedFile);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// Soft delete file (mark as deleted)
exports.deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: null  // 🔑 Only soft delete non-deleted files
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found or already deleted' });
    }

    // ✨ SOFT DELETE: Update deletedAt instead of actual deletion
    await prisma.file.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'FILE_SOFT_DELETED',
        entity: 'File',
        entityId: id,
        metadata: {
          fileName: file.fileName
        },
        level: 'INFO'
      }
    }).catch(err => console.error('Failed to log activity:', err));

    res.json({ 
      message: 'File moved to trash successfully',
      deletedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Restore soft deleted file
exports.restoreFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: { not: null }  // 🔑 Only restore soft deleted files
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'Deleted file not found' });
    }

    // Check plan limits before restore
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        plan: true, 
        files: {
          where: { deletedAt: null }
        }
      }
    });

    if (user.plan.max_files !== -1 && user.files.length >= user.plan.max_files) {
      return res.status(403).json({
        message: `File limit reached. Your ${user.plan.name} plan allows ${user.plan.max_files} files.`
      });
    }

    // ✨ RESTORE: Reset deletedAt
    const restoredFile = await prisma.file.update({
      where: { id },
      data: { deletedAt: null }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'FILE_RESTORED',
        entity: 'File',
        entityId: id,
        metadata: {
          fileName: file.fileName
        },
        level: 'INFO'
      }
    }).catch(err => console.error('Failed to log activity:', err));

    res.json({ 
      message: 'File restored successfully',
      file: {
        id: restoredFile.id,
        file_name: restoredFile.fileName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get trash (soft deleted files)
exports.getTrash = async (req, res, next) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        deletedAt: { not: null }  // 🔑 Only soft deleted files
      },
      orderBy: { deletedAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        uploadedAt: true,
        deletedAt: true
      }
    });

    // Add days remaining calculation (30 day retention)
    const filesWithMeta = files.map(file => {
      const daysSinceDeleted = Math.floor(
        (new Date() - new Date(file.deletedAt)) / (1000 * 60 * 60 * 24)
      );
      const daysRemaining = Math.max(0, 30 - daysSinceDeleted);

      return {
        id: file.id,
        file_name: file.fileName,
        file_size: file.fileSize,
        file_type: file.fileType,
        uploaded_at: file.uploadedAt,
        deleted_at: file.deletedAt,
        days_remaining: daysRemaining,
        can_restore: daysRemaining > 0
      };
    });

    res.json(filesWithMeta);
  } catch (error) {
    next(error);
  }
};

// Permanent delete (hard delete)
exports.permanentDeleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: { not: null }  // 🔑 Must be soft deleted first
      }
    });

    if (!file) {
      return res.status(404).json({ 
        message: 'Deleted file not found. File must be soft deleted before permanent deletion.' 
      });
    }

    // Delete file from filesystem (user-specific folder)
    try {
      const fullPath = path.join(__dirname, '..', 'uploads', file.userId, file.filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Error deleting file from filesystem:', error);
    }

    // ❌ HARD DELETE: Permanent removal from database
    await prisma.file.delete({
      where: { id }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'FILE_PERMANENTLY_DELETED',
        entity: 'File',
        entityId: id,
        metadata: {
          fileName: file.fileName
        },
        level: 'WARN'
      }
    }).catch(err => console.error('Failed to log activity:', err));

    res.json({ message: 'File permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// Get file preview (first 20 rows for CSV)
exports.getFilePreview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: null  // 🔑 Exclude soft deleted files
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read file content from user-specific folder
    const fullPath = path.join(__dirname, '..', 'uploads', file.userId, file.filePath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return res.json({
        file,
        headers: [],
        rows: [],
        totalRows: 0
      });
    }

    // Parse CSV (simple parsing)
    const headers = lines[0].split(',').map(h => h.trim());
    const dataLines = lines.slice(1, 21); // First 20 rows
    const rows = dataLines.map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    res.json({
      file: {
        id: file.id,
        user_id: file.userId,
        file_name: file.fileName,
        file_path: file.filePath,
        file_size: file.fileSize,
        file_type: file.fileType,
        uploaded_at: file.uploadedAt
      },
      headers,
      rows,
      totalRows: lines.length - 1
    });
  } catch (error) {
    next(error);
  }
};

// Get file content (serves the raw CSV file)
exports.getFileContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: null  // 🔑 Exclude soft deleted files
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read and send file content from user-specific folder
    const fullPath = path.join(__dirname, '..', 'uploads', file.userId, file.filePath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
    res.send(fileContent);
  } catch (error) {
    next(error);
  }
};

// Get file data as parsed JSON (for charts)
exports.getFileData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        userId: req.user.id,
        deletedAt: null  // 🔑 Exclude soft deleted files
      }
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read file content from user-specific folder
    const fullPath = path.join(__dirname, '..', 'uploads', file.userId, file.filePath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return res.json({
        headers: [],
        rows: []
      });
    }

    // Parse CSV
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return row;
    });

    res.json({
      headers,
      rows
    });
  } catch (error) {
    next(error);
  }
};
