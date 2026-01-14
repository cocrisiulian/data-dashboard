const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { authenticate } = require('../middleware/auth');

// Configure multer for file upload with user-specific folders
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create user-specific upload directory
    const userUploadDir = path.join(__dirname, '..', 'uploads', req.user.id);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    
    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only CSV files
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/files/trash:
 *   get:
 *     summary: Get all soft deleted files (trash)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted files with days_remaining
 */
router.get('/trash', fileController.getTrash);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all active files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's files (excluding deleted)
 */
router.get('/', fileController.getAllFiles);

/**
 * @swagger
 * /api/files/{id}/preview:
 *   get:
 *     summary: Get file preview (first 5 rows)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File preview data
 */
router.get('/:id/preview', fileController.getFilePreview);

/**
 * @swagger
 * /api/files/{id}/content:
 *   get:
 *     summary: Get raw file content
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Raw CSV file content
 */
router.get('/:id/content', fileController.getFileContent);

/**
 * @swagger
 * /api/files/{id}/data:
 *   get:
 *     summary: Get parsed file data (all rows)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parsed CSV data as JSON
 */
router.get('/:id/data', fileController.getFileData);

/**
 * @swagger
 * /api/files/{id}/restore:
 *   post:
 *     summary: Restore soft deleted file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File restored successfully
 *       400:
 *         description: Cannot restore (plan limits or expired)
 *       404:
 *         description: File not found in trash
 */
router.post('/:id/restore', fileController.restoreFile);

/**
 * @swagger
 * /api/files/{id}/permanent:
 *   delete:
 *     summary: Permanently delete file (hard delete)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File permanently deleted
 *       404:
 *         description: File not found
 */
router.delete('/:id/permanent', fileController.permanentDeleteFile);

/**
 * @swagger
 * /api/files/{id}:
 *   get:
 *     summary: Get single file by ID
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File details
 *       404:
 *         description: File not found
 *   delete:
 *     summary: Soft delete file (moves to trash)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File moved to trash
 *       404:
 *         description: File not found
 */
router.get('/:id', fileController.getFile);

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload CSV file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file (max 10MB)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file or plan limit reached
 */
router.post('/upload', upload.single('file'), fileController.uploadFile);

// DELETE /api/files/:id - Soft delete file
router.delete('/:id', fileController.deleteFile);

module.exports = router;
