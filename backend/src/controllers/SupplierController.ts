import { Request, Response } from 'express';
import Supplier from '../models/Supplier';

export class SupplierController {
  // Créer un fournisseur
  static async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { name, contact, company, siret, categories, notes } = req.body;

      if (!name) {
        res.status(400).json({ success: false, message: 'Le nom du fournisseur est requis' });
        return;
      }

      const supplier = new Supplier({
        name,
        contact: contact || {},
        company,
        siret,
        categories: categories || [],
        notes,
        seller: sellerId
      });

      await supplier.save();

      res.status(201).json({
        success: true,
        message: 'Fournisseur créé avec succès',
        data: supplier
      });
    } catch (error) {
      console.error('Erreur lors de la création du fournisseur:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Lister les fournisseurs
  static async getSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { search, category } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };

      if (category) filter.categories = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } }
        ];
      }

      const [suppliers, total] = await Promise.all([
        Supplier.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Supplier.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: suppliers,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Obtenir un fournisseur
  static async getSupplier(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const supplier = await Supplier.findOne({ _id: req.params.id, seller: sellerId });

      if (!supplier) {
        res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        return;
      }

      res.json({ success: true, data: supplier });
    } catch (error) {
      console.error('Erreur lors de la récupération du fournisseur:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Modifier un fournisseur
  static async updateSupplier(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const supplier = await Supplier.findOne({ _id: req.params.id, seller: sellerId });

      if (!supplier) {
        res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        return;
      }

      const { name, contact, company, siret, categories, notes } = req.body;
      if (name) supplier.name = name;
      if (contact) supplier.contact = contact;
      if (company !== undefined) supplier.company = company;
      if (siret !== undefined) supplier.siret = siret;
      if (categories) supplier.categories = categories;
      if (notes !== undefined) supplier.notes = notes;

      await supplier.save();

      res.json({
        success: true,
        message: 'Fournisseur mis à jour avec succès',
        data: supplier
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du fournisseur:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Supprimer un fournisseur
  static async deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, seller: sellerId });

      if (!supplier) {
        res.status(404).json({ success: false, message: 'Fournisseur non trouvé' });
        return;
      }

      res.json({ success: true, message: 'Fournisseur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du fournisseur:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
