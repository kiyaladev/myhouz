import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Invoice from '../models/Invoice';
import PosSale from '../models/PosSale';

export class InvoiceController {
  // Créer une facture
  static async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const { saleId, customer, items, payment, notes, dueDate, sellerInfo } = req.body;

      if (!customer || !customer.name) {
        res.status(400).json({
          success: false,
          message: 'Le nom du client est requis'
        });
        return;
      }

      if (!sellerInfo || !sellerInfo.companyName) {
        res.status(400).json({
          success: false,
          message: 'Le nom de l\'entreprise du vendeur est requis'
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

      let invoiceItems = items;
      let saleRef: mongoose.Types.ObjectId | undefined;

      // Si saleId fourni, auto-remplir depuis la vente POS
      if (saleId) {
        const sale = await PosSale.findOne({ _id: saleId, seller: sellerId });
        if (!sale) {
          res.status(404).json({
            success: false,
            message: 'Vente POS non trouvée'
          });
          return;
        }
        saleRef = sale._id as mongoose.Types.ObjectId;
        invoiceItems = sale.items.map(item => ({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total
        }));
      }

      if (!invoiceItems || !Array.isArray(invoiceItems) || invoiceItems.length === 0) {
        res.status(400).json({
          success: false,
          message: 'La facture doit contenir au moins un article'
        });
        return;
      }

      // Calculer les totaux côté serveur
      invoiceItems = invoiceItems.map((item: { description: string; quantity: number; unitPrice: number; total?: number }) => ({
        ...item,
        total: item.quantity * item.unitPrice
      }));
      const subtotal = invoiceItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
      const taxRate = req.body.taxRate ?? 0.20;
      const tax = subtotal * taxRate;
      const discount = req.body.discount ?? 0;
      const total = subtotal + tax - discount;

      // Générer le numéro de facture séquentiel par vendeur
      const year = new Date().getFullYear();
      const lastInvoice = await Invoice.findOne({
        seller: sellerId,
        invoiceNumber: { $regex: `^FAC-${year}-` }
      }).sort({ invoiceNumber: -1 });

      let sequence = 1;
      if (lastInvoice) {
        const lastNum = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10);
        if (!isNaN(lastNum)) {
          sequence = lastNum + 1;
        }
      }
      const invoiceNumber = `FAC-${year}-${String(sequence).padStart(6, '0')}`;

      const invoice = new Invoice({
        invoiceNumber,
        seller: sellerId,
        sale: saleRef,
        customer,
        items: invoiceItems,
        totals: {
          subtotal,
          taxRate,
          tax,
          discount,
          total,
          currency: 'EUR'
        },
        payment: {
          method: payment.method,
          paid: payment.paid || false,
          paidAt: payment.paid ? new Date() : undefined,
          reference: payment.reference
        },
        notes,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        sellerInfo,
        status: payment.paid ? 'paid' : 'draft'
      });

      await invoice.save();

      res.status(201).json({
        success: true,
        message: 'Facture créée avec succès',
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Lister les factures avec pagination et filtres
  static async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { status, dateFrom, dateTo, search } = req.query;

      const filter: Record<string, unknown> = { seller: sellerId };

      if (status) filter.status = status;

      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) (filter.createdAt as Record<string, unknown>).$gte = new Date(dateFrom as string);
        if (dateTo) (filter.createdAt as Record<string, unknown>).$lte = new Date(dateTo as string);
      }

      if (search) {
        filter.$or = [
          { invoiceNumber: { $regex: search, $options: 'i' } },
          { 'customer.name': { $regex: search, $options: 'i' } }
        ];
      }

      const [invoices, total] = await Promise.all([
        Invoice.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Invoice.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir une facture spécifique
  static async getInvoice(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const invoice = await Invoice.findOne({ _id: req.params.id, seller: sellerId })
        .populate('sale');

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Facture non trouvée'
        });
        return;
      }

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour une facture brouillon
  static async updateInvoice(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const invoice = await Invoice.findOne({ _id: req.params.id, seller: sellerId });

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Facture non trouvée'
        });
        return;
      }

