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
  Package,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Minus,
  Warehouse,
  TrendingDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface StockProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  status: 'ok' | 'low' | 'out';
}

const mockStockProducts: StockProduct[] = [
  { id: '1', name: 'Vis à bois 5x40mm (boîte 200)', sku: 'VIS-B-540', category: 'Visserie', price: 8.90, stock: 150, minStock: 20, status: 'ok' },
  { id: '2', name: 'Charnière universelle 80mm', sku: 'CHA-U-80', category: 'Quincaillerie', price: 3.50, stock: 85, minStock: 10, status: 'ok' },
  { id: '3', name: 'Serrure à encastrer Vachette', sku: 'SER-VAC-01', category: 'Serrurerie', price: 45.00, stock: 12, minStock: 5, status: 'ok' },
  { id: '4', name: 'Mastic silicone blanc 310ml', sku: 'MAS-SIL-W', category: 'Colles & Mastics', price: 7.20, stock: 45, minStock: 10, status: 'ok' },
  { id: '5', name: 'Boulon HM 8x60 (lot de 10)', sku: 'BOU-HM-860', category: 'Visserie', price: 5.40, stock: 200, minStock: 30, status: 'ok' },
  { id: '6', name: 'Poignée de porte Laiton', sku: 'POI-LAI-01', category: 'Quincaillerie', price: 22.50, stock: 30, minStock: 5, status: 'ok' },
  { id: '7', name: 'Cadenas acier 50mm', sku: 'CAD-AC-50', category: 'Serrurerie', price: 12.90, stock: 25, minStock: 5, status: 'ok' },
  { id: '8', name: 'Clou tête plate 3x50mm (1kg)', sku: 'CLO-TP-350', category: 'Visserie', price: 6.80, stock: 0, minStock: 15, status: 'out' },
  { id: '9', name: 'Colle bois D3 750ml', sku: 'COL-BD3-75', category: 'Colles & Mastics', price: 9.50, stock: 38, minStock: 10, status: 'ok' },
  { id: '10', name: 'Équerre renforcée 100mm', sku: 'EQU-R-100', category: 'Quincaillerie', price: 4.20, stock: 3, minStock: 10, status: 'low' },
  { id: '11', name: 'Cylindre de serrure 30/30', sku: 'CYL-3030', category: 'Serrurerie', price: 28.00, stock: 18, minStock: 5, status: 'ok' },
  { id: '12', name: 'Cheville à frapper 6x40 (boîte 100)', sku: 'CHE-F-640', category: 'Visserie', price: 11.50, stock: 95, minStock: 20, status: 'ok' },
  { id: '13', name: 'Paumelle 100mm inox', sku: 'PAU-100-I', category: 'Quincaillerie', price: 6.30, stock: 4, minStock: 10, status: 'low' },
  { id: '14', name: 'Vis aggloméré 4x30 (boîte 500)', sku: 'VIS-A-430', category: 'Visserie', price: 12.00, stock: 0, minStock: 10, status: 'out' },
  { id: '15', name: 'Joint silicone noir 280ml', sku: 'JOI-SIL-N', category: 'Colles & Mastics', price: 8.50, stock: 2, minStock: 8, status: 'low' },
];

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  ok: { label: 'En stock', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  low: { label: 'Stock faible', className: 'bg-amber-100 text-amber-800', icon: AlertTriangle },
  out: { label: 'Rupture', className: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function StockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [products, setProducts] = useState(mockStockProducts);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  // Stats
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.status === 'out').length;
  const lowStock = products.filter((p) => p.status === 'low').length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Ajuster le stock
  const applyAdjustment = (productId: string) => {
    const adj = parseInt(adjustmentValue);
    if (isNaN(adj)) return;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newStock = Math.max(0, p.stock + adj);
        let newStatus: 'ok' | 'low' | 'out' = 'ok';
        if (newStock === 0) newStatus = 'out';
        else if (newStock <= p.minStock) newStatus = 'low';
        return { ...p, stock: newStock, status: newStatus };
      })
    );
    setAdjustingId(null);
    setAdjustmentValue('');
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
              <p className="text-sm text-gray-500">Suivi et ajustement de l&apos;inventaire</p>
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
              { label: 'Total produits', value: totalProducts.toString(), icon: Package, color: 'bg-blue-100 text-blue-600' },
              { label: 'Valeur du stock', value: `${totalValue.toFixed(0)} €`, icon: Warehouse, color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Stock faible', value: lowStock.toString(), icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
              { label: 'En rupture', value: outOfStock.toString(), icon: TrendingDown, color: 'bg-red-100 text-red-600' },
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
                    placeholder="Rechercher par nom ou SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'ok', 'low', 'out'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      {status === 'all' ? 'Tous' : statusConfig[status]?.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-xs ${categoryFilter === cat ? 'bg-gray-800 hover:bg-gray-900' : ''}`}
                  >
                    {cat === 'all' ? 'Toutes catégories' : cat}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des produits */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={<Package className="h-10 w-10" />}
              title="Aucun produit trouvé"
              description="Modifiez vos filtres ou ajoutez des produits à votre catalogue."
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Produit</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">SKU</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Catégorie</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Prix</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">
                          <span className="flex items-center justify-center gap-1">
                            <ArrowUpDown className="h-3 w-3" /> Stock
                          </span>
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">Statut</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProducts.map((product) => {
                        const config = statusConfig[product.status];
                        const StatusIcon = config.icon;
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{product.name}</p>
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                            <td className="py-3 px-4 text-gray-600">{product.category}</td>
                            <td className="py-3 px-4 text-right font-medium">{product.price.toFixed(2)} €</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-bold ${product.stock === 0 ? 'text-red-600' : product.stock <= product.minStock ? 'text-amber-600' : 'text-gray-900'}`}>
                                {product.stock}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">/ min {product.minStock}</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={config.className}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {adjustingId === product.id ? (
                                <div className="flex items-center gap-1 justify-center">
                                  <Input
                                    type="number"
                                    value={adjustmentValue}
                                    onChange={(e) => setAdjustmentValue(e.target.value)}
                                    placeholder="+/-"
                                    className="w-20 h-8 text-sm text-center"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => applyAdjustment(product.id)}
                                    className="h-8 bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    OK
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => { setAdjustingId(null); setAdjustmentValue(''); }}
                                    className="h-8"
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-1 justify-center">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setAdjustingId(product.id);
                                      setAdjustmentValue('');
                                    }}
                                    className="h-8 text-xs"
                                  >
                                    <ArrowUpDown className="h-3 w-3 mr-1" />
                                    Ajuster
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setAdjustingId(product.id);
                                      setAdjustmentValue('10');
                                    }}
                                    className="h-8 text-xs text-emerald-600 hover:text-emerald-700"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setAdjustingId(product.id);
                                      setAdjustmentValue('-1');
                                    }}
                                    className="h-8 text-xs text-red-600 hover:text-red-700"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alertes Stock */}
          {products.filter((p) => p.status === 'low' || p.status === 'out').length > 0 && (
            <Card className="mt-6 border-amber-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes de stock ({products.filter((p) => p.status === 'low' || p.status === 'out').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products
                    .filter((p) => p.status === 'low' || p.status === 'out')
                    .sort((a, b) => a.stock - b.stock)
                    .map((product) => (
                      <div
                        key={product.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          product.status === 'out' ? 'bg-red-50' : 'bg-amber-50'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                            {product.stock === 0 ? 'RUPTURE' : `${product.stock} restant(s)`}
                          </p>
                          <p className="text-xs text-gray-500">Seuil min : {product.minStock}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
