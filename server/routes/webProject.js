import express from 'express';
import {
  getAllWebProjects,
  getWebProjectById,
  createWebProject,
  updateWebProject,
  deleteWebProject
} from '../controllers/webProjectController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllWebProjects);
router.get('/:id', getWebProjectById);
router.post('/', authenticateToken, isAdmin, createWebProject);
router.put('/:id', authenticateToken, isAdmin, updateWebProject);
router.delete('/:id', authenticateToken, isAdmin, deleteWebProject);

export default router;
