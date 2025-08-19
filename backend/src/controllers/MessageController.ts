import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Message, Conversation } from '../models/Message';

export class MessageController {
  // Créer une nouvelle conversation
  static async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const { participantId, subject, firstMessage, projectContext } = req.body;

      // Vérifier si une conversation existe déjà entre ces utilisateurs
      const existingConversation = await Conversation.findOne({
        participants: { $all: [req.user?.userId, participantId] }
      });

      if (existingConversation) {
        res.status(409).json({
          success: false,
          message: 'Une conversation existe déjà avec cet utilisateur',
          data: { conversationId: existingConversation._id }
        });
        return;
      }

      // Créer la conversation
      const conversation = new Conversation({
        participants: [req.user?.userId, participantId],
        subject,
        projectContext
      });

      await conversation.save();

      // Créer le premier message
      const message = new Message({
        conversation: conversation._id,
        sender: req.user?.userId,
        content: firstMessage
      });

      await message.save();

      // Mettre à jour la conversation avec le dernier message
      conversation.lastMessage = message._id as mongoose.Types.ObjectId;
      conversation.lastActivity = new Date();
      await conversation.save();

      // Populer pour la réponse
      await conversation.populate('participants', 'firstName lastName avatar');
      await message.populate('sender', 'firstName lastName avatar');

      res.status(201).json({
        success: true,
        message: 'Conversation créée avec succès',
        data: { conversation, firstMessage: message }
      });
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir toutes les conversations de l'utilisateur
  static async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, status } = req.query;

      const query: any = {
        participants: req.user?.userId
      };

      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const conversations = await Conversation.find(query)
        .populate('participants', 'firstName lastName avatar userType')
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
            select: 'firstName lastName'
          }
        })
        .sort({ lastActivity: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Conversation.countDocuments(query);

      res.json({
        success: true,
        data: conversations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir une conversation spécifique avec ses messages
  static async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const conversation = await Conversation.findById(id)
        .populate('participants', 'firstName lastName avatar userType');

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur fait partie de la conversation
      const isParticipant = conversation.participants.some(
        (p: any) => p._id.toString() === req.user?.userId
      );

      if (!isParticipant) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const messages = await Message.find({ conversation: id })
        .populate('sender', 'firstName lastName avatar')
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(Number(limit));

      const totalMessages = await Message.countDocuments({ conversation: id });

      // Marquer les messages comme lus par l'utilisateur actuel
      await Message.updateMany(
        {
          conversation: id,
          'readBy.user': { $ne: req.user?.userId }
        },
        {
          $addToSet: {
            readBy: {
              user: req.user?.userId,
              readAt: new Date()
            }
          }
        }
      );

      res.json({
        success: true,
        data: {
          conversation,
          messages,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: totalMessages,
            pages: Math.ceil(totalMessages / Number(limit))
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Envoyer un message
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const { content, messageType, metadata, attachments } = req.body;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur fait partie de la conversation
      const isParticipant = conversation.participants.some(
        (p: any) => p.toString() === req.user?.userId
      );

      if (!isParticipant) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      const message = new Message({
        conversation: conversationId,
        sender: req.user?.userId,
        content,
        messageType: messageType || 'text',
        metadata,
        attachments,
        readBy: [{
          user: req.user?.userId,
          readAt: new Date()
        }]
      });

      await message.save();

      // Mettre à jour la conversation
      conversation.lastMessage = message._id as mongoose.Types.ObjectId;
      conversation.lastActivity = new Date();
      await conversation.save();

      // Populer pour la réponse
      await message.populate('sender', 'firstName lastName avatar');

      res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès',
        data: message
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un message
  static async updateMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const { content } = req.body;

      const message = await Message.findById(messageId);

      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'expéditeur
      if (message.sender.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      message.content = content;
      message.edited = true;
      message.editedAt = new Date();
      await message.save();

      res.json({
        success: true,
        message: 'Message mis à jour avec succès',
        data: message
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un message
  static async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;

      const message = await Message.findById(messageId);

      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'expéditeur
      if (message.sender.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      await Message.findByIdAndDelete(messageId);

      res.json({
        success: true,
        message: 'Message supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Archiver une conversation
  static async archiveConversation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const conversation = await Conversation.findById(id);

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur fait partie de la conversation
      const isParticipant = conversation.participants.some(
        (p: any) => p.toString() === req.user?.userId
      );

      if (!isParticipant) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      conversation.status = 'archived';
      await conversation.save();

      res.json({
        success: true,
        message: 'Conversation archivée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'archivage de la conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir le nombre de messages non lus
  static async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      // Trouver toutes les conversations de l'utilisateur
      const conversations = await Conversation.find({
        participants: req.user?.userId,
        status: 'active'
      }).select('_id');

      const conversationIds = conversations.map(c => c._id);

      // Compter les messages non lus
      const unreadCount = await Message.countDocuments({
        conversation: { $in: conversationIds },
        sender: { $ne: req.user?.userId },
        'readBy.user': { $ne: req.user?.userId }
      });

      res.json({
        success: true,
        data: { unreadCount }
      });
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer une conversation comme lue
  static async markConversationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const conversation = await Conversation.findById(id);

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: 'Conversation non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur fait partie de la conversation
      const isParticipant = conversation.participants.some(
        (p: any) => p.toString() === req.user?.userId
      );

      if (!isParticipant) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      // Marquer tous les messages de la conversation comme lus
      await Message.updateMany(
        {
          conversation: id,
          'readBy.user': { $ne: req.user?.userId }
        },
        {
          $addToSet: {
            readBy: {
              user: req.user?.userId,
              readAt: new Date()
            }
          }
        }
      );

      res.json({
        success: true,
        message: 'Conversation marquée comme lue'
      });
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}