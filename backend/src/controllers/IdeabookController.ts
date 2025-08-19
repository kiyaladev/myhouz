import { Request, Response } from 'express';
import { Ideabook } from '../models';

export class IdeabookController {
  // Créer un nouveau carnet d'idées
  static async createIdeabook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      
      const ideabookData = {
        ...req.body,
        user: userId
      };

      const ideabook = new Ideabook(ideabookData);
      await ideabook.save();

      res.status(201).json({
        success: true,
        message: 'Carnet d\'idées créé avec succès',
        data: ideabook
      });
    } catch (error) {
      console.error('Erreur lors de la création du carnet d\'idées:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les carnets d'idées de l'utilisateur
  static async getUserIdeabooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { page = 1, limit = 20 } = req.query;

      const ideabooks = await Ideabook.find({
        $or: [
          { user: userId },
          { 'collaborators.user': userId, 'collaborators.acceptedAt': { $exists: true } }
        ]
      })
        .sort({ updatedAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .populate('user', 'firstName lastName profileImage')
        .populate('collaborators.user', 'firstName lastName profileImage');

      const total = await Ideabook.countDocuments({
        $or: [
          { user: userId },
          { 'collaborators.user': userId, 'collaborators.acceptedAt': { $exists: true } }
        ]
      });

      res.json({
        success: true,
        data: ideabooks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des carnets d\'idées:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un carnet d'idées par ID
  static async getIdeabook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        $or: [
          { user: userId },
          { 'collaborators.user': userId, 'collaborators.acceptedAt': { $exists: true } },
          { isPublic: true }
        ]
      })
        .populate('user', 'firstName lastName profileImage')
        .populate('collaborators.user', 'firstName lastName profileImage')
        .populate('items.itemId');

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé'
        });
        return;
      }

      // Incrémenter les vues si ce n'est pas le propriétaire
      if (ideabook.user._id.toString() !== userId) {
        ideabook.views += 1;
        await ideabook.save();
      }

      res.json({
        success: true,
        data: ideabook
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du carnet d\'idées:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les carnets d'idées publics
  static async getPublicIdeabooks(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, tags } = req.query;

      const query: any = { isPublic: true };
      
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      const ideabooks = await Ideabook.find(query)
        .sort({ likes: -1, updatedAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .populate('user', 'firstName lastName profileImage')
        .select('-collaborators');

      const total = await Ideabook.countDocuments(query);

      res.json({
        success: true,
        data: ideabooks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des carnets publics:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un carnet d'idées public par ID
  static async getPublicIdeabook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const ideabook = await Ideabook.findOne({
        _id: id,
        isPublic: true
      })
        .populate('user', 'firstName lastName profileImage')
        .populate('items.itemId')
        .select('-collaborators');

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé'
        });
        return;
      }

      // Incrémenter les vues
      ideabook.views += 1;
      await ideabook.save();

      res.json({
        success: true,
        data: ideabook
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du carnet public:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un carnet d'idées
  static async updateIdeabook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        $or: [
          { user: userId },
          { 'collaborators.user': userId, 'collaborators.permission': 'edit' }
        ]
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      const updatedIdeabook = await Ideabook.findByIdAndUpdate(
        id,
        { $set: req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('user', 'firstName lastName profileImage');

      res.json({
        success: true,
        message: 'Carnet d\'idées mis à jour avec succès',
        data: updatedIdeabook
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du carnet d\'idées:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un carnet d'idées
  static async deleteIdeabook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        user: userId
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      await Ideabook.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Carnet d\'idées supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du carnet d\'idées:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter un élément au carnet d'idées
  static async addItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { type, itemId, note } = req.body;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        $or: [
          { user: userId },
          { 'collaborators.user': userId, 'collaborators.permission': { $in: ['edit', 'comment'] } }
        ]
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      // Vérifier si l'élément existe déjà
      const existingItem = ideabook.items.find(
        item => item.itemId.toString() === itemId && item.type === type
      );

      if (existingItem) {
        res.status(400).json({
          success: false,
          message: 'Cet élément est déjà dans le carnet d\'idées'
        });
        return;
      }

      ideabook.items.push({
        type,
        itemId,
        note,
        addedAt: new Date()
      });

      await ideabook.save();

      res.json({
        success: true,
        message: 'Élément ajouté au carnet d\'idées',
        data: ideabook
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un élément du carnet d'idées
  static async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const { id, itemId } = req.params;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        $or: [
          { user: userId },
          { 'collaborators.user': userId, 'collaborators.permission': 'edit' }
        ]
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      ideabook.items = ideabook.items.filter(
        (item: any) => item._id?.toString() !== itemId
      );

      await ideabook.save();

      res.json({
        success: true,
        message: 'Élément supprimé du carnet d\'idées'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Inviter un collaborateur
  static async inviteCollaborator(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId: collaboratorId, permission = 'view' } = req.body;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        user: userId
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      // Vérifier si l'utilisateur est déjà collaborateur
      const existingCollaborator = ideabook.collaborators.find(
        collab => collab.user.toString() === collaboratorId
      );

      if (existingCollaborator) {
        res.status(400).json({
          success: false,
          message: 'Cet utilisateur est déjà collaborateur'
        });
        return;
      }

      ideabook.collaborators.push({
        user: collaboratorId,
        permission,
        invitedAt: new Date()
      });

      await ideabook.save();

      res.json({
        success: true,
        message: 'Collaborateur invité avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'invitation du collaborateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour les permissions d'un collaborateur
  static async updateCollaboratorPermission(req: Request, res: Response): Promise<void> {
    try {
      const { id, userId: collaboratorId } = req.params;
      const { permission } = req.body;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        user: userId
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      const collaborator = ideabook.collaborators.find(
        collab => collab.user.toString() === collaboratorId
      );

      if (!collaborator) {
        res.status(404).json({
          success: false,
          message: 'Collaborateur non trouvé'
        });
        return;
      }

      collaborator.permission = permission;
      await ideabook.save();

      res.json({
        success: true,
        message: 'Permissions mises à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un collaborateur
  static async removeCollaborator(req: Request, res: Response): Promise<void> {
    try {
      const { id, userId: collaboratorId } = req.params;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findOne({
        _id: id,
        user: userId
      });

      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé ou non autorisé'
        });
        return;
      }

      ideabook.collaborators = ideabook.collaborators.filter(
        collab => collab.user.toString() !== collaboratorId
      );

      await ideabook.save();

      res.json({
        success: true,
        message: 'Collaborateur supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du collaborateur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Toggle like sur un carnet d'idées
  static async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const ideabook = await Ideabook.findById(id);
      if (!ideabook) {
        res.status(404).json({
          success: false,
          message: 'Carnet d\'idées non trouvé'
        });
        return;
      }

      // Pour simplifier, on incrémente juste le compteur
      // Dans une version plus avancée, on garderait trace des utilisateurs qui ont aimé
      ideabook.likes += 1;
      await ideabook.save();

      res.json({
        success: true,
        message: 'Like ajouté',
        data: { likes: ideabook.likes }
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
