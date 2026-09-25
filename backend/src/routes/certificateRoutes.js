import express from 'express';
import { getMyCertificates, getCertificateById, verifyCertificate } from '../controllers/certificateController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/verify/:certificateNumber', verifyCertificate);
router.get('/', authenticateUser, getMyCertificates);
router.get('/:id', authenticateUser, getCertificateById);

export default router;