      if (invoice.status !== 'draft') {
        res.status(400).json({
          success: false,
          message: 'Seules les factures en brouillon peuvent être modifiées'
        });
        return;
      }

      const { customer, items, payment, notes, dueDate, sellerInfo } = req.body;

      if (customer) invoice.customer = customer;
      if (items && Array.isArray(items) && items.length > 0) {
        // Recalculer les totaux côté serveur
        invoice.items = items.map((item: { description: string; quantity: number; unitPrice: number }) => ({
          ...item,
          total: item.quantity * item.unitPrice
        }));
        const subtotal = invoice.items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
        const taxRate = req.body.taxRate ?? invoice.totals.taxRate;
        const tax = subtotal * taxRate;
        const discount = req.body.discount ?? invoice.totals.discount;
        invoice.totals = {
          subtotal,
          taxRate,
          tax,
          discount,
          total: subtotal + tax - discount,
          currency: invoice.totals.currency
        };
      }
      if (payment) {
        if (payment.method) invoice.payment.method = payment.method;
        if (payment.reference !== undefined) invoice.payment.reference = payment.reference;
      }
      if (notes !== undefined) invoice.notes = notes;
      if (dueDate !== undefined) invoice.dueDate = dueDate ? new Date(dueDate) : undefined;
      if (sellerInfo) invoice.sellerInfo = sellerInfo;

      await invoice.save();

