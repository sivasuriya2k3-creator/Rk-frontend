import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getCanceledOrders,
  getAllCanceledOrders,
  getAllOrdersAdmin
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.route('/')
  .get(getOrders)
  .post(createOrder);

// Canceled orders routes
router.get('/canceled', getCanceledOrders);
router.delete('/:id/cancel', cancelOrder);

router.route('/:id')
  .get(getOrder)
  .put(updateOrder)
  .delete(deleteOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrdersAdmin);
router.get('/admin/canceled', authorize('admin'), getAllCanceledOrders);
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

export default router;