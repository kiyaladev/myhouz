import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requireProfessional } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Gestion des commandes
router.post('/', OrderController.createOrder);
router.get('/user', OrderController.getUserOrders);
router.get('/seller', requireProfessional, OrderController.getSellerOrders);
router.get('/seller/stats', requireProfessional, OrderController.getSellerStats);
router.get('/:id', OrderController.getOrder);

// Actions sur les commandes
router.patch('/:id/status', requireProfessional, OrderController.updateOrderStatus);
router.post('/:id/payment', OrderController.processPayment);
router.patch('/:id/cancel', OrderController.cancelOrder);

export default router;