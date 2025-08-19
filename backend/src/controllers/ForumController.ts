import { Request, Response } from 'express';
import { ForumPost, ForumReply } from '../models/Forum';

export class ForumController {
  // Créer un nouveau post de forum
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        content,
        category,
        tags,
        images,
        attachments
      } = req.body;

      const post = new ForumPost({
        title,
        content,
        author: req.user?.userId,
        category,
        tags,
        images,
        attachments
      });

      await post.save();
      await post.populate('author', 'firstName lastName avatar');

      res.status(201).json({
        success: true,
        message: 'Post créé avec succès',
        data: post
      });
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir tous les posts avec filtres
  static async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        status,
        isPinned,
        solved,
        page = 1,
        limit = 20,
        sort = 'recent'
      } = req.query;

      const query: any = { status: status || 'active' };

      if (category) query.category = category;
      if (isPinned === 'true') query.isPinned = true;
      if (solved === 'true') query.solved = true;
      if (solved === 'false') query.solved = false;

      // Options de tri
      const sortOptions: any = {};
      switch (sort) {
        case 'popular':
          sortOptions['votes.up'] = -1;
          break;
        case 'views':
          sortOptions.views = -1;
          break;
        case 'recent':
        default:
          sortOptions.isPinned = -1;
          sortOptions.createdAt = -1;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const posts = await ForumPost.find(query)
        .populate('author', 'firstName lastName avatar userType')
        .populate('bestAnswer')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await ForumPost.countDocuments(query);

      res.json({
        success: true,
        data: posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un post par ID avec ses réponses
  static async getPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const post = await ForumPost.findById(id)
        .populate('author', 'firstName lastName avatar userType')
        .populate('bestAnswer');

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post non trouvé'
        });
        return;
      }

      // Incrémenter les vues
      await ForumPost.findByIdAndUpdate(id, { $inc: { views: 1 } });

      // Récupérer les réponses
      const replies = await ForumReply.find({ post: id })
        .populate('author', 'firstName lastName avatar userType')
        .populate('parentReply')
        .sort({ isBestAnswer: -1, createdAt: 1 });

      res.json({
        success: true,
        data: {
          post,
          replies
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du post:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un post
  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const post = await ForumPost.findById(id);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (post.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      const updatedPost = await ForumPost.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('author', 'firstName lastName avatar');

      res.json({
        success: true,
        message: 'Post mis à jour avec succès',
        data: updatedPost
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un post
  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const post = await ForumPost.findById(id);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (post.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      // Supprimer aussi toutes les réponses
      await ForumReply.deleteMany({ post: id });
      await ForumPost.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Post supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Voter pour un post
  static async votePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { voteType } = req.body; // 'up' ou 'down'

      if (!['up', 'down'].includes(voteType)) {
        res.status(400).json({
          success: false,
          message: 'Type de vote invalide'
        });
        return;
      }

      const updateQuery = voteType === 'up' 
        ? { $inc: { 'votes.up': 1 } }
        : { $inc: { 'votes.down': 1 } };

      await ForumPost.findByIdAndUpdate(id, updateQuery);

      res.json({
        success: true,
        message: 'Vote enregistré avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Créer une réponse
  static async createReply(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { content, parentReply, images } = req.body;

      const post = await ForumPost.findById(postId);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post non trouvé'
        });
        return;
      }

      const reply = new ForumReply({
        post: postId,
        author: req.user?.userId,
        content,
        parentReply,
        images
      });

      await reply.save();
      await reply.populate('author', 'firstName lastName avatar userType');

      res.status(201).json({
        success: true,
        message: 'Réponse créée avec succès',
        data: reply
      });
    } catch (error) {
      console.error('Erreur lors de la création de la réponse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour une réponse
  static async updateReply(req: Request, res: Response): Promise<void> {
    try {
      const { replyId } = req.params;
      const updateData = req.body;

      const reply = await ForumReply.findById(replyId);

      if (!reply) {
        res.status(404).json({
          success: false,
          message: 'Réponse non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (reply.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      const updatedReply = await ForumReply.findByIdAndUpdate(
        replyId,
        updateData,
        { new: true }
      ).populate('author', 'firstName lastName avatar');

      res.json({
        success: true,
        message: 'Réponse mise à jour avec succès',
        data: updatedReply
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réponse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer une réponse
  static async deleteReply(req: Request, res: Response): Promise<void> {
    try {
      const { replyId } = req.params;

      const reply = await ForumReply.findById(replyId);

      if (!reply) {
        res.status(404).json({
          success: false,
          message: 'Réponse non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (reply.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      await ForumReply.findByIdAndDelete(replyId);

      res.json({
        success: true,
        message: 'Réponse supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la réponse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Voter pour une réponse
  static async voteReply(req: Request, res: Response): Promise<void> {
    try {
      const { replyId } = req.params;
      const { voteType } = req.body; // 'up' ou 'down'

      if (!['up', 'down'].includes(voteType)) {
        res.status(400).json({
          success: false,
          message: 'Type de vote invalide'
        });
        return;
      }

      const updateQuery = voteType === 'up' 
        ? { $inc: { 'votes.up': 1 } }
        : { $inc: { 'votes.down': 1 } };

      await ForumReply.findByIdAndUpdate(replyId, updateQuery);

      res.json({
        success: true,
        message: 'Vote enregistré avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer une réponse comme meilleure réponse
  static async markBestAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { postId, replyId } = req.params;

      const post = await ForumPost.findById(postId);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur du post
      if (post.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Seul l\'auteur peut marquer la meilleure réponse'
        });
        return;
      }

      // Retirer la marque de meilleure réponse des autres réponses
      await ForumReply.updateMany(
        { post: postId },
        { isBestAnswer: false }
      );

      // Marquer la nouvelle meilleure réponse
      await ForumReply.findByIdAndUpdate(replyId, { isBestAnswer: true });

      // Mettre à jour le post
      await ForumPost.findByIdAndUpdate(postId, {
        bestAnswer: replyId,
        solved: true
      });

      res.json({
        success: true,
        message: 'Meilleure réponse définie avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la définition de la meilleure réponse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Recherche dans le forum
  static async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const { q, category, page = 1, limit = 20 } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Terme de recherche requis'
        });
        return;
      }

      const query: any = {
        $text: { $search: q as string },
        status: 'active'
      };

      if (category) {
        query.category = category;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const posts = await ForumPost.find(query)
        .populate('author', 'firstName lastName avatar')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit));

      const total = await ForumPost.countDocuments(query);

      res.json({
        success: true,
        data: posts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la recherche dans le forum:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}