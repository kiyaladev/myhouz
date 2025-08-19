import { Request, Response } from 'express';
import { Product } from '../models';
import slugify from 'slugify';

export class ProductController {
  // Créer un nouveau produit
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const userType = (req as any).user.userType;

      // Vérifier que seuls les professionnels peuvent créer des produits
      if (userType !== 'professionnel') {
        res.status(403).json({
          success: false,
          message: 'Seuls les professionnels peuvent créer des produits'
        });
        return;
      }

      // Générer un slug unique
      const baseSlug = slugify(req.body.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await Product.findOne({ 'seo.slug': slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const productData = {
        ...req.body,
        seller: userId,
        seo: {
          ...req.body.seo,
          slug
        }
      };

      const product = new Product(productData);
      await product.save();

      res.status(201).json({
        success: true,
        message: 'Produit créé avec succès',
        data: product
      });
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir tous les produits avec filtres
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const {
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        color,
        material,
        style,
        featured,
        seller,
        search,
        page = 1,
        limit = 20,
        sort = 'createdAt'
      } = req.query;

      const query: any = { status: 'active' };

      // Filtres
      if (category) query.category = category;
      if (subcategory) query.subcategory = subcategory;
      if (brand) query.brand = new RegExp(brand as string, 'i');
      if (seller) query.seller = seller;
      if (featured === 'true') query.featured = true;

      // Filtre de prix
      if (minPrice || maxPrice) {
        query['price.amount'] = {};
        if (minPrice) query['price.amount'].$gte = Number(minPrice);
        if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
      }

      // Filtres par spécifications
      if (color) {
        const colors = Array.isArray(color) ? color : [color];
        query['specifications.color'] = { $in: colors };
      }
      if (material) {
        const materials = Array.isArray(material) ? material : [material];
        query['specifications.material'] = { $in: materials };
      }
      if (style) {
        const styles = Array.isArray(style) ? style : [style];
        query['specifications.style'] = { $in: styles };
      }

      // Recherche textuelle
      if (search) {
        query.$text = { $search: search as string };
      }

      // Options de tri
      const sortOptions: any = {};
      switch (sort) {
        case 'price-asc':
          sortOptions['price.amount'] = 1;
          break;
        case 'price-desc':
          sortOptions['price.amount'] = -1;
          break;
        case 'popular':
          sortOptions.views = -1;
          break;
        case 'rating':
          sortOptions['rating.average'] = -1;
          break;
        case 'recent':
          sortOptions.createdAt = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      const products = await Product.find(query)
        .populate('seller', 'firstName lastName professionalInfo.companyName professionalInfo.rating')
        .sort(sortOptions)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir un produit par ID ou slug
  static async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.params;

      // Essayer de trouver par slug d'abord, puis par ID
      let product = await Product.findOne({ 'seo.slug': identifier, status: 'active' })
        .populate('seller', 'firstName lastName professionalInfo.companyName professionalInfo.rating location');

      if (!product) {
        product = await Product.findOne({ _id: identifier, status: 'active' })
          .populate('seller', 'firstName lastName professionalInfo.companyName professionalInfo.rating location');
      }

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      // Incrémenter les vues
      product.views += 1;
      await product.save();

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour un produit
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est le vendeur du produit
      if (product.seller.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier ce produit'
        });
        return;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('seller', 'firstName lastName professionalInfo.companyName');

      res.json({
        success: true,
        message: 'Produit mis à jour avec succès',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Supprimer un produit
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est le vendeur du produit
      if (product.seller.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à supprimer ce produit'
        });
        return;
      }

      await Product.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Produit supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les produits d'un vendeur
  static async getSellerProducts(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const { page = 1, limit = 12, status = 'active' } = req.query;

      const products = await Product.find({
        seller: sellerId,
        status
      })
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Product.countDocuments({
        seller: sellerId,
        status
      });

      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits du vendeur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les produits similaires
  static async getSimilarProducts(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = 8 } = req.query;

      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      const similarProducts = await Product.find({
        _id: { $ne: id },
        status: 'active',
        $or: [
          { category: product.category },
          { subcategory: product.subcategory },
          { 'specifications.style': { $in: product.specifications.style } },
          { tags: { $in: product.tags } }
        ]
      })
        .limit(Number(limit))
        .sort({ views: -1 });

      res.json({
        success: true,
        data: similarProducts
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits similaires:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour le stock d'un produit
  static async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = (req as any).user.userId;

      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
        return;
      }

      // Vérifier que l'utilisateur est le vendeur du produit
      if (product.seller.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier ce produit'
        });
        return;
      }

      product.inventory.quantity = quantity;
      
      // Mettre à jour le statut si nécessaire
      if (quantity === 0) {
        product.status = 'out-of-stock';
      } else if (product.status === 'out-of-stock') {
        product.status = 'active';
      }

      await product.save();

      res.json({
        success: true,
        message: 'Stock mis à jour avec succès',
        data: {
          quantity: product.inventory.quantity,
          status: product.status
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
