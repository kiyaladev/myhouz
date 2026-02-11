import { Router } from 'express';
import { ForumController } from '../controllers/ForumController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', ForumController.getPosts);
router.get('/search', ForumController.searchPosts);
router.get('/:id', ForumController.getPost);

// Routes protégées - création et gestion des posts
router.post('/', authenticateToken, ForumController.createPost);
router.put('/:id', authenticateToken, ForumController.updatePost);
router.delete('/:id', authenticateToken, ForumController.deletePost);
router.post('/:id/vote', authenticateToken, ForumController.votePost);
router.post('/:id/report', authenticateToken, ForumController.reportPost);

// Gestion des réponses
router.post('/:postId/replies', authenticateToken, ForumController.createReply);
router.put('/replies/:replyId', authenticateToken, ForumController.updateReply);
router.delete('/replies/:replyId', authenticateToken, ForumController.deleteReply);
router.post('/replies/:replyId/vote', authenticateToken, ForumController.voteReply);

// Meilleure réponse
router.put('/:postId/best-answer/:replyId', authenticateToken, ForumController.markBestAnswer);

export default router;