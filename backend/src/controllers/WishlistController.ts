import { Request, Response } from 'express';
import { Product } from '../models';
import Wishlist from '../models/Wishlist';

export class WishlistController {
  // Obtenir toutes les wishlists de l'utilisateur
  static async getWishlists(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const wishlists = await Wishlist.find({ user: userId })
        .populate('items.product', 'name images price rating seo')
        .sort({ isDefault: -1, updatedAt: -1 });

      res.json({
        success: true,
        data: wishlists
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des wishlists:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir une wishlist par ID
  static async getWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const wishlist = await Wishlist.findOne({ _id: id, user: userId })
        .populate('items.product', 'name images price rating seo category brand');

      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Liste de souhaits non trouvée'
        });
        return;
      }

      res.json({
        success: true,
        data: wishlist
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Créer une wishlist
  static async createWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { name } = req.body;

      const wishlist = new Wishlist({
        user: userId,
        name: name || 'Ma liste de souhaits',
        items: [],
        isDefault: false
      });

      // Si c'est la première wishlist, la marquer comme défaut
      const existingCount = await Wishlist.countDocuments({ user: userId });
      if (existingCount === 0) {
        wishlist.isDefault = true;
      }

      await wishlist.save();

      res.status(201).json({
        success: true,
        message: 'Liste de souhaits créée avec succès',
        data: wishlist
      });
    } catch (error) {
      console.error('Erreur lors de la création de la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter un produit à une wishlist
  static async addItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      const { productId, note } = req.body;

      // Vérifier que le produit existe
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      let wishlist = await Wishlist.findOne({ _id: id, user: userId });
      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Liste de souhaits non trouvée'
        });
        return;
      }

      // Vérifier si le produit est déjà dans la liste
      const existingItem = wishlist.items.find(
        (item: any) => item.product.toString() === productId
      );
      if (existingItem) {
        res.status(400).json({
          success: false,
          message: 'Ce produit est déjà dans la liste de souhaits'
        });
        return;
      }

      wishlist.items.push({
        product: productId,
        addedAt: new Date(),
        note
      });

      await wishlist.save();

      wishlist = await Wishlist.findById(id)
        .populate('items.product', 'name images price rating seo');

      res.json({
        success: true,
        message: 'Produit ajouté à la liste de souhaits',
        data: wishlist
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Retirer un produit d'une wishlist
  static async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id, productId } = req.params;

      const wishlist = await Wishlist.findOne({ _id: id, user: userId });
      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Liste de souhaits non trouvée'
        });
        return;
      }

      wishlist.items = wishlist.items.filter(
        (item: any) => item.product.toString() !== productId
      );

      await wishlist.save();

      res.json({
        success: true,
        message: 'Produit retiré de la liste de souhaits',
        data: wishlist
      });
    } catch (error) {
      console.error('Erreur lors du retrait de la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer une wishlist
  static async deleteWishlist(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      const wishlist = await Wishlist.findOne({ _id: id, user: userId });
      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Liste de souhaits non trouvée'
        });
        return;
      }

      if (wishlist.isDefault) {
        res.status(400).json({
          success: false,
          message: 'Impossible de supprimer la liste par défaut'
        });
        return;
      }

      await Wishlist.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Liste de souhaits supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter rapidement à la wishlist par défaut
  static async quickAdd(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { productId } = req.body;

      // Vérifier que le produit existe
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      // Trouver ou créer la wishlist par défaut
      let defaultWishlist = await Wishlist.findOne({ user: userId, isDefault: true });
      if (!defaultWishlist) {
        defaultWishlist = new Wishlist({
          user: userId,
          name: 'Ma liste de souhaits',
          items: [],
          isDefault: true
        });
      }

      // Vérifier si déjà présent
      const existingItem = defaultWishlist.items.find(
        (item: any) => item.product.toString() === productId
      );

      if (existingItem) {
        // Si déjà présent, le retirer (toggle)
        defaultWishlist.items = defaultWishlist.items.filter(
          (item: any) => item.product.toString() !== productId
        );
        await defaultWishlist.save();

        res.json({
          success: true,
          message: 'Produit retiré de la liste de souhaits',
          data: { inWishlist: false }
        });
        return;
      }

      defaultWishlist.items.push({
        product: productId,
        addedAt: new Date()
      });

      await defaultWishlist.save();

      res.json({
        success: true,
        message: 'Produit ajouté à la liste de souhaits',
        data: { inWishlist: true }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout rapide à la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Vérifier si un produit est dans une wishlist
  static async checkProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { productId } = req.params;

      const wishlist = await Wishlist.findOne({
        user: userId,
        'items.product': productId
      });

      res.json({
        success: true,
        data: { inWishlist: !!wishlist }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de la wishlist:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
