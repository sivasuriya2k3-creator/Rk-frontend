import express from 'express';
import upload from '../middleware/upload.js';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Upload single file
router.post('/', protect, admin, upload.single('file'), uploadFile);

// Delete file
router.delete('/:filename', protect, admin, deleteFile);

export default router;
