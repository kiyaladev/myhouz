import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireProfessional } from '../middleware/auth';

const router = Router();

// Routes publiques
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/professionals/search', UserController.searchProfessionals);
router.get('/professionals/:id', UserController.getProfessionalProfile);

// Routes protégées
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);

export default router;
