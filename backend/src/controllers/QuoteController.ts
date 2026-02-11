import { Request, Response } from 'express';
import Quote from '../models/Quote';

export class QuoteController {
  static async createQuote(req: Request, res: Response): Promise<void> {
    try {
      const { professional, projectDescription, category, budget, timeline } = req.body;
      const clientId = (req as any).user?.id;

      if (!clientId) {
        res.status(401).json({ success: false, message: 'Non autorisé' });
        return;
      }

      if (!professional || !projectDescription || !category) {
        res.status(400).json({ success: false, message: 'Champs requis manquants' });
        return;
      }

      const quote = new Quote({
        client: clientId,
        professional,
        projectDescription,
        category,
        budget,
        timeline,
      });

      await quote.save();

      res.status(201).json({ success: true, data: quote, message: 'Demande de devis envoyée' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  static async getMyQuotes(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const quotes = await Quote.find({ client: userId })
        .populate('professional', 'firstName lastName professionalInfo')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: quotes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  static async getReceivedQuotes(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const quotes = await Quote.find({ professional: userId })
        .populate('client', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: quotes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  static async respondToQuote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { response, status } = req.body;
      const userId = (req as any).user?.id;

      const quote = await Quote.findById(id);
      if (!quote) {
        res.status(404).json({ success: false, message: 'Devis non trouvé' });
        return;
      }

      if (quote.professional.toString() !== userId) {
        res.status(403).json({ success: false, message: 'Non autorisé' });
        return;
      }

      quote.response = response;
      quote.status = status || 'responded';
      await quote.save();

      res.json({ success: true, data: quote, message: 'Réponse envoyée' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
