import { Request, Response } from 'express';
import Register from '../models/Register';

export class RegisterController {
  // Créer une caisse
  static async createRegister(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { name, openingBalance, notes } = req.body;

      if (!name) {
        res.status(400).json({ success: false, message: 'Le nom de la caisse est requis' });
        return;
      }

      const register = new Register({
        name,
        seller: sellerId,
        openingBalance: openingBalance || 0,
        notes
      });

      await register.save();

      res.status(201).json({
        success: true,
        message: 'Caisse créée avec succès',
        data: register
      });
    } catch (error) {
      console.error('Erreur lors de la création de la caisse:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Lister les caisses
  static async getRegisters(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { status } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };
      if (status) filter.status = status;

      const registers = await Register.find(filter).sort({ createdAt: -1 });

      res.json({ success: true, data: registers });
    } catch (error) {
      console.error('Erreur lors de la récupération des caisses:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Ouvrir une caisse
  static async openRegister(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const register = await Register.findOne({ _id: req.params.id, seller: sellerId });

      if (!register) {
        res.status(404).json({ success: false, message: 'Caisse non trouvée' });
        return;
      }

      if (register.status === 'open') {
        res.status(400).json({ success: false, message: 'Cette caisse est déjà ouverte' });
        return;
      }

      const { openingBalance } = req.body;
      register.status = 'open';
      register.openedAt = new Date();
      register.closedAt = undefined;
      register.openingBalance = openingBalance || 0;
      register.closingBalance = undefined;
      register.salesCount = 0;
      register.totalSales = 0;

      await register.save();

      res.json({
        success: true,
        message: 'Caisse ouverte avec succès',
        data: register
      });
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la caisse:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Fermer une caisse
  static async closeRegister(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const register = await Register.findOne({ _id: req.params.id, seller: sellerId });

      if (!register) {
        res.status(404).json({ success: false, message: 'Caisse non trouvée' });
        return;
      }

      if (register.status === 'closed') {
        res.status(400).json({ success: false, message: 'Cette caisse est déjà fermée' });
        return;
      }

      const { closingBalance, notes } = req.body;
      register.status = 'closed';
      register.closedAt = new Date();
      register.closingBalance = closingBalance || 0;
      if (notes) register.notes = notes;

      await register.save();

      res.json({
        success: true,
        message: 'Caisse fermée avec succès',
        data: register
      });
    } catch (error) {
      console.error('Erreur lors de la fermeture de la caisse:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Supprimer une caisse
  static async deleteRegister(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const register = await Register.findOne({ _id: req.params.id, seller: sellerId });

      if (!register) {
        res.status(404).json({ success: false, message: 'Caisse non trouvée' });
        return;
      }

      if (register.status === 'open') {
        res.status(400).json({ success: false, message: 'Impossible de supprimer une caisse ouverte. Fermez-la d\'abord.' });
        return;
      }

      await Register.findOneAndDelete({ _id: req.params.id, seller: sellerId });

      res.json({ success: true, message: 'Caisse supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la caisse:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
