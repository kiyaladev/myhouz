import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';
import { authenticateToken, requireProfessional, optionalAuth } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', optionalAuth, ArticleController.getArticles);
router.get('/search', ArticleController.searchArticles);
router.get('/:slug', optionalAuth, ArticleController.getArticleBySlug);
router.get('/:slug/comments', ArticleController.getComments);

// Routes protégées - professionnels uniquement
router.post('/', authenticateToken, requireProfessional, ArticleController.createArticle);
router.put('/:id', authenticateToken, requireProfessional, ArticleController.updateArticle);
router.delete('/:id', authenticateToken, requireProfessional, ArticleController.deleteArticle);

// Actions utilisateur
router.post('/:id/like', authenticateToken, ArticleController.toggleLike);

// Commentaires - routes protégées
router.post('/:slug/comments', authenticateToken, ArticleController.addComment);
router.put('/comments/:commentId', authenticateToken, ArticleController.updateComment);
router.delete('/comments/:commentId', authenticateToken, ArticleController.deleteComment);
router.post('/comments/:commentId/like', authenticateToken, ArticleController.likeComment);

export default router;