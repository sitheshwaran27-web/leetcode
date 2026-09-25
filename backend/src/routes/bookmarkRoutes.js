import express from 'express';
import { toggleBookmark, getMyBookmarks } from '../controllers/bookmarkController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateUser, getMyBookmarks);
router.post('/courses/:id/bookmark', authenticateUser, toggleBookmark);
router.delete('/courses/:id/bookmark', authenticateUser, toggleBookmark);

export default router;
