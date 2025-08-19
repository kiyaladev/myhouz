import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken, requireProfessional, optionalAuth } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', optionalAuth, ProductController.getProducts);
router.get('/:identifier', optionalAuth, ProductController.getProduct);
router.get('/:id/similar', ProductController.getSimilarProducts);
router.get('/seller/:sellerId', ProductController.getSellerProducts);

// Routes protégées - professionnels uniquement
router.post('/', authenticateToken, requireProfessional, ProductController.createProduct);
router.put('/:id', authenticateToken, requireProfessional, ProductController.updateProduct);
router.delete('/:id', authenticateToken, requireProfessional, ProductController.deleteProduct);
router.patch('/:id/stock', authenticateToken, requireProfessional, ProductController.updateStock);

export default router;
