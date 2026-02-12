'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Search,
  Clock,
  MessageSquare,
  ArrowLeft,
  Copy,
} from 'lucide-react';

const trackingSteps = [
  {
    label: 'Commande confirmée',
    date: '15 Jan 2025 à 10:30',
    status: 'completed' as const,
    description: 'Votre commande a été confirmée et le paiement validé.',
  },
  {
    label: 'En préparation',
    date: '15 Jan 2025 à 14:00',
    status: 'completed' as const,
    description: 'Vos articles sont en cours de préparation dans notre entrepôt.',
  },
  {
    label: 'Expédiée',
    date: '16 Jan 2025 à 09:15',
    status: 'completed' as const,
    description: 'Votre colis a été remis au transporteur.',
    trackingNumber: 'FR123456789',
  },
  {
    label: 'En cours de livraison',
    date: '17 Jan 2025',
    status: 'current' as const,
    description: 'Votre colis est en cours d\'acheminement vers votre adresse.',
  },
  {
    label: 'Livrée',
    date: 'Estimée le 20 Jan 2025',
    status: 'pending' as const,
    description: 'Livraison estimée à votre domicile.',
  },
];

const orderItems = [
  { id: 1, name: 'Suspension luminaire Éclat', quantity: 1, price: 189.0 },
  { id: 2, name: 'Ampoule LED E27', quantity: 2, price: 30.5 },
  { id: 3, name: 'Câble textile tressé 2m', quantity: 1, price: 18.99 },
];

function formatPrice(price: number) {
  return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

export default function OrderTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/orders" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Suivi de Commande</h1>
              <p className="mt-1 text-gray-500">Suivez l&apos;état de votre commande en temps réel</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Entrez un numéro de commande (ex: CMD-2025-043)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="font-semibold text-gray-900">Commande #CMD-2025-043</span>
                    <span className="text-sm text-gray-500 ml-3">15 Jan 2025</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 w-fit">
                  <Truck className="h-3.5 w-3.5 mr-1" />
                  En cours de livraison
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-gray-500" />
                Historique de suivi
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="relative">
                {trackingSteps.map((step, index) => {
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                      {/* Vertical connector line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%-2rem)] ${
                            step.status === 'completed' || step.status === 'current'
                              ? 'bg-emerald-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      )}

                      {/* Step indicator */}
                      <div className="relative z-10 flex-shrink-0">
                        {step.status === 'completed' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        ) : step.status === 'current' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                            <div className="w-3 h-3 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span
                            className={`font-semibold ${
                              step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-sm text-gray-500">{step.date}</span>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {step.description}
                        </p>
                        {step.trackingNumber && (
                          <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 text-sm">
                            <span className="text-gray-500">N° de suivi :</span>
                            <span className="font-mono font-medium text-gray-900">
                              {step.trackingNumber}
                            </span>
                            <Copy className="h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-gray-500" />
                Détails de livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Transporteur</span>
                  <p className="font-medium text-gray-900">Colissimo</p>
                </div>
                <div>
                  <span className="text-gray-500">N° de suivi</span>
                  <p className="font-mono font-medium text-gray-900">FR123456789</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500">Adresse de livraison</span>
                  <div className="text-gray-900 mt-1 space-y-0.5">
                    <p className="font-medium">Jean Dupont</p>
                    <p>15 rue de la Paix</p>
                    <p>75002 Paris, France</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-gray-500" />
                Articles commandés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qté : {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-2 pt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux commandes
              </Button>
            </Link>
            <Link href="/messages">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contacter le vendeur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
