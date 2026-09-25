import express from 'express';
import { getQuiz, submitQuiz } from '../controllers/quizController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticateUser, getQuiz);
router.post('/:id/submit', authenticateUser, submitQuiz);

export default router;
