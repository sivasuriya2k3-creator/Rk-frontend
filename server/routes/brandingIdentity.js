import express from 'express';
import {
  getAllBrandingItems,
  getBrandingItem,
  createBrandingItem,
  updateBrandingItem,
  deleteBrandingItem,
  likeBrandingItem,
  unlikeBrandingItem,
  addAdditionalMedia
} from '../controllers/brandingIdentityController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllBrandingItems)
  .post(protect, admin, createBrandingItem);

router.route('/:id')
  .get(getBrandingItem)
  .put(protect, admin, updateBrandingItem)
  .delete(protect, admin, deleteBrandingItem);

router.route('/:id/like')
  .post(protect, likeBrandingItem)
  .delete(protect, unlikeBrandingItem);

router.route('/:id/media')
  .post(protect, admin, addAdditionalMedia);

export default router;
