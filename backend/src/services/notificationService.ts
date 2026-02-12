import Notification from '../models/Notification';
import User from '../models/User';
import { sendNewMessageEmail, sendNewReviewEmail, sendOrderStatusEmail } from './notificationEmailService';

interface CreateNotificationParams {
  recipientId: string;
  senderId?: string;
  type: 'message' | 'review' | 'order' | 'ideabook' | 'project' | 'system' | 'quote';
  title: string;
  content: string;
  link?: string;
  metadata?: Record<string, any>;
}

function truncate(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export class NotificationService {
  /**
   * Create a notification and optionally send an email
   */
  static async create(params: CreateNotificationParams): Promise<void> {
    try {
      await Notification.create({
        recipient: params.recipientId,
        sender: params.senderId,
        type: params.type,
        title: params.title,
        content: params.content,
        link: params.link,
        metadata: params.metadata,
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }

  /**
   * Notify when a new message is received
   */
  static async onNewMessage(
    recipientId: string,
    senderId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
  ): Promise<void> {
    await NotificationService.create({
      recipientId,
      senderId,
      type: 'message',
      title: 'Nouveau message',
      content: `${senderName} vous a envoyé un message : "${truncate(messagePreview)}"`,
      link: `/messages?conversation=${conversationId}`,
      metadata: { conversationId },
    });

    // Send email notification (fire and forget)
    try {
      const recipient = await User.findById(recipientId).select('email');
      if (recipient?.email) {
        sendNewMessageEmail(recipient.email, senderName, messagePreview).catch(() => {});
      }
    } catch {
      // Email is non-critical
    }
  }

  /**
   * Notify when a new review is received
   */
  static async onNewReview(
    recipientId: string,
    reviewerId: string,
    reviewerName: string,
    rating: number,
    targetName: string
  ): Promise<void> {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    await NotificationService.create({
      recipientId,
      senderId: reviewerId,
      type: 'review',
      title: 'Nouvel avis reçu',
      content: `${reviewerName} a laissé un avis ${stars} sur ${targetName}`,
      link: '/dashboard/pro/reviews',
    });

    try {
      const recipient = await User.findById(recipientId).select('email');
      if (recipient?.email) {
        sendNewReviewEmail(recipient.email, reviewerName, rating, targetName).catch(() => {});
      }
    } catch {
      // Email is non-critical
    }
  }

  /**
   * Notify on order status change
   */
  static async onOrderStatusChange(
    recipientId: string,
    orderNumber: string,
    status: string
  ): Promise<void> {
    const statusLabels: Record<string, string> = {
      confirmed: 'confirmée',
      processing: 'en préparation',
      shipped: 'expédiée',
      delivered: 'livrée',
      refunded: 'remboursée',
    };
    const label = statusLabels[status] || status;

    await NotificationService.create({
      recipientId,
      type: 'order',
      title: 'Mise à jour de commande',
      content: `Votre commande #${orderNumber} est maintenant ${label}`,
      link: `/orders/tracking?order=${orderNumber}`,
      metadata: { orderNumber, status },
    });

    try {
      const recipient = await User.findById(recipientId).select('email');
      if (recipient?.email) {
        sendOrderStatusEmail(recipient.email, orderNumber, status).catch(() => {});
      }
    } catch {
      // Email is non-critical
    }
  }

  /**
   * Notify on new conversation created
   */
  static async onNewConversation(
    recipientId: string,
    senderId: string,
    senderName: string,
    subject: string,
    conversationId: string
  ): Promise<void> {
    await NotificationService.create({
      recipientId,
      senderId,
      type: 'message',
      title: 'Nouvelle conversation',
      content: `${senderName} a démarré une conversation : "${subject}"`,
      link: `/messages?conversation=${conversationId}`,
      metadata: { conversationId },
    });
  }
}
