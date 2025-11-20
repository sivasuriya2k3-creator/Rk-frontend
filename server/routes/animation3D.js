import express from 'express';
import {
  getAllAnimations,
  getAnimationById,
  createAnimation,
  updateAnimation,
  deleteAnimation
} from '../controllers/animation3DController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllAnimations);
router.get('/:id', getAnimationById);
router.post('/', authenticateToken, isAdmin, createAnimation);
router.put('/:id', authenticateToken, isAdmin, updateAnimation);
router.delete('/:id', authenticateToken, isAdmin, deleteAnimation);

export default router;
