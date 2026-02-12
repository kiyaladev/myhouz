import { Request, Response } from 'express';
import LoyaltyProgram from '../models/LoyaltyProgram';

export class LoyaltyController {
  // Créer ou trouver un programme de fidélité client
  static async addCustomer(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { name, email, phone } = req.body;

      if (!name) {
        res.status(400).json({ success: false, message: 'Le nom du client est requis' });
        return;
      }

      // Vérifier si le client existe déjà (par téléphone ou email)
      const filter: Record<string, unknown> = { seller: sellerId };
      if (phone) {
        filter['customer.phone'] = phone;
      } else if (email) {
        filter['customer.email'] = email;
      } else {
        res.status(400).json({ success: false, message: 'Un email ou un téléphone est requis' });
        return;
      }

      let loyalty = await LoyaltyProgram.findOne(filter);
      if (loyalty) {
        res.status(400).json({ success: false, message: 'Ce client est déjà inscrit au programme de fidélité' });
        return;
      }

      loyalty = new LoyaltyProgram({
        seller: sellerId,
        customer: { name, email, phone },
        points: 0,
        totalPointsEarned: 0,
        totalPointsSpent: 0,
        history: [],
        tier: 'bronze'
      });

      await loyalty.save();

      res.status(201).json({
        success: true,
        message: 'Client ajouté au programme de fidélité',
        data: loyalty
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client fidélité:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Lister les clients fidélité
  static async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { search, tier } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };
      if (tier) filter.tier = tier;
      if (search) {
        filter.$or = [
          { 'customer.name': { $regex: search, $options: 'i' } },
          { 'customer.email': { $regex: search, $options: 'i' } },
          { 'customer.phone': { $regex: search, $options: 'i' } }
        ];
      }

      const [customers, total] = await Promise.all([
        LoyaltyProgram.find(filter).sort({ points: -1 }).skip(skip).limit(limit),
        LoyaltyProgram.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: customers,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des clients fidélité:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Obtenir un client fidélité
  static async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const loyalty = await LoyaltyProgram.findOne({ _id: req.params.id, seller: sellerId });

      if (!loyalty) {
        res.status(404).json({ success: false, message: 'Client fidélité non trouvé' });
        return;
      }

      res.json({ success: true, data: loyalty });
    } catch (error) {
      console.error('Erreur lors de la récupération du client fidélité:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Ajouter des points
  static async addPoints(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { points, description, saleId } = req.body;

      if (!points || points <= 0) {
        res.status(400).json({ success: false, message: 'Le nombre de points doit être positif' });
        return;
      }

      const loyalty = await LoyaltyProgram.findOne({ _id: req.params.id, seller: sellerId });
      if (!loyalty) {
        res.status(404).json({ success: false, message: 'Client fidélité non trouvé' });
        return;
      }

      loyalty.points += points;
      loyalty.totalPointsEarned += points;
      loyalty.history.push({
        type: 'earn',
        points,
        description: description || `+${points} points`,
        sale: saleId || undefined,
        date: new Date()
      });

      // Mise à jour du tier
      if (loyalty.totalPointsEarned >= 5000) loyalty.tier = 'platinum';
      else if (loyalty.totalPointsEarned >= 2000) loyalty.tier = 'gold';
      else if (loyalty.totalPointsEarned >= 500) loyalty.tier = 'silver';

      await loyalty.save();

      res.json({
        success: true,
        message: `${points} points ajoutés avec succès`,
        data: loyalty
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de points:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Utiliser des points (remise)
  static async spendPoints(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { points, description } = req.body;

      if (!points || points <= 0) {
        res.status(400).json({ success: false, message: 'Le nombre de points doit être positif' });
        return;
      }

      const loyalty = await LoyaltyProgram.findOne({ _id: req.params.id, seller: sellerId });
      if (!loyalty) {
        res.status(404).json({ success: false, message: 'Client fidélité non trouvé' });
        return;
      }

      if (loyalty.points < points) {
        res.status(400).json({ success: false, message: `Points insuffisants. Solde actuel: ${loyalty.points}` });
        return;
      }

      loyalty.points -= points;
      loyalty.totalPointsSpent += points;
      loyalty.history.push({
        type: 'spend',
        points,
        description: description || `-${points} points utilisés`,
        date: new Date()
      });

      await loyalty.save();

      res.json({
        success: true,
        message: `${points} points utilisés avec succès`,
        data: loyalty
      });
    } catch (error) {
      console.error('Erreur lors de l\'utilisation des points:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
