import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  addMilestone,
  addNote
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin access
router.use(protect);
router.use(admin);

// Stats route must come before :id route
router.get('/stats', getProjectStats);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.post('/:id/milestones', addMilestone);
router.post('/:id/notes', addNote);

export default router;
