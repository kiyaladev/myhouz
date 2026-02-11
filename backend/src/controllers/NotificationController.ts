import { Request, Response } from 'express';
import Notification from '../models/Notification';

export class NotificationController {
  // Obtenir les notifications de l'utilisateur connecté
  static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const filter: any = { recipient: userId };

      if (req.query.type) {
        filter.type = req.query.type;
      }

      if (req.query.read !== undefined) {
        filter.read = req.query.read === 'true';
      }

      const [notifications, total] = await Promise.all([
        Notification.find(filter)
          .populate('sender', 'firstName lastName avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Notification.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir le nombre de notifications non lues
  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const count = await Notification.countDocuments({
        recipient: userId,
        read: false
      });

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer une notification comme lue
  static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const notification = await Notification.findOneAndUpdate(
        { _id: id, recipient: userId },
        { read: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification marquée comme lue',
        data: notification
      });
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer toutes les notifications comme lues
  static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const result = await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true, readAt: new Date() }
      );

      res.json({
        success: true,
        message: `${result.modifiedCount} notification(s) marquée(s) comme lue(s)`
      });
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer une notification
  static async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const notification = await Notification.findOneAndDelete({
        _id: id,
        recipient: userId
      });

      if (!notification) {
        res.status(404).json({
          success: false,
          message: 'Notification non trouvée'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Notification supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
