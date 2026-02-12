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
  Receipt,
  Euro,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Banknote,
  CreditCard,
  FileCheck,
  FileText,
  Eye,
  RotateCcw,
  Hash,
} from 'lucide-react';

interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  time: string;
  items: { name: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'check';
  customer?: string;
  status: 'completed' | 'refunded';
}

const mockSales: Sale[] = [
  {
    id: '1',
    saleNumber: 'POS-2025-001',
    date: '12 Fév 2025',
    time: '09:15',
    items: [
      { name: 'Vis à bois 5x40mm (boîte 200)', quantity: 2, unitPrice: 8.90, total: 17.80 },
      { name: 'Charnière universelle 80mm', quantity: 4, unitPrice: 3.50, total: 14.00 },
    ],
    subtotal: 31.80,
    tax: 6.36,
    discount: 0,
    total: 38.16,
    paymentMethod: 'cash',
    customer: 'Jean Dupont',
    status: 'completed',
  },
  {
    id: '2',
    saleNumber: 'POS-2025-002',
    date: '12 Fév 2025',
    time: '10:42',
    items: [
      { name: 'Serrure à encastrer Vachette', quantity: 1, unitPrice: 45.00, total: 45.00 },
      { name: 'Cylindre de serrure 30/30', quantity: 1, unitPrice: 28.00, total: 28.00 },
    ],
    subtotal: 73.00,
    tax: 14.60,
    discount: 5.00,
    total: 82.60,
    paymentMethod: 'card',
    status: 'completed',
  },
  {
    id: '3',
    saleNumber: 'POS-2025-003',
    date: '11 Fév 2025',
    time: '14:30',
    items: [
      { name: 'Mastic silicone blanc 310ml', quantity: 3, unitPrice: 7.20, total: 21.60 },
      { name: 'Colle bois D3 750ml', quantity: 2, unitPrice: 9.50, total: 19.00 },
      { name: 'Joint silicone noir 280ml', quantity: 1, unitPrice: 8.50, total: 8.50 },
    ],
    subtotal: 49.10,
    tax: 9.82,
    discount: 0,
    total: 58.92,
    paymentMethod: 'cash',
    customer: 'Marie Martin',
    status: 'completed',
  },
  {
    id: '4',
    saleNumber: 'POS-2025-004',
    date: '11 Fév 2025',
    time: '16:05',
    items: [
      { name: 'Poignée de porte Laiton', quantity: 6, unitPrice: 22.50, total: 135.00 },
    ],
    subtotal: 135.00,
    tax: 27.00,
    discount: 10.00,
    total: 152.00,
    paymentMethod: 'check',
    customer: 'SARL Bâti Plus',
    status: 'completed',
  },
  {
    id: '5',
    saleNumber: 'POS-2025-005',
    date: '10 Fév 2025',
    time: '11:20',
    items: [
      { name: 'Boulon HM 8x60 (lot de 10)', quantity: 5, unitPrice: 5.40, total: 27.00 },
      { name: 'Équerre renforcée 100mm', quantity: 10, unitPrice: 4.20, total: 42.00 },
    ],
    subtotal: 69.00,
    tax: 13.80,
    discount: 0,
    total: 82.80,
    paymentMethod: 'card',
    status: 'refunded',
  },
  {
    id: '6',
    saleNumber: 'POS-2025-006',
    date: '10 Fév 2025',
    time: '09:45',
    items: [
      { name: 'Cheville à frapper 6x40 (boîte 100)', quantity: 3, unitPrice: 11.50, total: 34.50 },
      { name: 'Vis à bois 5x40mm (boîte 200)', quantity: 1, unitPrice: 8.90, total: 8.90 },
    ],
    subtotal: 43.40,
    tax: 8.68,
    discount: 0,
    total: 52.08,
    paymentMethod: 'cash',
    status: 'completed',
  },
];

const paymentMethodLabels: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  cash: { label: 'Espèces', icon: Banknote, className: 'bg-green-100 text-green-800' },
  card: { label: 'Carte', icon: CreditCard, className: 'bg-blue-100 text-blue-800' },
  check: { label: 'Chèque', icon: FileCheck, className: 'bg-purple-100 text-purple-800' },
};

const statusStyles: Record<string, { label: string; className: string }> = {
  completed: { label: 'Validée', className: 'bg-emerald-100 text-emerald-800' },
  refunded: { label: 'Remboursée', className: 'bg-red-100 text-red-800' },
};

