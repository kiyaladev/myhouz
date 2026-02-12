'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  FileCheck,
  Receipt,
  Package,
  BarChart3,
  Warehouse,
  X,
  Check,
  User,
} from 'lucide-react';

// Types
interface PosProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends PosProduct {
  quantity: number;
}

// Mock produits quincaillerie
const mockProducts: PosProduct[] = [
  { id: '1', name: 'Vis à bois 5x40mm (boîte 200)', sku: 'VIS-B-540', price: 8.90, stock: 150, category: 'Visserie' },
  { id: '2', name: 'Charnière universelle 80mm', sku: 'CHA-U-80', price: 3.50, stock: 85, category: 'Quincaillerie' },
  { id: '3', name: 'Serrure à encastrer Vachette', sku: 'SER-VAC-01', price: 45.00, stock: 12, category: 'Serrurerie' },
  { id: '4', name: 'Mastic silicone blanc 310ml', sku: 'MAS-SIL-W', price: 7.20, stock: 45, category: 'Colles & Mastics' },
  { id: '5', name: 'Boulon HM 8x60 (lot de 10)', sku: 'BOU-HM-860', price: 5.40, stock: 200, category: 'Visserie' },
  { id: '6', name: 'Poignée de porte Laiton', sku: 'POI-LAI-01', price: 22.50, stock: 30, category: 'Quincaillerie' },
  { id: '7', name: 'Cadenas acier 50mm', sku: 'CAD-AC-50', price: 12.90, stock: 25, category: 'Serrurerie' },
  { id: '8', name: 'Clou tête plate 3x50mm (1kg)', sku: 'CLO-TP-350', price: 6.80, stock: 0, category: 'Visserie' },
  { id: '9', name: 'Colle bois D3 750ml', sku: 'COL-BD3-75', price: 9.50, stock: 38, category: 'Colles & Mastics' },
  { id: '10', name: 'Équerre renforcée 100mm', sku: 'EQU-R-100', price: 4.20, stock: 3, category: 'Quincaillerie' },
  { id: '11', name: 'Cylindre de serrure 30/30', sku: 'CYL-3030', price: 28.00, stock: 18, category: 'Serrurerie' },
  { id: '12', name: 'Cheville à frapper 6x40 (boîte 100)', sku: 'CHE-F-640', price: 11.50, stock: 95, category: 'Visserie' },
];

type PaymentMethod = 'cash' | 'card' | 'check';

