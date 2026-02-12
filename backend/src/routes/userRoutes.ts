import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireProfessional } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Limite de débit pour les routes sensibles
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Trop de tentatives, veuillez réessayer plus tard' },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, message: 'Trop de requêtes, veuillez réessayer plus tard' },
});

// Routes publiques
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/forgot-password', passwordResetLimiter, UserController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, UserController.resetPassword);
router.post('/verify-email', UserController.verifyEmail);
router.post('/resend-verification', passwordResetLimiter, UserController.resendVerificationEmail);
router.post('/refresh-token', UserController.refreshToken);
router.get('/professionals/search', UserController.searchProfessionals);
router.get('/professionals/:id', UserController.getProfessionalProfile);

// Routes protégées
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);
router.post('/profile/avatar', uploadLimiter, authenticateToken, uploadSingle, UserController.uploadAvatar);
router.post('/logout', authenticateToken, UserController.logout);

export default router;
