'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCart } from '../../contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, itemCount, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 100 ? 0 : 9.9;
  const total = subtotal + shipping;

  const formatPrice = (amount: number) =>
    amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (items.length === 0 && !isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
              <p className="text-gray-600 mb-8">
                Découvrez nos produits et ajoutez vos coups de cœur à votre panier.
              </p>
              <Link href="/products">
                <Button size="lg">Découvrir nos produits</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
                <Badge variant="secondary">{itemCount} article{itemCount > 1 ? 's' : ''}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearCart()}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider le panier
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product._id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.product.images?.[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            {item.product.brand && (
                              <p className="text-sm text-emerald-600 font-medium">{item.product.brand}</p>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {item.product.slug ? (
                                <Link href={`/products/${item.product.slug}`} className="hover:text-emerald-600">
                                  {item.product.name}
                                </Link>
                              ) : (
                                item.product.name
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatPrice(item.product.price.amount)} € / unité
                            </p>
                          </div>

                          <p className="text-lg font-bold text-gray-900 ml-4 whitespace-nowrap">
                            {formatPrice(item.price)} €
                          </p>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg transition-colors"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              disabled={isLoading || item.quantity >= (item.product.inventory?.quantity ?? 99)}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg transition-colors"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            disabled={isLoading}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors disabled:opacity-50"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="pt-4">
                <Link href="/products" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  ← Continuer mes achats
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{formatPrice(subtotal)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison estimée</span>
                      {shipping === 0 ? (
                        <span className="font-medium text-emerald-600">Gratuite</span>
                      ) : (
                        <span className="font-medium">{formatPrice(shipping)} €</span>
                      )}
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Livraison gratuite à partir de 100,00 €
                      </p>
                    )}
                    <div className="border-t pt-3 mt-3 flex justify-between">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-base font-bold text-gray-900">{formatPrice(total)} €</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6" size="lg" disabled={isLoading}>
                    Passer la commande
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Paiement sécurisé · Retours gratuits sous 30 jours
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