export default function PosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState('');

  // Recherche produits
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Calculs panier
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const discountAmount = parseFloat(discount) || 0;
  const tax = (subtotal - discountAmount) * 0.20;
  const total = subtotal - discountAmount + tax;
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const change = cashReceivedNum - total;

  // Ajouter au panier
  const addToCart = (product: PosProduct) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setSearchQuery('');
  };

  // Modifier quantité
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.stock) return item;
          return { ...item, quantity: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Supprimer du panier
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Valider la vente
  const completeSale = () => {
    if (paymentMethod === 'cash' && cashReceivedNum < total) return;
    setShowPayment(false);
    setShowReceipt(true);
  };

  // Nouvelle vente
  const newSale = () => {
    setCart([]);
    setShowReceipt(false);
    setShowPayment(false);
    setPaymentMethod('cash');
    setCashReceived('');
    setCustomerName('');
    setDiscount('');
    setSearchQuery('');
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Point de Vente (POS)</h1>
              <p className="text-sm text-gray-500">Caisse enregistreuse — Quincaillerie</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/pro/pos/stock">
                <Button variant="outline" size="sm">
                  <Warehouse className="h-4 w-4 mr-2" />
                  Stocks
                </Button>
              </Link>
              <Link href="/dashboard/pro/pos/sales">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </Link>
            </div>
          </div>

          {/* Ticket / Reçu */}
          {showReceipt && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center border-b">
                  <div className="flex justify-between items-start">
                    <div />
                    <div>
                      <CardTitle className="text-lg">Ticket de caisse</CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    <button onClick={newSale} className="text-gray-400 hover:text-gray-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {customerName && (
                    <p className="text-sm text-gray-600 mb-3">Client : {customerName}</p>
                  )}
                  <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Remise</span>
                        <span>-{discountAmount.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>TVA (20%)</span>
                      <span>{tax.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>TOTAL</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 pt-1">
                      <span>Paiement</span>
                      <span>
                        {paymentMethod === 'cash' ? 'Espèces' : paymentMethod === 'card' ? 'Carte' : 'Chèque'}
                      </span>
                    </div>
                    {paymentMethod === 'cash' && cashReceivedNum > 0 && (
                      <>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Reçu</span>
                          <span>{cashReceivedNum.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-emerald-600">
                          <span>Monnaie rendue</span>
                          <span>{change.toFixed(2)} €</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={newSale} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <Check className="h-4 w-4 mr-2" />
                      Nouvelle vente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche : Recherche produits */}
            <div className="lg:col-span-2 space-y-4">
              {/* Barre de recherche */}
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Rechercher par nom, SKU ou catégorie..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 text-lg h-12"
                      autoFocus
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Résultats de recherche */}
              {filteredProducts.length > 0 && (
                <Card>
                  <CardContent className="p-2">
                    <div className="divide-y">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="w-full flex items-center gap-4 p-3 hover:bg-emerald-50 rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              SKU: {product.sku} · {product.category}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-gray-900">{product.price.toFixed(2)} €</p>
                            <p className={`text-xs ${product.stock <= 5 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                              {product.stock <= 0 ? 'Rupture' : `Stock: ${product.stock}`}
                            </p>
                          </div>
                          {product.stock > 0 && (
                            <Plus className="h-5 w-5 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accès rapide par catégories */}
              {!searchQuery && cart.length === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['Visserie', 'Quincaillerie', 'Serrurerie', 'Colles & Mastics'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchQuery(cat)}
                      className="bg-white border rounded-xl p-4 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">{cat}</p>
                      <p className="text-xs text-gray-400">
                        {mockProducts.filter((p) => p.category === cat).length} produits
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Articles récemment ajoutés au panier (visible sur mobile seulement) */}
              {cart.length > 0 && !searchQuery && (
                <Card className="lg:hidden">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-emerald-600" />
                      Panier ({cart.length} article{cart.length > 1 ? 's' : ''})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold text-gray-900">{total.toFixed(2)} €</p>
                    <Button
                      onClick={() => setShowPayment(true)}
                      className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Passer au paiement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Colonne droite : Panier / Caisse */}
            <div className="space-y-4">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-emerald-600" />
                      Panier
                    </span>
                    {cart.length > 0 && (
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {cart.reduce((s, i) => s + i.quantity, 0)} article{cart.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Panier vide</p>
                      <p className="text-xs mt-1">Recherchez et ajoutez des produits</p>
                    </div>
                  ) : (
                    <>
                      {/* Articles du panier */}
                      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.price.toFixed(2)} € / unité</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-7 w-7 flex items-center justify-center bg-white border rounded hover:bg-gray-100"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-7 w-7 flex items-center justify-center bg-white border rounded hover:bg-gray-100"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="h-7 w-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-gray-900 w-16 text-right shrink-0">
                              {(item.price * item.quantity).toFixed(2)} €
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Client (optionnel) */}
                      <div className="mb-3">
                        <div className="relative">
                          <User className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Nom du client (optionnel)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="pl-8 h-9 text-sm"
                          />
                        </div>
                      </div>

                      {/* Remise */}
                      <div className="mb-4">
                        <Input
                          type="number"
                          placeholder="Remise (€)"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="h-9 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      {/* Totaux */}
                      <div className="border-t pt-3 space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Sous-total</span>
                          <span>{subtotal.toFixed(2)} €</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Remise</span>
                            <span>-{discountAmount.toFixed(2)} €</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>TVA (20%)</span>
                          <span>{tax.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                          <span>TOTAL</span>
                          <span>{total.toFixed(2)} €</span>
                        </div>
                      </div>

                      {/* Paiement */}
                      {!showPayment ? (
                        <Button
                          onClick={() => setShowPayment(true)}
                          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Passer au paiement
                        </Button>
                      ) : (
                        <div className="mt-4 space-y-3">
                          <p className="text-sm font-medium text-gray-700">Mode de paiement</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'cash' as const, label: 'Espèces', icon: Banknote },
                              { value: 'card' as const, label: 'Carte', icon: CreditCard },
                              { value: 'check' as const, label: 'Chèque', icon: FileCheck },
                            ].map((method) => {
                              const Icon = method.icon;
                              return (
                                <button
                                  key={method.value}
                                  onClick={() => setPaymentMethod(method.value)}
                                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-sm transition-colors ${
                                    paymentMethod === method.value
                                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                  {method.label}
                                </button>
                              );
                            })}
                          </div>

                          {paymentMethod === 'cash' && (
                            <div>
                              <label className="text-sm text-gray-600 mb-1 block">Montant reçu</label>
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                                className="h-12 text-lg font-bold text-center"
                                min="0"
                                step="0.01"
                              />
                              {cashReceivedNum > 0 && cashReceivedNum >= total && (
                                <p className="text-sm text-emerald-600 font-medium mt-1 text-center">
                                  Monnaie à rendre : {change.toFixed(2)} €
                                </p>
                              )}
                              {/* Raccourcis montants */}
                              <div className="flex gap-2 mt-2">
                                {[5, 10, 20, 50].map((amount) => (
                                  <button
                                    key={amount}
                                    onClick={() => setCashReceived(amount.toString())}
                                    className="flex-1 py-1 text-sm border rounded hover:bg-gray-50"
                                  >
                                    {amount} €
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => setCashReceived(Math.ceil(total).toString())}
                                className="w-full py-1 text-sm border rounded hover:bg-gray-50 mt-1"
                              >
                                Montant exact ({Math.ceil(total)} €)
                              </button>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowPayment(false)}
                              className="flex-1"
                            >
                              Retour
                            </Button>
                            <Button
                              onClick={completeSale}
                              disabled={paymentMethod === 'cash' && cashReceivedNum < total}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              Encaisser
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Vider le panier */}
                      <Button
                        variant="ghost"
                        onClick={newSale}
                        className="w-full mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Vider le panier
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
