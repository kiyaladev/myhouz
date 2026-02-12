import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import stripe from '../config/stripe';
import { sendEmail } from '../config/email';

export class OrderController {
  // Créer une nouvelle commande
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const {
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        shippingMethod,
        notes
      } = req.body;

      // Vérifier la disponibilité des produits et calculer les totaux
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          res.status(404).json({
            success: false,
            message: `Produit ${item.productId} non trouvé`
          });
          return;
        }

        if (product.inventory.quantity < item.quantity) {
          res.status(400).json({
            success: false,
            message: `Stock insuffisant pour ${product.name}`
          });
          return;
        }

        const itemTotal = product.price.amount * item.quantity;
        subtotal += itemTotal;

        processedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price.amount,
          seller: product.seller
        });
      }

      // Calculer les frais supplémentaires
      const shipping = 15; // Frais de port fixes pour simplifier
      const tax = subtotal * 0.20; // TVA 20%
      const discount = 0; // Pas de remise pour simplifier
      const total = subtotal + shipping + tax - discount;

      // Générer un numéro de commande unique
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculer la commission (5% pour simplifier)
      const commissionRate = 0.05;
      const commissionAmount = subtotal * commissionRate;

      const order = new Order({
        orderNumber,
        customer: req.user?.userId,
        items: processedItems,
        totals: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
          currency: 'EUR'
        },
        shippingAddress,
        billingAddress,
        payment: {
          method: paymentMethod,
          status: 'pending'
        },
        shipping: {
          method: shippingMethod
        },
        status: 'pending',
        notes,
        commission: {
          rate: commissionRate,
          amount: commissionAmount
        }
      });

      await order.save();

      // Réduire le stock des produits
      for (const item of processedItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { 'inventory.quantity': -item.quantity } }
        );
      }

      await order.populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'items.product', select: 'name images' },
        { path: 'items.seller', select: 'firstName lastName companyName' }
      ]);

      res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: order
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir toutes les commandes de l'utilisateur
  static async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const query: any = { customer: req.user?.userId };

      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const orders = await Order.find(query)
        .populate([
          { path: 'items.product', select: 'name images' },
          { path: 'items.seller', select: 'firstName lastName companyName' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(query);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les commandes d'un vendeur
  static async getSellerOrders(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const query: any = { 'items.seller': req.user?.userId };

      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const orders = await Order.find(query)
        .populate([
          { path: 'customer', select: 'firstName lastName email' },
          { path: 'items.product', select: 'name images' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(query);

      res.json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes vendeur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir une commande par ID
  static async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const order = await Order.findById(id)
        .populate([
          { path: 'customer', select: 'firstName lastName email' },
          { path: 'items.product', select: 'name images description' },
          { path: 'items.seller', select: 'firstName lastName companyName' }
        ]);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur est le client ou l'un des vendeurs
      const isCustomer = order.customer._id.toString() === req.user?.userId;
      const isSeller = order.items.some(
        (item: any) => item.seller._id.toString() === req.user?.userId
      );

      if (!isCustomer && !isSeller) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, trackingNumber, notes } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur est l'un des vendeurs
      const isSeller = order.items.some(
        (item: any) => item.seller.toString() === req.user?.userId
      );

      if (!isSeller) {
        res.status(403).json({
          success: false,
          message: 'Seuls les vendeurs peuvent modifier le statut'
        });
        return;
      }

      const updateData: any = { status };

      if (notes) {
        updateData.notes = notes;
      }

      // Mettre à jour les informations de livraison selon le statut
      if (status === 'shipped' && trackingNumber) {
        updateData['shipping.trackingNumber'] = trackingNumber;
        updateData['shipping.shippedAt'] = new Date();
      } else if (status === 'delivered') {
        updateData['shipping.deliveredAt'] = new Date();
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate([
        { path: 'customer', select: 'firstName lastName email' },
        { path: 'items.product', select: 'name images' },
        { path: 'items.seller', select: 'firstName lastName companyName' }
      ]);

      res.json({
        success: true,
        message: 'Statut de la commande mis à jour',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Traiter le paiement d'une commande
  static async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { transactionId } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur est le client
      if (order.customer.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      if (order.payment.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: 'Le paiement a déjà été traité'
        });
        return;
      }

      // Simuler le traitement du paiement
      // Dans un vrai système, ici on intégrerait avec Stripe, PayPal, etc.
      const paymentSuccess = true;

      if (paymentSuccess) {
        order.payment.status = 'paid';
        order.payment.transactionId = transactionId;
        order.payment.paidAt = new Date();
        order.status = 'confirmed';
        await order.save();

        res.json({
          success: true,
          message: 'Paiement traité avec succès',
          data: order
        });
      } else {
        order.payment.status = 'failed';
        await order.save();

        res.status(400).json({
          success: false,
          message: 'Échec du paiement'
        });
      }
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Annuler une commande
  static async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Commande non trouvée'
        });
        return;
      }

      // Vérifier que l'utilisateur est le client
      if (order.customer.toString() !== req.user?.userId) {
        res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
        return;
      }

      // Vérifier que la commande peut être annulée
      if (!['pending', 'confirmed'].includes(order.status)) {
        res.status(400).json({
          success: false,
          message: 'Cette commande ne peut plus être annulée'
        });
        return;
      }

      // Remettre le stock des produits
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { 'inventory.quantity': item.quantity } }
        );
      }

      order.status = 'cancelled';
      order.notes = reason || 'Annulée par le client';
      await order.save();

      res.json({
        success: true,
        message: 'Commande annulée avec succès',
        data: order
      });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Obtenir les statistiques de commandes pour un vendeur
  static async getSellerStats(req: Request, res: Response): Promise<void> {
    try {
      const sellerId = req.user?.userId;

      // Statistiques générales
      const totalOrders = await Order.countDocuments({
        'items.seller': sellerId
      });

      const revenueResult = await Order.aggregate([
        { $match: { 'items.seller': sellerId, 'payment.status': 'paid' } },
        { $unwind: '$items' },
        { $match: { 'items.seller': sellerId } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        }
      ]);

      const totalRevenue = revenueResult[0]?.totalRevenue || 0;

      // Commandes par statut
      const ordersByStatus = await Order.aggregate([
        { $match: { 'items.seller': sellerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      res.json({
        success: true,
        data: {
          totalOrders,
          totalRevenue,
          ordersByStatus
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Créer une session Stripe Checkout
  static async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.body;

      const order = await Order.findById(orderId).populate('items.product', 'name images');

      if (!order) {
        res.status(404).json({ success: false, message: 'Commande non trouvée' });
        return;
      }

      if (order.customer.toString() !== req.user?.userId) {
        res.status(403).json({ success: false, message: 'Accès non autorisé' });
        return;
      }

      if (order.payment.status !== 'pending') {
        res.status(400).json({ success: false, message: 'Le paiement a déjà été traité' });
        return;
      }

      const lineItems = order.items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product?.name || 'Produit',
            images: item.product?.images?.length ? [item.product.images[0]] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Ajouter frais de port comme ligne
      if (order.totals.shipping > 0) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: 'Frais de livraison', images: [] },
            unit_amount: Math.round(order.totals.shipping * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        metadata: { orderId: (order._id as any).toString() },
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/confirmation?session_id={CHECKOUT_SESSION_ID}&order_id=${(order._id as any).toString()}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?cancelled=true`,
      });

      res.json({ success: true, data: { sessionId: session.id, url: session.url } });
    } catch (error) {
      console.error('Erreur lors de la création de la session Stripe:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Gérer les webhooks Stripe
  static async handleStripeWebhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Erreur de vérification webhook Stripe:', err.message);
      res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
      return;
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const orderId = session.metadata?.orderId;

          if (orderId) {
            const order = await Order.findById(orderId).populate('customer', 'firstName lastName email');

            if (order && order.payment.status === 'pending') {
              order.payment.status = 'paid';
              order.payment.transactionId = session.payment_intent;
              order.payment.paidAt = new Date();
              order.status = 'confirmed';
              await order.save();

              // Envoyer l'email de confirmation
              const customer = order.customer as any;
              if (customer?.email) {
                await OrderController.sendOrderConfirmationEmail(order, customer);
              }
            }
          }
          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object as any;
          const paymentIntent = charge.payment_intent;

          if (paymentIntent) {
            const order = await Order.findOne({ 'payment.transactionId': paymentIntent });
            if (order) {
              order.payment.status = 'refunded';
              order.status = 'refunded';
              await order.save();

              // Remettre le stock
              for (const item of order.items) {
                await Product.findByIdAndUpdate(
                  item.product,
                  { $inc: { 'inventory.quantity': item.quantity } }
                );
              }
            }
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Erreur lors du traitement du webhook:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Rembourser une commande via Stripe
  static async refundOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        res.status(404).json({ success: false, message: 'Commande non trouvée' });
        return;
      }

      if (order.payment.status !== 'paid') {
        res.status(400).json({ success: false, message: 'Seules les commandes payées peuvent être remboursées' });
        return;
      }

      // Si un transactionId Stripe existe, rembourser via Stripe
      if (order.payment.transactionId) {
        await stripe.refunds.create({
          payment_intent: order.payment.transactionId,
          reason: 'requested_by_customer',
        });
      }

      // Mettre à jour la commande
      order.payment.status = 'refunded';
      order.status = 'refunded';
      order.notes = reason || 'Remboursement demandé';
      await order.save();

      // Remettre le stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { 'inventory.quantity': item.quantity } }
        );
      }

      res.json({ success: true, message: 'Commande remboursée avec succès', data: order });
    } catch (error) {
      console.error('Erreur lors du remboursement:', error);
      res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
  }

  // Envoyer un email de confirmation de commande
  private static async sendOrderConfirmationEmail(order: any, customer: any): Promise<void> {
    try {
      const itemsHtml = order.items.map((item: any) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.product?.name || 'Produit'}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${(item.price * item.quantity).toFixed(2)} €</td>
        </tr>
      `).join('');

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background-color:#059669;padding:24px;text-align:center;">
            <h1 style="color:white;margin:0;">MyHouz</h1>
          </div>
          <div style="padding:24px;">
            <h2 style="color:#111827;">Confirmation de commande</h2>
            <p>Bonjour ${customer.firstName} ${customer.lastName},</p>
            <p>Merci pour votre commande ! Voici le récapitulatif :</p>
            <p><strong>Commande n° :</strong> ${order.orderNumber}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead>
                <tr style="background-color:#f3f4f6;">
                  <th style="padding:8px;text-align:left;">Produit</th>
                  <th style="padding:8px;text-align:center;">Qté</th>
                  <th style="padding:8px;text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="text-align:right;margin-top:16px;">
              <p>Sous-total : ${order.totals.subtotal.toFixed(2)} €</p>
              <p>Livraison : ${order.totals.shipping.toFixed(2)} €</p>
              <p>TVA : ${order.totals.tax.toFixed(2)} €</p>
              <p style="font-size:18px;font-weight:bold;color:#059669;">Total : ${order.totals.total.toFixed(2)} €</p>
            </div>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
            <p style="color:#6b7280;font-size:14px;">Vous recevrez un email lorsque votre commande sera expédiée.</p>
          </div>
          <div style="background-color:#f9fafb;padding:16px;text-align:center;color:#9ca3af;font-size:12px;">
            <p>© ${new Date().getFullYear()} MyHouz — Tous droits réservés</p>
          </div>
        </div>
      `;

      await sendEmail(customer.email, `Confirmation de commande ${order.orderNumber}`, html);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    }
  }
}