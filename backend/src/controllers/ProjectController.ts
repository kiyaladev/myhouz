import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Project, Product, User } from '../models';

export class ProjectController {
  // Créer un nouveau projet
  static async createProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const userType = (req as any).user.userType;

      // Vérifier que seuls les professionnels peuvent créer des projets
      if (userType !== 'professionnel') {
        res.status(403).json({
          success: false,
          message: 'Seuls les professionnels peuvent créer des projets'
        });
        return;
      }

      const projectData = {
        ...req.body,
        professional: userId
      };

      const project = new Project(projectData);
      await project.save();

      res.status(201).json({
        success: true,
        message: 'Projet créé avec succès',
        data: project
      });
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir tous les projets avec filtres
  static async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        room,
        style,
        featured,
        professional,
        city,
        page = 1,
        limit = 20,
        sort = 'createdAt'
      } = req.query;

      const query: any = { status: 'published' };

      // Filtres
      if (category) query.category = category;
      if (room) query.room = room;
      if (style) query.style = { $in: Array.isArray(style) ? style : [style] };
      if (featured === 'true') query.featured = true;
      if (professional) query.professional = professional;
      if (city) query['location.city'] = new RegExp(city as string, 'i');

      // Options de tri
      const sortOptions: any = {};
      switch (sort) {
        case 'popular':
          sortOptions.views = -1;
          break;
        case 'liked':
          sortOptions.likes = -1;
          break;
        case 'recent':
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      const projects = await Project.find(query)
        .populate('professional', 'firstName lastName professionalInfo.companyName professionalInfo.rating profileImage')
        .sort(sortOptions)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Project.countDocuments(query);

      res.json({
        success: true,
        data: projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un projet par ID
  static async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const project = await Project.findById(id)
        .populate('professional', 'firstName lastName professionalInfo.companyName professionalInfo.rating profileImage location')
        .populate('images.products');

      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      // Incrémenter les vues
      project.views += 1;
      await project.save();

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du projet:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un projet
  static async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est le propriétaire du projet
      if (project.professional.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier ce projet'
        });
        return;
      }

      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('professional', 'firstName lastName professionalInfo.companyName');

      res.json({
        success: true,
        message: 'Projet mis à jour avec succès',
        data: updatedProject
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un projet
  static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est le propriétaire du projet
      if (project.professional.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à supprimer ce projet'
        });
        return;
      }

      await Project.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Projet supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Aimer/ne plus aimer un projet
  static async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      // Pour simplifier, on incrémente/décrémente juste le compteur
      // Dans une version plus avancée, on garderait trace des utilisateurs qui ont aimé
      project.likes += 1;
      await project.save();

      res.json({
        success: true,
        message: 'Like ajouté',
        data: { likes: project.likes }
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter un tag produit sur une image
  static async tagProductOnImage(req: Request, res: Response): Promise<void> {
    try {
      const { id, imageIndex } = req.params;
      const { productId } = req.body;
      const userId = (req as any).user.userId;

      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Le champ productId est requis'
        });
        return;
      }

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      if (project.professional.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier ce projet'
        });
        return;
      }

      const idx = Number(imageIndex);
      if (isNaN(idx) || idx < 0 || idx >= project.images.length) {
        res.status(400).json({
          success: false,
          message: 'Index d\'image invalide'
        });
        return;
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      const image = project.images[idx];
      if (!image.products) {
        image.products = [];
      }

      const alreadyTagged = image.products.some(
        (p: mongoose.Types.ObjectId) => p.toString() === productId
      );
      if (alreadyTagged) {
        res.status(409).json({
          success: false,
          message: 'Ce produit est déjà tagué sur cette image'
        });
        return;
      }

      image.products.push(new mongoose.Types.ObjectId(productId));
      await project.save();

      res.status(200).json({
        success: true,
        message: 'Produit tagué sur l\'image avec succès',
        data: image
      });
    } catch (error) {
      console.error('Erreur lors du tag produit sur l\'image:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un tag produit d'une image
  static async removeProductTag(req: Request, res: Response): Promise<void> {
    try {
      const { id, imageIndex, productId } = req.params;
      const userId = (req as any).user.userId;

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      if (project.professional.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier ce projet'
        });
        return;
      }

      const idx = Number(imageIndex);
      if (isNaN(idx) || idx < 0 || idx >= project.images.length) {
        res.status(400).json({
          success: false,
          message: 'Index d\'image invalide'
        });
        return;
      }

      const image = project.images[idx];
      if (!image.products) {
        image.products = [];
      }

      const productIndex = image.products.findIndex(
        (p: mongoose.Types.ObjectId) => p.toString() === productId
      );
      if (productIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Tag produit non trouvé sur cette image'
        });
        return;
      }

      image.products.splice(productIndex, 1);
      await project.save();

      res.json({
        success: true,
        message: 'Tag produit supprimé avec succès',
        data: image
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du tag produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les produits tagués sur une image
  static async getImageProducts(req: Request, res: Response): Promise<void> {
    try {
      const { id, imageIndex } = req.params;

      const project = await Project.findById(id).populate('images.products');
      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
        return;
      }

      const idx = Number(imageIndex);
      if (isNaN(idx) || idx < 0 || idx >= project.images.length) {
        res.status(400).json({
          success: false,
          message: 'Index d\'image invalide'
        });
        return;
      }

      const image = project.images[idx];

      res.json({
        success: true,
        data: image.products || []
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits de l\'image:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les projets d'un professionnel
  static async getProfessionalProjects(req: Request, res: Response): Promise<void> {
    try {
      const { professionalId } = req.params;
      const { page = 1, limit = 12 } = req.query;

      const projects = await Project.find({
        professional: professionalId,
        status: 'published'
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Project.countDocuments({
        professional: professionalId,
        status: 'published'
      });

      res.json({
        success: true,
        data: projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des projets du professionnel:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
