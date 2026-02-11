import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Toutes les routes du panier nécessitent une authentification
router.use(authenticateToken);

// Routes du panier
router.get('/', CartController.getCart);
router.get('/count', CartController.getCartCount);
router.post('/items', CartController.addItem);
router.put('/items/:productId', CartController.updateItemQuantity);
router.delete('/items/:productId', CartController.removeItem);
router.delete('/', CartController.clearCart);

export default router;
