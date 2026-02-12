'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Euro,
  ShoppingCart,
  Package,
  CreditCard,
  Banknote,
  Calendar,
  Download,
  FileText,
} from 'lucide-react';

interface DailySale {
  date: string;
  revenue: number;
  count: number;
}

interface TopProduct {
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface PaymentBreakdown {
  method: string;
  count: number;
  total: number;
}

const mockDailySales: DailySale[] = [
  { date: '2026-02-06', revenue: 1250.80, count: 15 },
  { date: '2026-02-07', revenue: 980.50, count: 12 },
  { date: '2026-02-08', revenue: 1560.20, count: 18 },
  { date: '2026-02-09', revenue: 2100.00, count: 22 },
  { date: '2026-02-10', revenue: 890.40, count: 10 },
  { date: '2026-02-11', revenue: 1780.60, count: 20 },
  { date: '2026-02-12', revenue: 1420.30, count: 16 },
];

const mockTopProducts: TopProduct[] = [
  { name: 'Vis à bois 5x40mm (boîte 200)', totalQuantity: 45, totalRevenue: 400.50 },
  { name: 'Serrure à encastrer Vachette', totalQuantity: 8, totalRevenue: 360.00 },
  { name: 'Poignée de porte Laiton', totalQuantity: 15, totalRevenue: 337.50 },
  { name: 'Cylindre de serrure 30/30', totalQuantity: 10, totalRevenue: 280.00 },
  { name: 'Mastic silicone blanc 310ml', totalQuantity: 35, totalRevenue: 252.00 },
];

const mockPaymentBreakdown: PaymentBreakdown[] = [
  { method: 'cash', count: 65, total: 5480.30 },
  { method: 'card', count: 42, total: 3820.50 },
  { method: 'check', count: 6, total: 680.00 },
];

const paymentLabels: Record<string, string> = {
  cash: 'Espèces',
  card: 'Carte',
  check: 'Chèque',
  mixed: 'Mixte',
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');

  const totalRevenue = mockDailySales.reduce((sum, d) => sum + d.revenue, 0);
  const totalSales = mockDailySales.reduce((sum, d) => sum + d.count, 0);
  const avgBasket = totalSales > 0 ? totalRevenue / totalSales : 0;
  const maxDay = mockDailySales.reduce((max, d) => d.revenue > max.revenue ? d : max, mockDailySales[0]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pro/pos"><ArrowLeft className="h-4 w-4 mr-1" /> Caisse</Link>
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Rapports Financiers
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/sales">Historique</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/accounting">Export comptable</Link>
            </Button>
          </div>
        </div>

        {/* Sélection de période */}
        <div className="flex gap-2 mb-6">
          <Button variant={period === 'day' ? 'default' : 'outline'} size="sm" onClick={() => setPeriod('day')}>
            <Calendar className="h-4 w-4 mr-1" /> Aujourd&apos;hui
          </Button>
          <Button variant={period === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setPeriod('week')}>
            <Calendar className="h-4 w-4 mr-1" /> 7 jours
          </Button>
          <Button variant={period === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setPeriod('month')}>
            <Calendar className="h-4 w-4 mr-1" /> Ce mois
          </Button>
        </div>

        {/* Stats résumé */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><Euro className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-sm text-gray-500">Chiffre d&apos;affaires</p><p className="text-xl font-bold">{totalRevenue.toFixed(2)} €</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-gray-500">Transactions</p><p className="text-xl font-bold">{totalSales}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><TrendingUp className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-gray-500">Panier moyen</p><p className="text-xl font-bold">{avgBasket.toFixed(2)} €</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><BarChart3 className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-sm text-gray-500">Meilleur jour</p><p className="text-xl font-bold">{maxDay.revenue.toFixed(2)} €</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventes par jour */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Ventes par jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDailySales.map(day => {
                  const pct = maxDay.revenue > 0 ? (day.revenue / maxDay.revenue) * 100 : 0;
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-24">{new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {day.revenue.toFixed(2)} € ({day.count} ventes)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top produits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" /> Top Produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTopProducts.map((product, idx) => (
                  <div key={product.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.totalQuantity} vendus</p>
                    </div>
                    <span className="font-semibold text-green-600">{product.totalRevenue.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Répartition paiements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Répartition par paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPaymentBreakdown.map(pm => {
                  const pct = totalRevenue > 0 ? (pm.total / totalRevenue) * 100 : 0;
                  return (
                    <div key={pm.method} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {pm.method === 'cash' ? <Banknote className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                          {paymentLabels[pm.method] || pm.method}
                        </span>
                        <span className="font-medium">{pm.total.toFixed(2)} € ({pm.count})</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-full rounded-full ${pm.method === 'cash' ? 'bg-green-500' : pm.method === 'card' ? 'bg-blue-500' : 'bg-purple-500'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 text-right">{pct.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5" /> Export & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/pro/pos/accounting">
                  <FileText className="h-4 w-4 mr-2" /> Export comptable (FEC/CSV)
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/pro/pos/invoices">
                  <FileText className="h-4 w-4 mr-2" /> Voir les factures
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/pro/pos/sales">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Historique des ventes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
