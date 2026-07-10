import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, logout, socialLoginHandler } from '../controllers/authController.js';
import {
  forgotPasswordHandler,
  resetPasswordHandler,
  requestVerificationHandler,
  verifyEmailHandler,
} from '../controllers/accountController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate, loginSchema, refreshTokenSchema, socialSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from '../middlewares/validation.js';

const router = Router();

router.post('/register', authLimiter, validate(loginSchema), registerHandler);
router.post('/login', authLimiter, validate(loginSchema), loginHandler);
router.post('/refresh', authLimiter, validate(refreshTokenSchema), refreshHandler);
router.post('/logout', requireAuth, logout);
router.post('/social', authLimiter, validate(socialSchema), socialLoginHandler);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPasswordHandler);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPasswordHandler);
router.post('/request-verification', requireAuth, requestVerificationHandler);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmailHandler);

export default router;