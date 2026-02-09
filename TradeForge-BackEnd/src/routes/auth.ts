import { Router } from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  getCurrentUser,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
