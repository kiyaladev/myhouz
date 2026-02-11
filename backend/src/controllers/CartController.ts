import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart';
import { Product } from '../models';

export class CartController {
  // Obtenir le panier de l'utilisateur
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      let cart = await Cart.findOne({ user: userId })
        .populate({
          path: 'items.product',
          select: 'name price images inventory slug brand'
        });

      if (!cart) {
        // Créer un panier vide si aucun n'existe
        cart = new Cart({ user: userId, items: [] });
        await cart.save();
      }

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajouter un produit au panier
  static async addItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId, quantity = 1 } = req.body;

      // Vérifier que le produit existe
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      // Vérifier le stock
      if (product.inventory.quantity < quantity) {
        res.status(400).json({
          success: false,
          message: 'Stock insuffisant'
        });
        return;
      }

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        if (product.inventory.quantity < newQuantity) {
          res.status(400).json({
            success: false,
            message: 'Stock insuffisant pour cette quantité'
          });
          return;
        }
        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Ajouter le nouvel article
        cart.items.push({
          product: product._id as mongoose.Types.ObjectId,
          quantity,
          price: product.price.amount,
          addedAt: new Date()
        });
      }

      await cart.save();

      // Repopuler pour la réponse
      await cart.populate({
        path: 'items.product',
        select: 'name price images inventory slug brand'
      });

      res.json({
        success: true,
        message: 'Produit ajouté au panier',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour la quantité d'un article
  static async updateItemQuantity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        res.status(400).json({
          success: false,
          message: 'La quantité doit être au moins 1'
        });
        return;
      }

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
        return;
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé dans le panier'
        });
        return;
      }

      // Vérifier le stock
      const product = await Product.findById(productId);
      if (!product || product.inventory.quantity < quantity) {
        res.status(400).json({
          success: false,
          message: 'Stock insuffisant'
        });
        return;
      }

      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      await cart.populate({
        path: 'items.product',
        select: 'name price images inventory slug brand'
      });

      res.json({
        success: true,
        message: 'Quantité mise à jour',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un article du panier
  static async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { productId } = req.params;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
        return;
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Article non trouvé dans le panier'
        });
        return;
      }

      cart.items.splice(itemIndex, 1);
      await cart.save();

      await cart.populate({
        path: 'items.product',
        select: 'name price images inventory slug brand'
      });

      res.json({
        success: true,
        message: 'Article retiré du panier',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Vider le panier
  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
        return;
      }

      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();

      res.json({
        success: true,
        message: 'Panier vidé',
        data: cart
      });
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir le nombre d'articles dans le panier
  static async getCartCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      const cart = await Cart.findOne({ user: userId });

      const count = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Erreur lors du comptage des articles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
