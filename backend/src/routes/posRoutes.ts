import { Router } from 'express';
import { PosController } from '../controllers/PosController';
import { authenticateToken, requireProfessional } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification professionnelle
router.use(authenticateToken);
router.use(requireProfessional);

// Dashboard POS
router.get('/dashboard', PosController.getDashboard);

// Recherche rapide de produits pour le POS
router.get('/products/search', PosController.searchProducts);

// Gestion du stock
router.get('/stock', PosController.getStockList);
router.patch('/stock/adjust', PosController.adjustStock);

// Gestion des ventes
router.post('/sales', PosController.createSale);
router.get('/sales', PosController.getSales);
router.get('/sales/:id', PosController.getSale);
router.patch('/sales/:id/refund', PosController.refundSale);

export default router;
