import { Router } from 'express';
import express from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requireProfessional } from '../middleware/auth';

const router = Router();

// Webhook Stripe (DOIT être avant le middleware JSON car besoin du raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), OrderController.handleStripeWebhook);

// Toutes les routes suivantes nécessitent une authentification
router.use(authenticateToken);

// Gestion des commandes
router.post('/', OrderController.createOrder);
router.get('/user', OrderController.getUserOrders);
router.get('/seller', requireProfessional, OrderController.getSellerOrders);
router.get('/seller/stats', requireProfessional, OrderController.getSellerStats);
router.get('/:id', OrderController.getOrder);

// Stripe checkout
router.post('/checkout-session', OrderController.createCheckoutSession);

// Actions sur les commandes
router.patch('/:id/status', requireProfessional, OrderController.updateOrderStatus);
router.post('/:id/payment', OrderController.processPayment);
router.post('/:id/refund', OrderController.refundOrder);
router.patch('/:id/cancel', OrderController.cancelOrder);

export default router;