import { Router } from 'express';
import userRoutes from './userRoutes';
import projectRoutes from './projectRoutes';
import productRoutes from './productRoutes';
import ideabookRoutes from './ideabookRoutes';
import reviewRoutes from './reviewRoutes';
import articleRoutes from './articleRoutes';
import forumRoutes from './forumRoutes';
import messageRoutes from './messageRoutes';
import orderRoutes from './orderRoutes';
import uploadRoutes from './uploadRoutes';
import notificationRoutes from './notificationRoutes';
import searchRoutes from './searchRoutes';
import cartRoutes from './cartRoutes';
import quoteRoutes from './quoteRoutes';
import posRoutes from './posRoutes';
import wishlistRoutes from './wishlistRoutes';
import { apiCache } from '../middleware/cache';

const router = Router();

// Routes API (cached public routes with 60s TTL for non-authenticated GET requests)
router.use('/users', userRoutes);
router.use('/projects', apiCache(60), projectRoutes);
router.use('/products', apiCache(60), productRoutes);
router.use('/ideabooks', ideabookRoutes);
router.use('/reviews', apiCache(30), reviewRoutes);
router.use('/articles', apiCache(120), articleRoutes);
router.use('/forum', apiCache(30), forumRoutes);
router.use('/messages', messageRoutes);
router.use('/orders', orderRoutes);
router.use('/uploads', uploadRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', apiCache(30), searchRoutes);
router.use('/cart', cartRoutes);
router.use('/quotes', quoteRoutes);
router.use('/pos', posRoutes);
router.use('/wishlists', wishlistRoutes);

// Route de test
router.get('/test', (req, res) => {
  res.json({
    message: 'API MyHouz fonctionnelle',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route de santé de l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API MyHouz fonctionne correctement',
    timestamp: new Date().toISOString(),
    features: [
      'Gestion des utilisateurs (particuliers/professionnels)',
      'Galerie de projets d\'inspiration',
      'Marketplace de produits',
      'Carnets d\'idées (Ideabooks)',
      'Système d\'avis et de notation',
      'Articles de blog et conseils',
      'Forum communautaire',
      'Messagerie entre utilisateurs',
      'Système de commandes e-commerce',
      'Point de vente (POS) avec gestion de stocks et facturation'
    ]
  });
});

export default router;
