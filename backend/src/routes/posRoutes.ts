import { Router } from 'express';
import { PosController } from '../controllers/PosController';
import { InvoiceController } from '../controllers/InvoiceController';
import { SupplierController } from '../controllers/SupplierController';
import { RegisterController } from '../controllers/RegisterController';
import { LoyaltyController } from '../controllers/LoyaltyController';
import { ReturnController } from '../controllers/ReturnController';
import { authenticateToken, requireProfessional } from '../middleware/auth';

const router = Router();

// Toutes les routes nécessitent une authentification professionnelle
router.use(authenticateToken);
router.use(requireProfessional);

// Factures / Invoices
router.get('/invoices/stats', InvoiceController.getInvoiceStats);
router.post('/invoices', InvoiceController.createInvoice);
router.get('/invoices', InvoiceController.getInvoices);
router.get('/invoices/:id/pdf', InvoiceController.exportPDF);
router.post('/invoices/:id/send', InvoiceController.sendByEmail);
router.get('/invoices/:id', InvoiceController.getInvoice);
router.put('/invoices/:id', InvoiceController.updateInvoice);
router.patch('/invoices/:id/pay', InvoiceController.markAsPaid);
router.patch('/invoices/:id/cancel', InvoiceController.cancelInvoice);

// Dashboard POS
router.get('/dashboard', PosController.getDashboard);

// Rapports financiers (22.45)
router.get('/reports', PosController.getFinancialReports);

// Export comptable FEC/CSV (22.49)
router.get('/accounting/export', PosController.exportAccounting);

// Alertes de réapprovisionnement (22.43)
router.get('/stock/alerts', PosController.checkRestockAlerts);

// Recherche rapide de produits pour le POS
router.get('/products/search', PosController.searchProducts);

// Recherche par code-barres (22.44)
router.get('/products/barcode', PosController.searchByBarcode);

// Gestion du stock
router.get('/stock', PosController.getStockList);
router.patch('/stock/adjust', PosController.adjustStock);

// Gestion des ventes
router.post('/sales', PosController.createSale);
router.get('/sales', PosController.getSales);
router.get('/sales/:id', PosController.getSale);
router.patch('/sales/:id/refund', PosController.refundSale);

// Fournisseurs (22.42)
router.post('/suppliers', SupplierController.createSupplier);
router.get('/suppliers', SupplierController.getSuppliers);
router.get('/suppliers/:id', SupplierController.getSupplier);
router.put('/suppliers/:id', SupplierController.updateSupplier);
router.delete('/suppliers/:id', SupplierController.deleteSupplier);

// Caisses / Multi-caisse (22.46)
router.post('/registers', RegisterController.createRegister);
router.get('/registers', RegisterController.getRegisters);
router.patch('/registers/:id/open', RegisterController.openRegister);
router.patch('/registers/:id/close', RegisterController.closeRegister);
router.delete('/registers/:id', RegisterController.deleteRegister);

// Programme de fidélité (22.47)
router.post('/loyalty', LoyaltyController.addCustomer);
router.get('/loyalty', LoyaltyController.getCustomers);
router.get('/loyalty/:id', LoyaltyController.getCustomer);
router.post('/loyalty/:id/earn', LoyaltyController.addPoints);
router.post('/loyalty/:id/spend', LoyaltyController.spendPoints);

// Retours produits (22.48)
router.post('/returns', ReturnController.createReturn);
router.get('/returns', ReturnController.getReturns);
router.get('/returns/:id', ReturnController.getReturn);
router.patch('/returns/:id/approve', ReturnController.approveReturn);
router.patch('/returns/:id/reject', ReturnController.rejectReturn);

export default router;
