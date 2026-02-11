'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ShoppingBag, ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const mockOrders = [
  {
    id: '1',
    orderNumber: 'CMD-2025-042',
    date: '15 Jan 2025',
    status: 'delivered' as const,
    total: 249.99,
    items: [
      { name: 'Suspension luminaire Éclat', quantity: 1, price: 189 },
      { name: 'Ampoule LED E27', quantity: 2, price: 30.50 },
    ],
  },
  {
    id: '2',
    orderNumber: 'CMD-2025-039',
    date: '08 Jan 2025',
    status: 'shipped' as const,
    total: 589.0,
    items: [
      { name: 'Table basse en chêne massif', quantity: 1, price: 549 },
      { name: 'Produit d\'entretien bois', quantity: 1, price: 40 },
    ],
  },
  {
    id: '3',
    orderNumber: 'CMD-2024-035',
    date: '20 Déc 2024',
    status: 'processing' as const,
    total: 1299.0,
    items: [{ name: 'Canapé modulable Milano', quantity: 1, price: 1299 }],
  },
  {
    id: '4',
    orderNumber: 'CMD-2024-028',
    date: '1 Déc 2024',
    status: 'delivered' as const,
    total: 89.90,
    items: [
      { name: 'Coussin décoratif Norde', quantity: 3, price: 29.97 },
    ],
  },
];

const statusConfig = {
  processing: { label: 'En traitement', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
  shipped: { label: 'Expédiée', icon: Truck, className: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Livrée', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
};

export default function DashboardOrdersPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
              <p className="mt-1 text-gray-500">{mockOrders.length} commandes</p>
            </div>
          </div>

          {/* Orders list */}
          {mockOrders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="w-12 h-12" />}
              title="Aucune commande"
              description="Vous n'avez pas encore passé de commande. Découvrez nos produits !"
            />
          ) : (
            <div className="space-y-4">
              {mockOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div>
                            <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                            <span className="text-sm text-gray-500 ml-3">{order.date}</span>
                          </div>
                        </div>
                        <Badge className={status.className}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Items */}
                      <div className="border-t pt-4 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name} <span className="text-gray-400">× {item.quantity}</span>
                            </span>
                            <span className="text-gray-900 font-medium">{item.price.toFixed(2)} €</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t mt-3 pt-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Total</span>
                        <span className="text-lg font-bold text-gray-900">{order.total.toFixed(2)} €</span>
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
