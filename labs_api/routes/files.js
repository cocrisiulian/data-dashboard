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

// GET /api/files - Get all files
router.get('/', fileController.getAllFiles);

// GET /api/files/:id/preview - Get file preview (MUST be before /:id)
router.get('/:id/preview', fileController.getFilePreview);

// GET /api/files/:id/content - Get file raw content (MUST be before /:id)
router.get('/:id/content', fileController.getFileContent);

// GET /api/files/:id/data - Get file parsed data (MUST be before /:id)
router.get('/:id/data', fileController.getFileData);

// GET /api/files/:id - Get single file
router.get('/:id', fileController.getFile);

// POST /api/files/upload - Upload file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// DELETE /api/files/:id - Delete file
router.delete('/:id', fileController.deleteFile);

module.exports = router;
