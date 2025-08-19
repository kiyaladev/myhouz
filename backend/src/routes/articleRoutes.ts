import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { authenticateToken, requireProfessional, optionalAuth } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', optionalAuth, ArticleController.getArticles);
router.get('/search', ArticleController.searchArticles);
router.get('/:slug', optionalAuth, ArticleController.getArticleBySlug);

// Routes protégées - professionnels uniquement
router.post('/', authenticateToken, requireProfessional, ArticleController.createArticle);
router.put('/:id', authenticateToken, requireProfessional, ArticleController.updateArticle);
router.delete('/:id', authenticateToken, requireProfessional, ArticleController.deleteArticle);

// Actions utilisateur
router.post('/:id/like', authenticateToken, ArticleController.toggleLike);

export default router;