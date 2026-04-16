import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.get('/', authenticateToken, NotificationController.getNotifications);
router.get('/unread-count', authenticateToken, NotificationController.getUnreadCount);
router.get('/preferences', authenticateToken, NotificationController.getPreferences);
router.put('/preferences', authenticateToken, NotificationController.updatePreferences);
router.patch('/:id/read', authenticateToken, NotificationController.markAsRead);
router.patch('/read-all', authenticateToken, NotificationController.markAllAsRead);
router.delete('/:id', authenticateToken, NotificationController.deleteNotification);

export default router;
