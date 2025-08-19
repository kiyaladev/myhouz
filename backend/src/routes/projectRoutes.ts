import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken, requireProfessional, optionalAuth } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', optionalAuth, ProjectController.getProjects);
router.get('/:id', optionalAuth, ProjectController.getProjectById);
router.get('/professional/:professionalId', ProjectController.getProfessionalProjects);

// Routes protégées - authentification requise
router.post('/:id/like', authenticateToken, ProjectController.toggleLike);

// Routes protégées - professionnels uniquement
router.post('/', authenticateToken, requireProfessional, ProjectController.createProject);
router.put('/:id', authenticateToken, requireProfessional, ProjectController.updateProject);
router.delete('/:id', authenticateToken, requireProfessional, ProjectController.deleteProject);

export default router;
