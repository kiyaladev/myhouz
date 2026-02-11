import { Router } from 'express';
import { QuoteController } from '../controllers/QuoteController';
import { authenticateToken, requireProfessional } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, QuoteController.createQuote);
router.get('/my', authenticateToken, QuoteController.getMyQuotes);
router.get('/received', authenticateToken, requireProfessional, QuoteController.getReceivedQuotes);
router.put('/:id/respond', authenticateToken, requireProfessional, QuoteController.respondToQuote);

export default router;
