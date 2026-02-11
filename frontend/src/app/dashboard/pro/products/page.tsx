'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Package,
  ShoppingBag,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'out_of_stock' | 'draft';
  views: number;
  sales: number;
  createdAt: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Robinet Mitigeur Cascade', category: 'Robinetterie', price: 189.99, stock: 15, status: 'active', views: 245, sales: 12, createdAt: '12 Jan 2025' },
  { id: '2', name: 'Carrelage Hexagonal Marble', category: 'Carrelage', price: 45.00, stock: 200, status: 'active', views: 189, sales: 34, createdAt: '8 Jan 2025' },
  { id: '3', name: 'Luminaire Suspension Design', category: 'Éclairage', price: 299.00, stock: 0, status: 'out_of_stock', views: 312, sales: 8, createdAt: '3 Jan 2025' },
  { id: '4', name: 'Poignée de Porte Laiton', category: 'Quincaillerie', price: 35.50, stock: 50, status: 'active', views: 87, sales: 22, createdAt: '28 Dec 2024' },
  { id: '5', name: 'Papier Peint Tropical', category: 'Revêtement mural', price: 59.90, stock: 5, status: 'draft', views: 0, sales: 0, createdAt: '20 Dec 2024' },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  active: { label: 'Actif', className: 'bg-emerald-100 text-emerald-800' },
  out_of_stock: { label: 'Rupture', className: 'bg-red-100 text-red-800' },
  draft: { label: 'Brouillon', className: 'bg-yellow-100 text-yellow-800' },
};

export default function ProProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockProducts.reduce((sum, p) => sum + p.price * p.sales, 0);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
              <p className="mt-1 text-gray-500">Gérez votre catalogue de produits sur la marketplace</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau produit
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Produits actifs', value: mockProducts.filter((p) => p.status === 'active').length.toString(), color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Total ventes', value: mockProducts.reduce((s, p) => s + p.sales, 0).toString(), color: 'bg-blue-100 text-blue-600' },
              { label: 'Chiffre d\'affaires', value: `${totalRevenue.toFixed(0)} €`, color: 'bg-amber-100 text-amber-600' },
              { label: 'En rupture', value: mockProducts.filter((p) => p.status === 'out_of_stock').length.toString(), color: 'bg-red-100 text-red-600' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'active', 'out_of_stock', 'draft'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      {status === 'all' ? 'Tous' : statusStyles[status]?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={<Package className="h-10 w-10" />}
              title="Aucun produit trouvé"
              description="Ajoutez vos produits pour les vendre sur la marketplace MyHouz."
            />
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          <Badge className={statusStyles[product.status].className}>
                            {statusStyles[product.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.category} · {product.price.toFixed(2)} € · Stock : {product.stock}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" /> {product.views} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-4 w-4" /> {product.sales} ventes
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
