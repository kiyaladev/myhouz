'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/button';

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, isLoading } = useCart();

  if (!isCartOpen) return null;

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Mon panier</h2>
            {cart && cart.items.length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-sm px-2 py-0.5 rounded-full">
                {cart.items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Votre panier est vide</p>
              <p className="text-sm text-gray-400 mb-4">
                Découvrez nos produits et commencez vos achats
              </p>
              <Button onClick={closeCart} asChild>
                <Link href="/products">Voir les produits</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Product image */}
                  <Link
                    href={`/products/${item.product._id}`}
                    onClick={closeCart}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product._id}`}
                      onClick={closeCart}
                      className="font-medium text-gray-900 hover:text-emerald-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.brand && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}</p>
                    )}
                    <p className="text-emerald-600 font-semibold mt-1">
                      {item.price.toLocaleString('fr-FR')} €
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={isLoading}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= (item.product.inventory?.quantity || 99)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        disabled={isLoading}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and checkout */}
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sous-total</span>
              <span className="text-xl font-bold text-gray-900">
                {cart.totalAmount.toLocaleString('fr-FR')} €
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Frais de livraison calculés à l&apos;étape suivante
            </p>
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/checkout" onClick={closeCart}>
                  Passer la commande
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={closeCart}>
                Continuer mes achats
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
