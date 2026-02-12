import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import PosSale from '../models/PosSale';
import Product from '../models/Product';
import Notification from '../models/Notification';

export class PosController {
  // Créer une vente POS
  static async createSale(req: Request, res: Response): Promise<void> {
    try {
      const { items, payment, customer, notes, discount = 0, taxRate = 0.20 } = req.body;
      const sellerId = req.user!.userId;

      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({
          success: false,
          message: 'La vente doit contenir au moins un article'
        });
        return;
      }

      if (!payment || !payment.method) {
        res.status(400).json({
          success: false,
          message: 'Le mode de paiement est requis'
        });
        return;
      }

      // Vérifier les produits et calculer les totaux
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await Product.findOne({ _id: item.productId, seller: sellerId });

        if (!product) {
          res.status(404).json({
            success: false,
            message: `Produit ${item.productId} non trouvé ou ne vous appartient pas`
          });
          return;
        }

        if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
          res.status(400).json({
            success: false,
            message: `Stock insuffisant pour ${product.name} (disponible: ${product.inventory.quantity})`
          });
          return;
        }

        const itemTotal = product.price.amount * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          product: product._id,
          name: product.name,
          sku: product.inventory.sku,
          quantity: item.quantity,
          unitPrice: product.price.amount,
          total: itemTotal
        });

        // Déduire le stock
        if (product.inventory.trackInventory) {
          product.inventory.quantity -= item.quantity;
          if (product.inventory.quantity === 0) {
            product.status = 'out-of-stock';
          }
          product.sales += item.quantity;
          await product.save();
        }
      }

      const tax = subtotal * taxRate;
      const total = subtotal + tax - discount;

      // Générer un numéro de vente unique
      const saleNumber = `POS-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      // Calculer la monnaie à rendre si paiement en espèces
      let changeGiven = 0;
      if (payment.method === 'cash' && payment.cashReceived) {
        changeGiven = payment.cashReceived - total;
        if (changeGiven < 0) {
          res.status(400).json({
            success: false,
            message: 'Le montant reçu est insuffisant'
          });
          return;
        }
      }

      const sale = new PosSale({
        saleNumber,
        seller: sellerId,
        items: processedItems,
        totals: {
          subtotal,
          tax,
          taxRate,
          discount,
          total,
          currency: 'EUR'
        },
        payment: {
          method: payment.method,
          cashReceived: payment.cashReceived,
          changeGiven,
          cardReference: payment.cardReference
        },
        customer: customer || undefined,
        notes,
        status: 'completed'
      });

      await sale.save();

      res.status(201).json({
        success: true,
        message: 'Vente enregistrée avec succès',
        data: sale
      });
    } catch (error) {
      console.error('Erreur lors de la création de la vente POS:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Lister les ventes POS du professionnel
  static async getSales(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { status, paymentMethod, dateFrom, dateTo, search } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };

      if (status) filter.status = status;
      if (paymentMethod) filter['payment.method'] = paymentMethod;

      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom as string);
        if (dateTo) (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo as string);
      }

      if (search) {
        filter.$or = [
          { saleNumber: { $regex: search, $options: 'i' } },
          { 'customer.name': { $regex: search, $options: 'i' } },
          { 'items.name': { $regex: search, $options: 'i' } }
        ];
      }

      const [sales, total] = await Promise.all([
        PosSale.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        PosSale.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: sales,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes POS:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir une vente spécifique
  static async getSale(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const sale = await PosSale.findOne({ _id: req.params.id, seller: sellerId })
        .populate('items.product', 'name images category');

      if (!sale) {
        res.status(404).json({
          success: false,
          message: 'Vente non trouvée'
        });
        return;
      }

      res.json({
        success: true,
        data: sale
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la vente POS:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Tableau de bord POS - statistiques
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [todaySales, monthSales, lowStockProducts, recentSales] = await Promise.all([
        // Ventes du jour
        PosSale.aggregate([
          { $match: { seller: new mongoose.Types.ObjectId(sellerId), createdAt: { $gte: today }, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totals.total' }, count: { $sum: 1 } } }
        ]),
        // Ventes du mois
        PosSale.aggregate([
          { $match: { seller: new mongoose.Types.ObjectId(sellerId), createdAt: { $gte: startOfMonth }, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totals.total' }, count: { $sum: 1 } } }
        ]),
        // Produits en rupture ou stock faible
        Product.find({
          seller: sellerId,
          'inventory.trackInventory': true,
          'inventory.quantity': { $lte: 5 }
        }).select('name inventory.quantity inventory.sku status').limit(10),
        // Dernières ventes
        PosSale.find({ seller: sellerId })
          .sort({ createdAt: -1 })
          .limit(5)
      ]);

      res.json({
        success: true,
        data: {
          today: {
            total: todaySales[0]?.total || 0,
            count: todaySales[0]?.count || 0
          },
          month: {
            total: monthSales[0]?.total || 0,
            count: monthSales[0]?.count || 0
          },
          lowStockProducts,
          recentSales
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du dashboard POS:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Ajuster le stock d'un produit
  static async adjustStock(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { productId, adjustment, reason } = req.body;

      if (!productId || adjustment === undefined) {
        res.status(400).json({
          success: false,
          message: 'L\'ID du produit et l\'ajustement sont requis'
        });
        return;
      }

      const product = await Product.findOne({ _id: productId, seller: sellerId });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      const newQuantity = product.inventory.quantity + adjustment;
      if (newQuantity < 0) {
        res.status(400).json({
          success: false,
          message: `Stock insuffisant. Stock actuel: ${product.inventory.quantity}`
        });
        return;
      }

      product.inventory.quantity = newQuantity;

      // Mettre à jour le statut en fonction du stock
      if (newQuantity === 0) {
        product.status = 'out-of-stock';
      } else if (product.status === 'out-of-stock') {
        product.status = 'active';
      }

      await product.save();

      res.json({
        success: true,
        message: `Stock ajusté avec succès (${adjustment > 0 ? '+' : ''}${adjustment}). Nouveau stock: ${newQuantity}`,
        data: {
          product: product._id,
          name: product.name,
          previousQuantity: product.inventory.quantity - adjustment,
          adjustment,
          newQuantity,
          reason
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajustement du stock:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les produits avec leur stock pour le POS
  static async getStockList(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;
      const { search, stockStatus, category } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };

      if (category) filter.category = category;

      if (stockStatus === 'low') {
        filter['inventory.quantity'] = { $gt: 0, $lte: 5 };
      } else if (stockStatus === 'out') {
        filter['inventory.quantity'] = 0;
      } else if (stockStatus === 'ok') {
        filter['inventory.quantity'] = { $gt: 5 };
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { 'inventory.sku': { $regex: search, $options: 'i' } }
        ];
      }

      const [products, total] = await Promise.all([
        Product.find(filter)
          .select('name category price.amount inventory status images brand')
          .sort({ 'inventory.quantity': 1 })
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du stock:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Recherche rapide de produits pour le POS (par nom ou SKU)
  static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const query = req.query.q as string;

      if (!query || query.length < 2) {
        res.json({ success: true, data: [] });
        return;
      }

      const products = await Product.find({
        seller: sellerId,
        status: { $in: ['active', 'out-of-stock'] },
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { 'inventory.sku': { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      })
        .select('name price.amount inventory.quantity inventory.sku category images')
        .limit(10);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Erreur lors de la recherche POS:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Rembourser une vente
  static async refundSale(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const sale = await PosSale.findOne({ _id: req.params.id, seller: sellerId });

      if (!sale) {
        res.status(404).json({
          success: false,
          message: 'Vente non trouvée'
        });
        return;
      }

      if (sale.status === 'refunded') {
        res.status(400).json({
          success: false,
          message: 'Cette vente a déjà été remboursée'
        });
        return;
      }

      // Remettre les produits en stock
      for (const item of sale.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'inventory.quantity': item.quantity, sales: -item.quantity }
        });
        // Remettre le produit actif si nécessaire
        await Product.findOneAndUpdate(
          { _id: item.product, status: 'out-of-stock' },
          { status: 'active' }
        );
      }

      sale.status = 'refunded';
      await sale.save();

      res.json({
        success: true,
        message: 'Vente remboursée et stock restauré',
        data: sale
      });
    } catch (error) {
      console.error('Erreur lors du remboursement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Recherche par code-barres (22.44)
  static async searchByBarcode(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const barcode = req.query.code as string;

      if (!barcode) {
        res.json({ success: true, data: [] });
        return;
      }

      const product = await Product.findOne({
        seller: sellerId,
        barcode: barcode,
        status: { $in: ['active', 'out-of-stock'] }
      }).select('name price.amount inventory.quantity inventory.sku category images barcode');

      if (!product) {
        res.json({ success: true, data: [] });
        return;
      }

      res.json({ success: true, data: [product] });
    } catch (error) {
      console.error('Erreur lors de la recherche par code-barres:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Vérifier les alertes de réapprovisionnement (22.43)
  static async checkRestockAlerts(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const threshold = parseInt(req.query.threshold as string) || 5;

      const lowStockProducts = await Product.find({
        seller: sellerId,
        'inventory.trackInventory': true,
        'inventory.quantity': { $lte: threshold }
      }).select('name inventory.quantity inventory.sku category status');

      // Créer des notifications pour les produits en rupture ou faible
      const alerts = [];
      for (const product of lowStockProducts) {
        const isOutOfStock = product.inventory.quantity === 0;
        alerts.push({
          product: product._id,
          name: product.name,
          sku: product.inventory.sku,
          quantity: product.inventory.quantity,
          level: isOutOfStock ? 'critical' : 'warning',
          message: isOutOfStock
            ? `${product.name} est en rupture de stock`
            : `${product.name} — stock faible (${product.inventory.quantity} restants)`
        });

        // Créer une notification système
        await Notification.findOneAndUpdate(
          {
            recipient: sellerId,
            type: 'system',
            'metadata.productId': (product._id as mongoose.Types.ObjectId).toString(),
            'metadata.alertType': 'restock',
            read: false
          },
          {
            recipient: sellerId,
            type: 'system',
            title: isOutOfStock ? 'Rupture de stock' : 'Stock faible',
            content: isOutOfStock
              ? `${product.name} (${product.inventory.sku}) est en rupture de stock. Réapprovisionnement nécessaire.`
              : `${product.name} (${product.inventory.sku}) n'a plus que ${product.inventory.quantity} unités en stock.`,
            link: '/dashboard/pro/pos/stock',
            metadata: { productId: (product._id as mongoose.Types.ObjectId).toString(), alertType: 'restock', quantity: product.inventory.quantity }
          },
          { upsert: true, new: true }
        );
      }

      res.json({
        success: true,
        data: {
          totalAlerts: alerts.length,
          critical: alerts.filter(a => a.level === 'critical').length,
          warning: alerts.filter(a => a.level === 'warning').length,
          alerts
        }
      });
    } catch (error) {
      console.error('Erreur lors de la vérification des alertes:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Rapports financiers (22.45)
  static async getFinancialReports(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
      const period = (req.query.period as string) || 'month';

      const now = new Date();
      let startDate: Date;

      if (period === 'day') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === 'week') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const [salesStats, dailySales, topProducts, paymentBreakdown] = await Promise.all([
        // Stats globales de la période
        PosSale.aggregate([
          { $match: { seller: sellerObjectId, createdAt: { $gte: startDate }, status: 'completed' } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totals.total' },
              totalTax: { $sum: '$totals.tax' },
              totalDiscount: { $sum: '$totals.discount' },
              salesCount: { $sum: 1 },
              avgBasket: { $avg: '$totals.total' },
              totalItems: { $sum: { $size: '$items' } }
            }
          }
        ]),
        // Ventes par jour
        PosSale.aggregate([
          { $match: { seller: sellerObjectId, createdAt: { $gte: startDate }, status: 'completed' } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              revenue: { $sum: '$totals.total' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        // Top produits vendus
        PosSale.aggregate([
          { $match: { seller: sellerObjectId, createdAt: { $gte: startDate }, status: 'completed' } },
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.product',
              name: { $first: '$items.name' },
              totalQuantity: { $sum: '$items.quantity' },
              totalRevenue: { $sum: '$items.total' }
            }
          },
          { $sort: { totalRevenue: -1 } },
          { $limit: 10 }
        ]),
        // Répartition par mode de paiement
        PosSale.aggregate([
          { $match: { seller: sellerObjectId, createdAt: { $gte: startDate }, status: 'completed' } },
          {
            $group: {
              _id: '$payment.method',
              count: { $sum: 1 },
              total: { $sum: '$totals.total' }
            }
          }
        ])
      ]);

      res.json({
        success: true,
        data: {
          period,
          startDate,
          endDate: now,
          summary: {
            totalRevenue: salesStats[0]?.totalRevenue || 0,
            totalTax: salesStats[0]?.totalTax || 0,
            totalDiscount: salesStats[0]?.totalDiscount || 0,
            salesCount: salesStats[0]?.salesCount || 0,
            avgBasket: salesStats[0]?.avgBasket || 0,
            totalItems: salesStats[0]?.totalItems || 0,
            revenueHT: (salesStats[0]?.totalRevenue || 0) - (salesStats[0]?.totalTax || 0)
          },
          dailySales,
          topProducts,
          paymentBreakdown
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération des rapports financiers:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Export comptable FEC/CSV (22.49)
  static async exportAccounting(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const format = (req.query.format as string) || 'csv';
      const { dateFrom, dateTo } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId, status: 'completed' };
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom as string);
        if (dateTo) (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo as string);
      }

      const sales = await PosSale.find(filter).sort({ createdAt: 1 });

      if (format === 'fec') {
        // Format FEC (Fichier des Écritures Comptables)
        const header = 'JournalCode|JournalLib|EcritureNum|EcritureDate|CompteNum|CompteLib|CompAuxNum|CompAuxLib|PieceRef|PieceDate|EcritureLib|Debit|Credit|EcritureLet|DateLet|ValidDate|Montantdevise|Idevise';
        const lines = sales.map((sale, index) => {
          const date = new Date(sale.createdAt).toISOString().split('T')[0].replace(/-/g, '');
          const num = String(index + 1).padStart(6, '0');
          return [
            `VE|Ventes|${num}|${date}|411000|Clients|${sale.customer?.name || 'COMPTOIR'}||${sale.saleNumber}|${date}|${sale.saleNumber}|${sale.totals.total.toFixed(2)}|0.00||||${sale.totals.total.toFixed(2)}|EUR`,
            `VE|Ventes|${num}|${date}|707000|Ventes de marchandises|||${sale.saleNumber}|${date}|${sale.saleNumber}|0.00|${sale.totals.subtotal.toFixed(2)}||||${sale.totals.subtotal.toFixed(2)}|EUR`,
            `VE|Ventes|${num}|${date}|445710|TVA collectée|||${sale.saleNumber}|${date}|${sale.saleNumber}|0.00|${sale.totals.tax.toFixed(2)}||||${sale.totals.tax.toFixed(2)}|EUR`
          ].join('\n');
        });

        const content = [header, ...lines].join('\n');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=FEC_export.txt');
        res.send(content);
      } else {
        // Format CSV
        const header = 'Date,N° Vente,Client,Mode Paiement,Sous-total,TVA,Remise,Total,Devise';
        const lines = sales.map(sale => {
          const date = new Date(sale.createdAt).toLocaleDateString('fr-FR');
          const customerName = (sale.customer?.name || 'Comptoir').replace(/,/g, ' ');
          return `${date},${sale.saleNumber},${customerName},${sale.payment.method},${sale.totals.subtotal.toFixed(2)},${sale.totals.tax.toFixed(2)},${sale.totals.discount.toFixed(2)},${sale.totals.total.toFixed(2)},${sale.totals.currency}`;
        });

        const content = [header, ...lines].join('\n');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=ventes_export.csv');
        res.send(content);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export comptable:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
