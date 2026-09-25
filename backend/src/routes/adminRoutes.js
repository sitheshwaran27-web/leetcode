import express from 'express';
import {
  getAdminStats,
  getAdminStudents,
  getAdminEnrollments,
  addLesson,
  updateLesson,
  deleteLesson,
  createOrUpdateQuiz
} from '../controllers/adminController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/students', getAdminStudents);
router.get('/enrollments', getAdminEnrollments);

// Lesson Management
router.post('/courses/:courseId/lessons', addLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

// Quiz Management
router.post('/courses/:courseId/quiz', createOrUpdateQuiz);

export default router;
