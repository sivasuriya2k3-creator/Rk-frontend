import express from 'express';
import * as revenueController from '../controllers/revenueController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(adminOnly);

// Get revenue statistics
router.get('/stats', revenueController.getRevenueStats);

// Update today's revenue
router.post('/update-today', revenueController.updateTodayRevenue);

// Get revenue by date
router.get('/:date', revenueController.getRevenueByDate);

// Get revenue (with optional date range)
router.get('/', revenueController.getRevenue);

export default router;
