import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// Routes API
router.use('/users', userRoutes);

// Route de test
router.get('/test', (req, res) => {
  res.json({
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

export default router;