      res.json({
        success: true,
        message: 'Facture mise à jour avec succès',
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Marquer une facture comme payée
  static async markAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const invoice = await Invoice.findOne({ _id: req.params.id, seller: sellerId });

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Facture non trouvée'
        });
        return;
      }

      if (invoice.status === 'cancelled') {
        res.status(400).json({
          success: false,
          message: 'Une facture annulée ne peut pas être marquée comme payée'
        });
        return;
      }

      if (invoice.status === 'paid') {
        res.status(400).json({
          success: false,
          message: 'Cette facture est déjà payée'
        });
        return;
      }

      invoice.status = 'paid';
      invoice.payment.paid = true;
      invoice.payment.paidAt = new Date();
      await invoice.save();

      res.json({
        success: true,
        message: 'Facture marquée comme payée',
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors du marquage de la facture comme payée:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Annuler une facture
  static async cancelInvoice(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const invoice = await Invoice.findOne({ _id: req.params.id, seller: sellerId });

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: 'Facture non trouvée'
        });
        return;
      }

      if (invoice.status === 'cancelled') {
        res.status(400).json({
          success: false,
          message: 'Cette facture est déjà annulée'
        });
        return;
      }

      invoice.status = 'cancelled';
      await invoice.save();

      res.json({
        success: true,
        message: 'Facture annulée avec succès',
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la facture:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Statistiques des factures
  static async getInvoiceStats(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

      const [stats] = await Invoice.aggregate([
        { $match: { seller: sellerObjectId } },
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },
            totalAmount: { $sum: '$totals.total' },
            paidCount: {
              $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
            },
            paidAmount: {
              $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$totals.total', 0] }
            },
            unpaidCount: {
              $sum: { $cond: [{ $in: ['$status', ['draft', 'sent', 'overdue']] }, 1, 0] }
            },
            unpaidAmount: {
              $sum: { $cond: [{ $in: ['$status', ['draft', 'sent', 'overdue']] }, '$totals.total', 0] }
            },
            overdueCount: {
              $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
            },
            overdueAmount: {
              $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, '$totals.total', 0] }
            },
            cancelledCount: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            cancelledAmount: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, '$totals.total', 0] }
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          total: {
            count: stats?.totalCount || 0,
            amount: stats?.totalAmount || 0
          },
          paid: {
            count: stats?.paidCount || 0,
            amount: stats?.paidAmount || 0
          },
          unpaid: {
            count: stats?.unpaidCount || 0,
            amount: stats?.unpaidAmount || 0
          },
          overdue: {
            count: stats?.overdueCount || 0,
            amount: stats?.overdueAmount || 0
          },
          cancelled: {
            count: stats?.cancelledCount || 0,
            amount: stats?.cancelledAmount || 0
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de factures:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Exporter une facture en PDF (22.40)
  static async exportPDF(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const invoice = await Invoice.findOne({ _id: req.params.id, seller: sellerId });

      if (!invoice) {
        res.status(404).json({ success: false, message: 'Facture non trouvée' });
        return;
      }

      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument({ margin: 50 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);
      doc.pipe(res);

      // En-tête entreprise
      doc.fontSize(20).text(invoice.sellerInfo.companyName, { align: 'left' });
      if (invoice.sellerInfo.address) doc.fontSize(10).text(invoice.sellerInfo.address);
      if (invoice.sellerInfo.phone) doc.text(`Tél: ${invoice.sellerInfo.phone}`);
      if (invoice.sellerInfo.email) doc.text(`Email: ${invoice.sellerInfo.email}`);
      if (invoice.sellerInfo.siret) doc.text(`SIRET: ${invoice.sellerInfo.siret}`);

      doc.moveDown();

      // Titre facture
      doc.fontSize(16).text(`FACTURE ${invoice.invoiceNumber}`, { align: 'right' });
      doc.fontSize(10).text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('fr-FR')}`, { align: 'right' });
      if (invoice.dueDate) {
        doc.text(`Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, { align: 'right' });
      }
      doc.text(`Statut: ${invoice.status.toUpperCase()}`, { align: 'right' });

      doc.moveDown();

      // Infos client
      doc.fontSize(12).text('Facturer à:', { underline: true });
      doc.fontSize(10).text(invoice.customer.name);
      if (invoice.customer.company) doc.text(invoice.customer.company);
      if (invoice.customer.address) doc.text(invoice.customer.address);
      if (invoice.customer.email) doc.text(invoice.customer.email);
      if (invoice.customer.siret) doc.text(`SIRET: ${invoice.customer.siret}`);

      doc.moveDown();

      // Tableau des articles
      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('Qté', 300, tableTop, { width: 50, align: 'right' });
      doc.text('Prix unit.', 360, tableTop, { width: 80, align: 'right' });
      doc.text('Total', 450, tableTop, { width: 80, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(530, tableTop + 15).stroke();

      let yPos = tableTop + 25;
      doc.font('Helvetica');
      for (const item of invoice.items) {
        doc.text(item.description, 50, yPos, { width: 240 });
        doc.text(String(item.quantity), 300, yPos, { width: 50, align: 'right' });
        doc.text(`${item.unitPrice.toFixed(2)} €`, 360, yPos, { width: 80, align: 'right' });
        doc.text(`${item.total.toFixed(2)} €`, 450, yPos, { width: 80, align: 'right' });
        yPos += 20;
      }

      doc.moveTo(50, yPos).lineTo(530, yPos).stroke();
      yPos += 10;

      // Totaux
      doc.text(`Sous-total:`, 360, yPos, { width: 80, align: 'right' });
      doc.text(`${invoice.totals.subtotal.toFixed(2)} €`, 450, yPos, { width: 80, align: 'right' });
      yPos += 15;
      doc.text(`TVA (${(invoice.totals.taxRate * 100).toFixed(0)}%):`, 360, yPos, { width: 80, align: 'right' });
      doc.text(`${invoice.totals.tax.toFixed(2)} €`, 450, yPos, { width: 80, align: 'right' });
      yPos += 15;
      if (invoice.totals.discount > 0) {
        doc.text(`Remise:`, 360, yPos, { width: 80, align: 'right' });
        doc.text(`-${invoice.totals.discount.toFixed(2)} €`, 450, yPos, { width: 80, align: 'right' });
        yPos += 15;
      }
      doc.font('Helvetica-Bold');
      doc.text(`TOTAL:`, 360, yPos, { width: 80, align: 'right' });
      doc.text(`${invoice.totals.total.toFixed(2)} €`, 450, yPos, { width: 80, align: 'right' });

      // Notes
      if (invoice.notes) {
        doc.moveDown(2);
        doc.font('Helvetica').fontSize(9).text(`Notes: ${invoice.notes}`);
      }

      // Pied de page légal
      doc.fontSize(8).text(
        'En cas de retard de paiement, une pénalité de 3 fois le taux d\'intérêt légal sera appliquée. Indemnité forfaitaire pour frais de recouvrement: 40€.',
        50, doc.page.height - 80,
        { align: 'center', width: 480 }
      );

      doc.end();
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Envoyer une facture par email (22.41)
  static async sendByEmail(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user!.userId;
      const invoice = await Invoice.findOne({ _id: req.params.id, seller: sellerId });

      if (!invoice) {
        res.status(404).json({ success: false, message: 'Facture non trouvée' });
        return;
      }

      const email = req.body.email || invoice.customer.email;
      if (!email) {
        res.status(400).json({ success: false, message: 'Aucune adresse email disponible pour ce client' });
        return;
      }

      const { sendEmail } = await import('../config/email');

      const itemsHtml = invoice.items.map(item =>
        `<tr><td style="padding:8px;border:1px solid #ddd;">${item.description}</td>
         <td style="padding:8px;border:1px solid #ddd;text-align:right;">${item.quantity}</td>
         <td style="padding:8px;border:1px solid #ddd;text-align:right;">${item.unitPrice.toFixed(2)} €</td>
         <td style="padding:8px;border:1px solid #ddd;text-align:right;">${item.total.toFixed(2)} €</td></tr>`
      ).join('');

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#2563eb;">${invoice.sellerInfo.companyName}</h2>
          <p>Bonjour ${invoice.customer.name},</p>
          <p>Veuillez trouver ci-dessous votre facture <strong>${invoice.invoiceNumber}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <thead><tr style="background:#f3f4f6;">
              <th style="padding:8px;border:1px solid #ddd;text-align:left;">Description</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:right;">Qté</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:right;">Prix unit.</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:right;">Total</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="text-align:right;"><strong>Sous-total:</strong> ${invoice.totals.subtotal.toFixed(2)} €</p>
          <p style="text-align:right;"><strong>TVA (${(invoice.totals.taxRate * 100).toFixed(0)}%):</strong> ${invoice.totals.tax.toFixed(2)} €</p>
          ${invoice.totals.discount > 0 ? `<p style="text-align:right;"><strong>Remise:</strong> -${invoice.totals.discount.toFixed(2)} €</p>` : ''}
          <p style="text-align:right;font-size:18px;"><strong>Total: ${invoice.totals.total.toFixed(2)} €</strong></p>
          ${invoice.dueDate ? `<p>Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>` : ''}
          ${invoice.notes ? `<p><em>Notes: ${invoice.notes}</em></p>` : ''}
          <hr/>
          <p style="font-size:12px;color:#666;">
            ${invoice.sellerInfo.companyName}${invoice.sellerInfo.address ? ` — ${invoice.sellerInfo.address}` : ''}
            ${invoice.sellerInfo.siret ? ` — SIRET: ${invoice.sellerInfo.siret}` : ''}
          </p>
        </div>
      `;

      await sendEmail(email, `Facture ${invoice.invoiceNumber} — ${invoice.sellerInfo.companyName}`, html);

      // Mettre à jour le statut si brouillon
      if (invoice.status === 'draft') {
        invoice.status = 'sent';
        await invoice.save();
      }

      res.json({
        success: true,
        message: `Facture envoyée avec succès à ${email}`,
        data: invoice
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la facture par email:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }
}
