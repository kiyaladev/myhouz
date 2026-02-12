import { Request, Response } from 'express';
import crypto from 'crypto';
import ProductReturn from '../models/ProductReturn';
import PosSale from '../models/PosSale';
import Product from '../models/Product';

export class ReturnController {
  // Créer un retour produit
  static async createReturn(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { saleId, items, resolution, customer, notes, taxRate = 0.20 } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ success: false, message: 'Le retour doit contenir au moins un article' });
        return;
      }

      if (!resolution || !['refund', 'exchange', 'credit'].includes(resolution)) {
        res.status(400).json({ success: false, message: 'Le type de résolution est requis (refund, exchange, credit)' });
        return;
      }

      // Vérifier les produits et calculer les totaux
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await Product.findOne({ _id: item.productId, seller: sellerId });
        if (!product) {
          res.status(404).json({ success: false, message: `Produit ${item.productId} non trouvé` });
          return;
        }

        const itemTotal = (item.unitPrice || product.price.amount) * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          product: product._id,
          name: product.name,
          sku: product.inventory.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice || product.price.amount,
          total: itemTotal,
          reason: item.reason || 'Non spécifié'
        });
      }

      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      const returnNumber = `RET-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      const productReturn = new ProductReturn({
        returnNumber,
        seller: sellerId,
        sale: saleId || undefined,
        customer: customer || undefined,
        items: processedItems,
        totals: { subtotal, tax, total, currency: 'EUR' },
        resolution,
        creditAmount: resolution === 'credit' ? total : undefined,
        status: 'pending',
        notes
      });

      await productReturn.save();

      res.status(201).json({
        success: true,
        message: 'Retour créé avec succès',
        data: productReturn
      });
    } catch (error) {
      console.error('Erreur lors de la création du retour:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Lister les retours
  static async getReturns(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { status, resolution, search } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };
      if (status) filter.status = status;
      if (resolution) filter.resolution = resolution;
      if (search) {
        filter.$or = [
          { returnNumber: { $regex: search, $options: 'i' } },
          { 'customer.name': { $regex: search, $options: 'i' } }
        ];
      }

      const [returns, total] = await Promise.all([
        ProductReturn.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        ProductReturn.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: returns,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des retours:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Obtenir un retour spécifique
  static async getReturn(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const productReturn = await ProductReturn.findOne({ _id: req.params.id, seller: sellerId })
        .populate('sale');

      if (!productReturn) {
        res.status(404).json({ success: false, message: 'Retour non trouvé' });
        return;
      }

      res.json({ success: true, data: productReturn });
    } catch (error) {
      console.error('Erreur lors de la récupération du retour:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Approuver un retour (restaure le stock)
  static async approveReturn(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const productReturn = await ProductReturn.findOne({ _id: req.params.id, seller: sellerId });

      if (!productReturn) {
        res.status(404).json({ success: false, message: 'Retour non trouvé' });
        return;
      }

      if (productReturn.status !== 'pending') {
        res.status(400).json({ success: false, message: 'Seuls les retours en attente peuvent être approuvés' });
        return;
      }

      // Restaurer le stock
      for (const item of productReturn.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'inventory.quantity': item.quantity }
        });
        await Product.findOneAndUpdate(
          { _id: item.product, status: 'out-of-stock' },
          { status: 'active' }
        );
      }

      productReturn.status = 'approved';
      await productReturn.save();

      res.json({
        success: true,
        message: 'Retour approuvé et stock restauré',
        data: productReturn
      });
    } catch (error) {
      console.error('Erreur lors de l\'approbation du retour:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Rejeter un retour
  static async rejectReturn(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const productReturn = await ProductReturn.findOne({ _id: req.params.id, seller: sellerId });

      if (!productReturn) {
        res.status(404).json({ success: false, message: 'Retour non trouvé' });
        return;
      }

      if (productReturn.status !== 'pending') {
        res.status(400).json({ success: false, message: 'Seuls les retours en attente peuvent être rejetés' });
        return;
      }

      productReturn.status = 'rejected';
      if (req.body.notes) productReturn.notes = req.body.notes;
      await productReturn.save();

      res.json({
        success: true,
        message: 'Retour rejeté',
        data: productReturn
      });
    } catch (error) {
      console.error('Erreur lors du rejet du retour:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
