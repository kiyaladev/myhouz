'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Search,
  FileText,
  Plus,
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Send,
  Ban,
  Printer,
  Building2,
  User,
  Calendar,
  Hash,
  X,
  CreditCard,
  Banknote,
  FileCheck,
  ArrowRightLeft,
  MoreHorizontal,
} from 'lucide-react';

// Types
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    company?: string;
    siret?: string;
  };
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    taxRate: number;
    tax: number;
    discount: number;
    total: number;
  };
  payment: {
    method: 'cash' | 'card' | 'check' | 'transfer' | 'other';
    paid: boolean;
    paidAt?: string;
    reference?: string;
  };
  sellerInfo: {
    companyName: string;
    address?: string;
    phone?: string;
    email?: string;
    siret?: string;
  };
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'FAC-2026-000001',
    date: '12 Fév 2026',
    dueDate: '12 Mar 2026',
    customer: {
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 12 34 56 78',
      address: '15 rue de la Paix, 75002 Paris',
    },
    items: [
      { description: 'Vis à bois 5x40mm (boîte 200)', quantity: 5, unitPrice: 8.90, total: 44.50 },
      { description: 'Charnière universelle 80mm', quantity: 10, unitPrice: 3.50, total: 35.00 },
      { description: 'Équerre renforcée 100mm', quantity: 20, unitPrice: 4.20, total: 84.00 },
    ],
    totals: { subtotal: 163.50, taxRate: 0.20, tax: 32.70, discount: 0, total: 196.20 },
    payment: { method: 'transfer', paid: true, paidAt: '15 Fév 2026', reference: 'VIR-2026-001' },
    sellerInfo: {
      companyName: 'Quincaillerie Martin',
      address: '42 avenue des Artisans, 69003 Lyon',
      phone: '04 78 12 34 56',
      email: 'contact@quincaillerie-martin.fr',
      siret: '123 456 789 00012',
    },
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'FAC-2026-000002',
    date: '11 Fév 2026',
    dueDate: '11 Mar 2026',
    customer: {
      name: 'SARL Bâti Plus',
      company: 'SARL Bâti Plus',
      siret: '987 654 321 00045',
      email: 'compta@batiplus.fr',
      address: '8 zone industrielle, 69100 Villeurbanne',
    },
    items: [
      { description: 'Serrure à encastrer Vachette', quantity: 6, unitPrice: 45.00, total: 270.00 },
      { description: 'Cylindre de serrure 30/30', quantity: 6, unitPrice: 28.00, total: 168.00 },
      { description: 'Poignée de porte Laiton', quantity: 12, unitPrice: 22.50, total: 270.00 },
    ],
    totals: { subtotal: 708.00, taxRate: 0.20, tax: 141.60, discount: 50.00, total: 799.60 },
    payment: { method: 'check', paid: false },
    sellerInfo: {
      companyName: 'Quincaillerie Martin',
      address: '42 avenue des Artisans, 69003 Lyon',
      phone: '04 78 12 34 56',
      email: 'contact@quincaillerie-martin.fr',
      siret: '123 456 789 00012',
    },
    notes: 'Chantier rénovation immeuble rue Victor Hugo',
    status: 'sent',
  },
  {
    id: '3',
    invoiceNumber: 'FAC-2026-000003',
    date: '10 Fév 2026',
    dueDate: '10 Mar 2026',
    customer: {
      name: 'Marie Martin',
      phone: '06 98 76 54 32',
    },
    items: [
      { description: 'Mastic silicone blanc 310ml', quantity: 10, unitPrice: 7.20, total: 72.00 },
      { description: 'Colle bois D3 750ml', quantity: 5, unitPrice: 9.50, total: 47.50 },
    ],
    totals: { subtotal: 119.50, taxRate: 0.20, tax: 23.90, discount: 0, total: 143.40 },
    payment: { method: 'cash', paid: true, paidAt: '10 Fév 2026' },
    sellerInfo: {
      companyName: 'Quincaillerie Martin',
      address: '42 avenue des Artisans, 69003 Lyon',
      siret: '123 456 789 00012',
    },
    status: 'paid',
  },
  {
    id: '4',
    invoiceNumber: 'FAC-2026-000004',
    date: '05 Fév 2026',
    dueDate: '05 Mar 2026',
    customer: {
      name: 'ETS Durand Menuiserie',
      company: 'ETS Durand Menuiserie',
      siret: '456 789 123 00078',
      email: 'durand.menuiserie@email.com',
      address: '22 rue des Métiers, 69007 Lyon',
    },
    items: [
      { description: 'Vis aggloméré 4x30 (boîte 500)', quantity: 20, unitPrice: 12.00, total: 240.00 },
      { description: 'Cheville à frapper 6x40 (boîte 100)', quantity: 15, unitPrice: 11.50, total: 172.50 },
      { description: 'Boulon HM 8x60 (lot de 10)', quantity: 30, unitPrice: 5.40, total: 162.00 },
    ],
    totals: { subtotal: 574.50, taxRate: 0.20, tax: 114.90, discount: 25.00, total: 664.40 },
    payment: { method: 'transfer', paid: false },
    sellerInfo: {
      companyName: 'Quincaillerie Martin',
      address: '42 avenue des Artisans, 69003 Lyon',
      siret: '123 456 789 00012',
    },
    notes: 'Livraison prévue le 8 février',
    status: 'overdue',
  },
  {
    id: '5',
    invoiceNumber: 'FAC-2026-000005',
    date: '01 Fév 2026',
    customer: {
      name: 'Pierre Lefèvre',
      phone: '06 11 22 33 44',
    },
    items: [
      { description: 'Cadenas acier 50mm', quantity: 2, unitPrice: 12.90, total: 25.80 },
    ],
    totals: { subtotal: 25.80, taxRate: 0.20, tax: 5.16, discount: 0, total: 30.96 },
    payment: { method: 'card', paid: false },
    sellerInfo: {
      companyName: 'Quincaillerie Martin',
      siret: '123 456 789 00012',
    },
    status: 'cancelled',
  },
];

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  draft: { label: 'Brouillon', className: 'bg-gray-100 text-gray-800', icon: FileText },
  sent: { label: 'Envoyée', className: 'bg-blue-100 text-blue-800', icon: Send },
  paid: { label: 'Payée', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  overdue: { label: 'En retard', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
  cancelled: { label: 'Annulée', className: 'bg-gray-200 text-gray-600', icon: XCircle },
};

const paymentMethodLabels: Record<string, { label: string; icon: React.ElementType }> = {
  cash: { label: 'Espèces', icon: Banknote },
  card: { label: 'Carte', icon: CreditCard },
  check: { label: 'Chèque', icon: FileCheck },
  transfer: { label: 'Virement', icon: ArrowRightLeft },
  other: { label: 'Autre', icon: MoreHorizontal },
};

// --- Create Invoice Modal ---
interface CreateInvoiceModalProps {
  onClose: () => void;
}

function CreateInvoiceModal({ onClose }: CreateInvoiceModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerSiret, setCustomerSiret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('transfer');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<{ description: string; quantity: string; unitPrice: string }[]>([
    { description: '', quantity: '1', unitPrice: '' },
  ]);

  const addItem = () => setItems([...items, { description: '', quantity: '1', unitPrice: '' }]);
  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };
  const updateItem = (idx: number, field: string, value: string) => {
    setItems(items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
  const tax = subtotal * 0.20;
  const total = subtotal + tax;

  const canCreate = customerName.trim() && items.some(i => i.description.trim() && parseFloat(i.unitPrice) > 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Nouvelle Facture
            </CardTitle>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {/* Client */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations client
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Nom du client *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <Input placeholder="Entreprise" value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} />
              <Input placeholder="Email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              <Input placeholder="Téléphone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              <Input placeholder="Adresse" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="sm:col-span-2" />
              <Input placeholder="N° SIRET" value={customerSiret} onChange={(e) => setCustomerSiret(e.target.value)} />
            </div>
          </div>

          {/* Articles */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Articles</h3>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <Input
                    placeholder="Description *"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qté"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    className="w-20"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Prix €"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                    className="w-28"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-sm font-medium text-gray-600 w-20 text-right pt-2">
                    {((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)} €
                  </span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 pt-2">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addItem} className="mt-2">
              <Plus className="h-3 w-3 mr-1" /> Ajouter un article
            </Button>
          </div>

          {/* Totaux */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Sous-total HT</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TVA (20%)</span>
              <span>{tax.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Total TTC</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Paiement et échéance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mode de paiement</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(paymentMethodLabels).map(([key, { label, icon: Icon }]) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      paymentMethod === key
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Date d&apos;échéance</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Notes / Conditions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Conditions de paiement, détails supplémentaires..."
              className="w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button
              disabled={!canCreate}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Créer la facture
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Invoice Detail Modal ---
interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
}

function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  const config = statusConfig[invoice.status];
  const StatusIcon = config.icon;
  const pm = paymentMethodLabels[invoice.payment.method];
  const PMIcon = pm.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                {invoice.invoiceNumber}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">{invoice.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={config.className}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {/* Vendeur et Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Émetteur
              </h4>
              <p className="font-medium text-sm">{invoice.sellerInfo.companyName}</p>
              {invoice.sellerInfo.address && <p className="text-xs text-gray-500">{invoice.sellerInfo.address}</p>}
              {invoice.sellerInfo.phone && <p className="text-xs text-gray-500">{invoice.sellerInfo.phone}</p>}
              {invoice.sellerInfo.email && <p className="text-xs text-gray-500">{invoice.sellerInfo.email}</p>}
              {invoice.sellerInfo.siret && <p className="text-xs text-gray-400 mt-1">SIRET : {invoice.sellerInfo.siret}</p>}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <User className="h-3 w-3" /> Client
              </h4>
              <p className="font-medium text-sm">{invoice.customer.name}</p>
              {invoice.customer.company && <p className="text-xs text-gray-500">{invoice.customer.company}</p>}
              {invoice.customer.address && <p className="text-xs text-gray-500">{invoice.customer.address}</p>}
              {invoice.customer.email && <p className="text-xs text-gray-500">{invoice.customer.email}</p>}
              {invoice.customer.phone && <p className="text-xs text-gray-500">{invoice.customer.phone}</p>}
              {invoice.customer.siret && <p className="text-xs text-gray-400 mt-1">SIRET : {invoice.customer.siret}</p>}
            </div>
          </div>

          {/* Articles */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Articles</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">Description</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-500">Qté</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Prix unit.</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">{item.description}</td>
                      <td className="py-2 px-3 text-center">{item.quantity}</td>
                      <td className="py-2 px-3 text-right">{item.unitPrice.toFixed(2)} €</td>
                      <td className="py-2 px-3 text-right font-medium">{item.total.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totaux */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Sous-total HT</span>
              <span>{invoice.totals.subtotal.toFixed(2)} €</span>
            </div>
            {invoice.totals.discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Remise</span>
                <span>-{invoice.totals.discount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>TVA ({(invoice.totals.taxRate * 100).toFixed(0)}%)</span>
              <span>{invoice.totals.tax.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Total TTC</span>
              <span>{invoice.totals.total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Paiement */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <PMIcon className="h-4 w-4 text-gray-500" />
              <span>{pm.label}</span>
              {invoice.payment.reference && (
                <span className="text-gray-400">• Réf: {invoice.payment.reference}</span>
              )}
            </div>
            {invoice.payment.paid ? (
              <Badge className="bg-emerald-100 text-emerald-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Payé {invoice.payment.paidAt && `le ${invoice.payment.paidAt}`}
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800">
                <Clock className="h-3 w-3 mr-1" />
                En attente
              </Badge>
            )}
          </div>

          {invoice.dueDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              Échéance : {invoice.dueDate}
            </div>
          )}

          {invoice.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="font-medium text-xs uppercase mb-1">Notes</p>
              {invoice.notes}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fermer
            </Button>
            <Button variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer payée
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Page ---
export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.items.some((item) => item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Stats
  const paidInvoices = mockInvoices.filter((i) => i.status === 'paid');
  const unpaidInvoices = mockInvoices.filter((i) => ['draft', 'sent', 'overdue'].includes(i.status));
  const totalInvoiced = mockInvoices.filter((i) => i.status !== 'cancelled').reduce((s, i) => s + i.totals.total, 0);
  const totalPaid = paidInvoices.reduce((s, i) => s + i.totals.total, 0);
  const totalUnpaid = unpaidInvoices.reduce((s, i) => s + i.totals.total, 0);
  const overdueCount = mockInvoices.filter((i) => i.status === 'overdue').length;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro/pos" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
              <p className="text-sm text-gray-500">Gérez vos factures et suivez les paiements</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/pro/pos">
                <Button variant="outline">Retour à la caisse</Button>
              </Link>
              <Button onClick={() => setShowCreate(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle facture
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total facturé', value: `${totalInvoiced.toFixed(2)} €`, icon: Euro, color: 'bg-blue-100 text-blue-600' },
              { label: 'Payé', value: `${totalPaid.toFixed(2)} €`, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Impayé', value: `${totalUnpaid.toFixed(2)} €`, icon: Clock, color: 'bg-amber-100 text-amber-600' },
              { label: 'En retard', value: overdueCount.toString(), icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filtres */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par n° de facture, client ou produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      {status === 'all' ? 'Toutes' : statusConfig[status]?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modals */}
          {showCreate && <CreateInvoiceModal onClose={() => setShowCreate(false)} />}
          {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}

          {/* Liste des factures */}
          {filteredInvoices.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-10 w-10" />}
              title="Aucune facture trouvée"
              description="Modifiez vos filtres ou créez une nouvelle facture."
            />
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => {
                const config = statusConfig[invoice.status];
                const StatusIcon = config.icon;
                const pm = paymentMethodLabels[invoice.payment.method];
                const PMIcon = pm.icon;
                return (
                  <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                          invoice.status === 'paid' ? 'bg-emerald-100' :
                          invoice.status === 'overdue' ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          <FileText className={`h-6 w-6 ${
                            invoice.status === 'paid' ? 'text-emerald-600' :
                            invoice.status === 'overdue' ? 'text-red-500' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {invoice.invoiceNumber}
                            </h3>
                            <Badge className={config.className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {invoice.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {invoice.customer.name}
                            </span>
                            {invoice.customer.company && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {invoice.customer.company}
                              </span>
                            )}
                            <span>
                              • {invoice.items.length} article{invoice.items.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-lg font-bold ${
                            invoice.status === 'cancelled' ? 'text-gray-400 line-through' :
                            invoice.status === 'overdue' ? 'text-red-600' :
                            'text-gray-900'
                          }`}>
                            {invoice.totals.total.toFixed(2)} €
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <PMIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{pm.label}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-600"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
