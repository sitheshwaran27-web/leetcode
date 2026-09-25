import express from 'express';
import { completeLesson, getCourseProgress } from '../controllers/progressController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/lessons/:id/complete', authenticateUser, completeLesson);
router.get('/courses/:id/progress', authenticateUser, getCourseProgress);

export default router;
