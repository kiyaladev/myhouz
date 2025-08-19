import { Request, Response } from 'express';
import { Review, User } from '../models';

export class ReviewController {
  // Créer un nouvel avis
  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { reviewedEntity, entityType, rating, title, comment, images, projectContext } = req.body;

      // Vérifier si l'utilisateur a déjà laissé un avis pour cette entité
      const existingReview = await Review.findOne({
        reviewer: userId,
        reviewedEntity,
        entityType
      });

      if (existingReview) {
        res.status(400).json({
          success: false,
          message: 'Vous avez déjà laissé un avis pour cette entité'
        });
        return;
      }

      const reviewData = {
        reviewer: userId,
        reviewedEntity,
        entityType,
        rating,
        title,
        comment,
        images,
        projectContext
      };

      const review = new Review(reviewData);
      await review.save();

      // Mettre à jour la note moyenne de l'entité
      await updateEntityRating(reviewedEntity.toString(), entityType);

      res.status(201).json({
        success: true,
        message: 'Avis créé avec succès',
        data: review
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les avis d'un professionnel
  static async getProfessionalReviews(req: Request, res: Response): Promise<void> {
    try {
      const { professionalId } = req.params;
      const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

      const sortOptions: any = {};
      switch (sort) {
        case 'rating-desc':
          sortOptions['rating.overall'] = -1;
          break;
        case 'rating-asc':
          sortOptions['rating.overall'] = 1;
          break;
        case 'helpful':
          sortOptions['helpful.yes'] = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      const reviews = await Review.find({
        reviewedEntity: professionalId,
        entityType: 'professional',
        status: 'approved'
      })
        .populate('reviewer', 'firstName lastName profileImage')
        .sort(sortOptions)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Review.countDocuments({
        reviewedEntity: professionalId,
        entityType: 'professional',
        status: 'approved'
      });

      // Calculer les statistiques des avis
      const stats = await Review.aggregate([
        {
          $match: {
            reviewedEntity: professionalId,
            entityType: 'professional',
            status: 'approved'
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating.overall' },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating.overall'
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: reviews,
        stats: stats[0] || { averageRating: 0, totalReviews: 0 },
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des avis du professionnel:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les avis d'un produit
  static async getProductReviews(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

      const sortOptions: any = {};
      switch (sort) {
        case 'rating-desc':
          sortOptions['rating.overall'] = -1;
          break;
        case 'rating-asc':
          sortOptions['rating.overall'] = 1;
          break;
        case 'helpful':
          sortOptions['helpful.yes'] = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      const reviews = await Review.find({
        reviewedEntity: productId,
        entityType: 'product',
        status: 'approved'
      })
        .populate('reviewer', 'firstName lastName profileImage')
        .sort(sortOptions)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Review.countDocuments({
        reviewedEntity: productId,
        entityType: 'product',
        status: 'approved'
      });

      res.json({
        success: true,
        data: reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des avis du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un avis
  static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const review = await Review.findOne({
        _id: id,
        reviewer: userId
      });

      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Avis non trouvé ou non autorisé'
        });
        return;
      }

      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { $set: req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('reviewer', 'firstName lastName profileImage');

      // Mettre à jour la note moyenne de l'entité
      await updateEntityRating(review.reviewedEntity.toString(), review.entityType);

      res.json({
        success: true,
        message: 'Avis mis à jour avec succès',
        data: updatedReview
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un avis
  static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const review = await Review.findOne({
        _id: id,
        reviewer: userId
      });

      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Avis non trouvé ou non autorisé'
        });
        return;
      }

      await Review.findByIdAndDelete(id);

      // Mettre à jour la note moyenne de l'entité
      await updateEntityRating(review.reviewedEntity.toString(), review.entityType);

      res.json({
        success: true,
        message: 'Avis supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer un avis comme utile
  static async markHelpful(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { helpful } = req.body; // true pour utile, false pour pas utile

      const review = await Review.findById(id);
      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
        return;
      }

      if (helpful) {
        review.helpful.yes += 1;
      } else {
        review.helpful.no += 1;
      }

      await review.save();

      res.json({
        success: true,
        message: 'Feedback enregistré',
        data: {
          helpful: review.helpful
        }
      });
    } catch (error) {
      console.error('Erreur lors du marquage comme utile:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter une réponse à un avis (pour les professionnels)
  static async addResponse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const userId = (req as any).user.userId;
      const userType = (req as any).user.userType;

      // Vérifier que seuls les professionnels peuvent répondre
      if (userType !== 'professionnel') {
        res.status(403).json({
          success: false,
          message: 'Seuls les professionnels peuvent répondre aux avis'
        });
        return;
      }

      const review = await Review.findById(id);
      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
        return;
      }

      // Vérifier que le professionnel est bien celui qui est évalué
      if (review.entityType === 'professional' && review.reviewedEntity.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à répondre à cet avis'
        });
        return;
      }

      review.response = {
        text,
        respondedAt: new Date()
      };

      await review.save();

      res.json({
        success: true,
        message: 'Réponse ajoutée avec succès',
        data: review
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}

// Fonction utilitaire pour mettre à jour la note moyenne d'une entité
async function updateEntityRating(entityId: string, entityType: string): Promise<void> {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          reviewedEntity: entityId,
          entityType,
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating.overall' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      const { averageRating, totalReviews } = stats[0];

      if (entityType === 'professional') {
        await User.findByIdAndUpdate(entityId, {
          'professionalInfo.rating.average': Math.round(averageRating * 10) / 10,
          'professionalInfo.rating.totalReviews': totalReviews
        });
      }
      // Pour les produits, on peut ajouter une logique similaire
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error);
  }
}