export default function SalesHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    return mockSales.filter((sale) => {
      const matchesSearch =
        sale.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPayment = paymentFilter === 'all' || sale.paymentMethod === paymentFilter;
      const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [searchQuery, paymentFilter, statusFilter]);

  // Stats
  const completedSales = mockSales.filter((s) => s.status === 'completed');
  const totalRevenue = completedSales.reduce((sum, s) => sum + s.total, 0);
  const totalTransactions = completedSales.length;
  const avgSale = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const totalItems = completedSales.reduce((sum, s) => sum + s.items.reduce((is, i) => is + i.quantity, 0), 0);

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
              <h1 className="text-2xl font-bold text-gray-900">Historique des Ventes</h1>
              <p className="text-sm text-gray-500">Consultez et gérez vos transactions POS</p>
            </div>
            <Link href="/dashboard/pro/pos">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Retour à la caisse
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Chiffre d\'affaires', value: `${totalRevenue.toFixed(2)} €`, icon: Euro, color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Transactions', value: totalTransactions.toString(), icon: Receipt, color: 'bg-blue-100 text-blue-600' },
              { label: 'Panier moyen', value: `${avgSale.toFixed(2)} €`, icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
              { label: 'Articles vendus', value: totalItems.toString(), icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
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
                    placeholder="Rechercher par n° de vente, client ou produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'cash', 'card', 'check'].map((method) => (
                    <Button
                      key={method}
                      variant={paymentFilter === method ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPaymentFilter(method)}
                      className={paymentFilter === method ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      {method === 'all' ? 'Tous' : paymentMethodLabels[method]?.label}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {['all', 'completed', 'refunded'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-gray-800 hover:bg-gray-900' : ''}
                    >
                      {status === 'all' ? 'Tous statuts' : statusStyles[status]?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détail vente modal */}
          {selectedSale && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-emerald-600" />
                      {selectedSale.saleNumber}
                    </CardTitle>
                    <button
                      onClick={() => setSelectedSale(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {selectedSale.date} à {selectedSale.time}
                    </div>
                    <Badge className={statusStyles[selectedSale.status].className}>
                      {statusStyles[selectedSale.status].label}
                    </Badge>
                  </div>

                  {selectedSale.customer && (
                    <p className="text-sm text-gray-600 mb-4">
                      Client : <span className="font-medium">{selectedSale.customer}</span>
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {selectedSale.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity} x {item.unitPrice.toFixed(2)} €</p>
                        </div>
                        <p className="font-medium">{item.total.toFixed(2)} €</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{selectedSale.subtotal.toFixed(2)} €</span>
                    </div>
                    {selectedSale.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Remise</span>
                        <span>-{selectedSale.discount.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>TVA (20%)</span>
                      <span>{selectedSale.tax.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>{selectedSale.total.toFixed(2)} €</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {(() => {
                        const pm = paymentMethodLabels[selectedSale.paymentMethod];
                        const PMIcon = pm.icon;
                        return (
                          <Badge className={pm.className}>
                            <PMIcon className="h-3 w-3 mr-1" />
                            {pm.label}
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={() => setSelectedSale(null)} className="flex-1">
                      Fermer
                    </Button>
                    {selectedSale.status === 'completed' && (
                      <>
                        <Link href="/dashboard/pro/pos/invoices" className="flex-1">
                          <Button variant="outline" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Facture
                          </Button>
                        </Link>
                        <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Rembourser
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Liste des ventes */}
          {filteredSales.length === 0 ? (
            <EmptyState
              icon={<Receipt className="h-10 w-10" />}
              title="Aucune vente trouvée"
              description="Modifiez vos filtres ou effectuez une vente depuis la caisse."
            />
          ) : (
            <div className="space-y-3">
              {filteredSales.map((sale) => {
                const pm = paymentMethodLabels[sale.paymentMethod];
                const PMIcon = pm.icon;
                return (
                  <Card key={sale.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <Receipt className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {sale.saleNumber}
                            </h3>
                            <Badge className={statusStyles[sale.status].className}>
                              {statusStyles[sale.status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {sale.date} {sale.time}
                            </span>
                            {sale.customer && (
                              <span>• {sale.customer}</span>
                            )}
                            <span>
                              • {sale.items.length} article{sale.items.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-lg font-bold ${sale.status === 'refunded' ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                            {sale.total.toFixed(2)} €
                          </p>
                          <Badge className={`${pm.className} mt-1`}>
                            <PMIcon className="h-3 w-3 mr-1" />
                            {pm.label}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSale(sale)}
                          className="shrink-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
