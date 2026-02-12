import { Router } from 'express';
import { WishlistController } from '../controllers/WishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.get('/', authenticateToken, WishlistController.getWishlists);
router.post('/', authenticateToken, WishlistController.createWishlist);
router.post('/quick-add', authenticateToken, WishlistController.quickAdd);
router.get('/check/:productId', authenticateToken, WishlistController.checkProduct);
router.get('/:id', authenticateToken, WishlistController.getWishlist);
router.post('/:id/items', authenticateToken, WishlistController.addItem);
router.delete('/:id/items/:productId', authenticateToken, WishlistController.removeItem);
router.delete('/:id', authenticateToken, WishlistController.deleteWishlist);

export default router;
