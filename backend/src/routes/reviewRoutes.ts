import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/professional/:professionalId', ReviewController.getProfessionalReviews);
router.get('/product/:productId', ReviewController.getProductReviews);

// Routes protégées
router.post('/', authenticateToken, ReviewController.createReview);
router.put('/:id', authenticateToken, ReviewController.updateReview);
router.delete('/:id', authenticateToken, ReviewController.deleteReview);
router.post('/:id/helpful', authenticateToken, ReviewController.markHelpful);
router.post('/:id/response', authenticateToken, ReviewController.addResponse);

export default router;
