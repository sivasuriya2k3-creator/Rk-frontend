import express from 'express';
import {
  getAllUIUXProjects,
  getUIUXProjectById,
  createUIUXProject,
  updateUIUXProject,
  deleteUIUXProject
} from '../controllers/uiuxProjectController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllUIUXProjects);
router.get('/:id', getUIUXProjectById);
router.post('/', authenticateToken, isAdmin, createUIUXProject);
router.put('/:id', authenticateToken, isAdmin, updateUIUXProject);
router.delete('/:id', authenticateToken, isAdmin, deleteUIUXProject);

export default router;
