import express from 'express';
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  acceptApplication,
  rejectApplication,
  deleteApplication
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/apply', submitApplication);

// Admin routes
router.get('/', admin, getAllApplications);
router.get('/:id', admin, getApplicationById);
router.put('/:id/accept', admin, acceptApplication);
router.put('/:id/reject', admin, rejectApplication);
router.delete('/:id', admin, deleteApplication);

export default router;
