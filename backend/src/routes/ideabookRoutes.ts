import { Router } from 'express';
import { IdeabookController } from '../controllers/IdeabookController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/public', IdeabookController.getPublicIdeabooks);
router.get('/:id/public', IdeabookController.getPublicIdeabook);

// Routes protégées
router.get('/', authenticateToken, IdeabookController.getUserIdeabooks);
router.post('/', authenticateToken, IdeabookController.createIdeabook);
router.get('/:id', authenticateToken, IdeabookController.getIdeabook);
router.put('/:id', authenticateToken, IdeabookController.updateIdeabook);
router.delete('/:id', authenticateToken, IdeabookController.deleteIdeabook);

// Gestion des items dans les ideabooks
router.post('/:id/items', authenticateToken, IdeabookController.addItem);
router.delete('/:id/items/:itemId', authenticateToken, IdeabookController.removeItem);

// Gestion des collaborateurs
router.post('/:id/collaborators', authenticateToken, IdeabookController.inviteCollaborator);
router.put('/:id/collaborators/:userId', authenticateToken, IdeabookController.updateCollaboratorPermission);
router.delete('/:id/collaborators/:userId', authenticateToken, IdeabookController.removeCollaborator);

// Actions publiques
router.post('/:id/like', authenticateToken, IdeabookController.toggleLike);

export default router;
