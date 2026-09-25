import express from 'express';
import {
  getCourses,
  getCategories,
  getCourseBySlugOrId,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', getCourses);
router.get('/:identifier', getCourseBySlugOrId);

// Admin course routes
router.post('/', authenticateUser, requireAdmin, createCourse);
router.put('/:id', authenticateUser, requireAdmin, updateCourse);
router.delete('/:id', authenticateUser, requireAdmin, deleteCourse);

export default router;
