import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticateToken } from '../middleware/auth';
import { uploadMultiple, handleUploadError } from '../middleware/upload';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Gestion des conversations
router.post('/conversations', MessageController.createConversation);
router.get('/conversations', MessageController.getConversations);
router.get('/conversations/:id', MessageController.getConversation);
router.patch('/conversations/:id/archive', MessageController.archiveConversation);
router.patch('/conversations/:id/read', MessageController.markConversationAsRead);

// Gestion des messages (with optional file attachments)
router.post('/conversations/:conversationId/messages', uploadMultiple, MessageController.sendMessage);
router.put('/messages/:messageId', MessageController.updateMessage);
router.delete('/messages/:messageId', MessageController.deleteMessage);

// Utilitaires
router.get('/unread-count', MessageController.getUnreadCount);

// Upload error handler
router.use(handleUploadError);

export default router;