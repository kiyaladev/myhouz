import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireProfessional } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { generateTokens } from '../config/passport';
import { IUser } from '../models/User';

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

// Routes OAuth Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=google_failed` }),
  (req, res) => {
    const user = req.user as unknown as IUser;
    const { token, refreshToken } = generateTokens(user._id as string, user.userType);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}&refreshToken=${encodeURIComponent(refreshToken)}`);
  }
);

// Routes OAuth Facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=facebook_failed` }),
  (req, res) => {
    const user = req.user as unknown as IUser;
    const { token, refreshToken } = generateTokens(user._id as string, user.userType);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}&refreshToken=${encodeURIComponent(refreshToken)}`);
  }
);

// Routes protégées
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);
router.post('/profile/avatar', uploadLimiter, authenticateToken, uploadSingle, UserController.uploadAvatar);
router.post('/logout', authenticateToken, UserController.logout);

export default router;
