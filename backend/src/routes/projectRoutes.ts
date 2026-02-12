import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken, requireProfessional, optionalAuth } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', optionalAuth, ProjectController.getProjects);
router.get('/professional/:professionalId', ProjectController.getProfessionalProjects);
router.get('/:id/images/:imageIndex/products', ProjectController.getImageProducts);
router.get('/:id', optionalAuth, ProjectController.getProjectById);

// Routes protégées - authentification requise
router.post('/:id/like', authenticateToken, ProjectController.toggleLike);

// Routes protégées - professionnels uniquement
router.post('/', authenticateToken, requireProfessional, ProjectController.createProject);
router.put('/:id', authenticateToken, requireProfessional, ProjectController.updateProject);
router.delete('/:id', authenticateToken, requireProfessional, ProjectController.deleteProject);
router.post('/:id/images/:imageIndex/products', authenticateToken, requireProfessional, ProjectController.tagProductOnImage);
router.delete('/:id/images/:imageIndex/products/:productId', authenticateToken, requireProfessional, ProjectController.removeProductTag);

export default router;
