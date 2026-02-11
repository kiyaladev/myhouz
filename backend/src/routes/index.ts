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

const router = Router();

// Routes API
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/products', productRoutes);
router.use('/ideabooks', ideabookRoutes);
router.use('/reviews', reviewRoutes);
router.use('/articles', articleRoutes);
router.use('/forum', forumRoutes);
router.use('/messages', messageRoutes);
router.use('/orders', orderRoutes);
router.use('/uploads', uploadRoutes);
router.use('/notifications', notificationRoutes);

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
      'Système de commandes e-commerce'
    ]
  });
});

export default router;
