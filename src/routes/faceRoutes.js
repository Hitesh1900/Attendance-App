import express from 'express';
import { verifyFace } from '../controllers/faceController.js';

const router = express.Router();
router.post('/verify', verifyFace);
export default router;
