import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { executeCode, submitCode } from '../controllers/executeCode.controller.js';
const router = express.Router();

router.post('/', authMiddleware, executeCode);
router.post('/submitCode', authMiddleware, submitCode);

export default router;