import { Request, Response } from 'express';
import Article from '../models/Article';
import ArticleComment from '../models/ArticleComment';
import slugify from 'slugify';

export class ArticleController {
  // Créer un nouvel article
  static async createArticle(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        excerpt,
        content,
        featuredImage,
        gallery,
        category,
        tags,
        relatedProducts,
        relatedProfessionals,
        relatedProjects,
        seo,
        status,
        featured,
        estimatedReadTime
      } = req.body;

      // Génération automatique du slug
      const slug = slugify(title, { lower: true, strict: true });

      const article = new Article({
        title,
        slug,
        excerpt,
        content,
        author: req.user?.userId,
        featuredImage,
        gallery,
        category,
        tags,
        relatedProducts,
        relatedProfessionals,
        relatedProjects,
        seo,
        status: status || 'draft',
        featured: featured || false,
        estimatedReadTime: estimatedReadTime || 5,
        publishedAt: status === 'published' ? new Date() : undefined
      });

      await article.save();

      res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: article
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir tous les articles avec filtres
  static async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        featured,
        status,
        author,
        tags,
        page = 1,
        limit = 12,
        sort = 'publishedAt'
      } = req.query;

      const query: any = {};

      // Filtres publics - seulement les articles publiés pour les non-auteurs
      if (!req.user || req.user.userType !== 'professionnel') {
        query.status = 'published';
      } else if (status) {
        query.status = status;
      }

      if (category) query.category = category;
      if (featured === 'true') query.featured = true;
      if (author) query.author = author;
      if (tags) {
        query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
      }

      // Options de tri
      const sortOptions: any = {};
      switch (sort) {
        case 'popular':
          sortOptions.views = -1;
          break;
        case 'likes':
          sortOptions.likes = -1;
          break;
        case 'recent':
          sortOptions.publishedAt = -1;
          break;
        default:
          sortOptions.publishedAt = -1;
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const articles = await Article.find(query)
        .populate('author', 'firstName lastName avatar')
        .populate('relatedProducts', 'name price images')
        .populate('relatedProfessionals', 'firstName lastName avatar location')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await Article.countDocuments(query);

      res.json({
        success: true,
        data: articles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un article par slug
  static async getArticleBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const article = await Article.findOne({ slug })
        .populate('author', 'firstName lastName avatar bio')
        .populate('relatedProducts', 'name price images slug')
        .populate('relatedProfessionals', 'firstName lastName avatar location')
        .populate('relatedProjects', 'title images style category');

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
        return;
      }

      // Vérifier si l'article est publié ou si l'utilisateur est l'auteur
      if (article.status !== 'published' && 
          (!req.user || req.user.userId !== article.author._id.toString())) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      // Incrémenter les vues
      await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

      res.json({
        success: true,
        data: article
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un article
  static async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const article = await Article.findById(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (article.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      // Mettre à jour le slug si le titre change
      if (updateData.title && updateData.title !== article.title) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
      }

      // Mettre à jour la date de publication si le statut change vers publié
      if (updateData.status === 'published' && article.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('author', 'firstName lastName avatar');

      res.json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: updatedArticle
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un article
  static async deleteArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const article = await Article.findById(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (article.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      await Article.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Article supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Aimer/ne plus aimer un article
  static async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const article = await Article.findById(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
        return;
      }

      // Pour simplifier, on incrémente juste le compteur
      // Dans une vraie app, on stockerait les likes par utilisateur
      await Article.findByIdAndUpdate(id, { $inc: { likes: 1 } });

      res.json({
        success: true,
        message: 'Article liké avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du like de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Recherche textuelle dans les articles
  static async searchArticles(req: Request, res: Response): Promise<void> {
    try {
      const { q, page = 1, limit = 12 } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Terme de recherche requis'
        });
        return;
      }

      const query = {
        $text: { $search: q as string },
        status: 'published'
      };

      const skip = (Number(page) - 1) * Number(limit);

      const articles = await Article.find(query)
        .populate('author', 'firstName lastName avatar')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit));

      const total = await Article.countDocuments(query);

      res.json({
        success: true,
        data: articles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la recherche d\'articles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // =====================
  // COMMENTAIRES D'ARTICLES
  // =====================

  // Obtenir les commentaires d'un article
  static async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 20 } = req.query;

      // Trouver l'article par slug
      const article = await Article.findOne({ slug });
      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);

      // Récupérer les commentaires parents (sans parentComment)
      const comments = await ArticleComment.find({
        article: article._id,
        parentComment: { $exists: false },
        isModerated: false
      })
        .populate('author', 'firstName lastName profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      // Pour chaque commentaire parent, récupérer les réponses
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await ArticleComment.find({
            parentComment: comment._id,
            isModerated: false
          })
            .populate('author', 'firstName lastName profileImage')
            .sort({ createdAt: 1 })
            .lean();
          return { ...comment, replies };
        })
      );

      const total = await ArticleComment.countDocuments({
        article: article._id,
        parentComment: { $exists: false },
        isModerated: false
      });

      res.json({
        success: true,
        data: commentsWithReplies,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter un commentaire
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { content, parentCommentId } = req.body;

      // Trouver l'article par slug
      const article = await Article.findOne({ slug });
      if (!article) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé'
        });
        return;
      }

      // Vérifier le commentaire parent s'il existe
      if (parentCommentId) {
        const parentComment = await ArticleComment.findById(parentCommentId);
        if (!parentComment || parentComment.article.toString() !== (article._id as string).toString()) {
          res.status(400).json({
            success: false,
            message: 'Commentaire parent invalide'
          });
          return;
        }
      }

      const comment = new ArticleComment({
        article: article._id,
        author: req.user?.userId,
        content,
        parentComment: parentCommentId || undefined
      });

      await comment.save();
      await comment.populate('author', 'firstName lastName profileImage');

      res.status(201).json({
        success: true,
        message: 'Commentaire ajouté avec succès',
        data: comment
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un commentaire
  static async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await ArticleComment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (comment.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      comment.content = content;
      comment.isEdited = true;
      await comment.save();
      await comment.populate('author', 'firstName lastName profileImage');

      res.json({
        success: true,
        message: 'Commentaire mis à jour avec succès',
        data: comment
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un commentaire
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;

      const comment = await ArticleComment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'auteur
      if (comment.author.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      // Supprimer aussi les réponses à ce commentaire
      await ArticleComment.deleteMany({ parentComment: commentId });
      await ArticleComment.findByIdAndDelete(commentId);

      res.json({
        success: true,
        message: 'Commentaire supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Liker un commentaire
  static async likeComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;

      const comment = await ArticleComment.findById(commentId);

      if (!comment) {
        res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
        return;
      }

      await ArticleComment.findByIdAndUpdate(commentId, { $inc: { likes: 1 } });

      res.json({
        success: true,
        message: 'Like ajouté'
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }}
