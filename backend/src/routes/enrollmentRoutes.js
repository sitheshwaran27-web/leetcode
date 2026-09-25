import express from 'express';
import { enrollInCourse, getMyCourses, getMyCourseDetails } from '../controllers/enrollmentController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-courses', authenticateUser, getMyCourses);
router.get('/my-courses/:id', authenticateUser, getMyCourseDetails);
router.post('/courses/:id/enroll', authenticateUser, enrollInCourse);

export default router;
