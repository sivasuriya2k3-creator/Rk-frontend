import express from 'express';
import {
  getAllPortfolio,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} from '../controllers/portfolioController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPortfolio);
router.get('/:id', getPortfolio);

// Protected routes
router.post('/', protect, authorize('admin'), createPortfolio);
router.put('/:id', protect, authorize('admin'), updatePortfolio);
router.delete('/:id', protect, authorize('admin'), deletePortfolio);

export default router;
