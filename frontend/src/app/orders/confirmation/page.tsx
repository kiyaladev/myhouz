'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';

const orderItems = [
  { id: 1, name: 'Canapé 3 places en lin beige', quantity: 1, unitPrice: 1299.00 },
  { id: 2, name: 'Table basse en chêne massif', quantity: 1, unitPrice: 449.00 },
  { id: 3, name: 'Lampe de table en laiton', quantity: 2, unitPrice: 89.00 },
];

const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
const shipping = 0;
const tva = Math.round(subtotal * 0.2 * 100) / 100;
const total = subtotal + shipping + tva;

function formatPrice(price: number) {
  return price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

export default function OrderConfirmationPage() {
  const orderDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
            <p className="text-gray-600">
              Merci pour votre commande. Vous recevrez un e-mail de confirmation sous peu.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Détails de la commande</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Numéro de commande</span>
                  <p className="font-medium text-gray-900">CMD-2025-043</p>
                </div>
                <div>
                  <span className="text-gray-500">Date</span>
                  <p className="font-medium text-gray-900">{orderDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Statut du paiement</span>
                  <p>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Payé
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Moyen de paiement</span>
                  <p className="font-medium text-gray-900">Carte bancaire •••• 4242</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Ordered */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Articles commandés</h2>
              </div>
              <div className="divide-y">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qté : {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>TVA (20%)</span>
                  <span>{formatPrice(tva)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Adresse de livraison</h2>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">Jean Dupont</p>
                <p>15 rue de la Paix</p>
                <p>75002 Paris, France</p>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Livraison estimée : 5-7 jours ouvrés
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/orders/tracking">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                Suivre ma commande
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                Continuer mes achats
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
