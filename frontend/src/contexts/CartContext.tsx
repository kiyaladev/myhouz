'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '../lib/api';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: { amount: number; currency: string };
    images: Array<{ url: string }>;
    inventory: { quantity: number };
    slug?: string;
    brand?: string;
  };
  quantity: number;
  price: number;
  addedAt: string;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const response = await api.get<Cart>('/cart');
      if (response.success && response.data) {
        setCart(response.data);
        const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setItemCount(count);
      }
    } catch {
      // Not logged in or error - cart stays empty
      setCart(null);
      setItemCount(0);
    }
  }, []);

  // Load cart on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshCart();
    }
  }, [refreshCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post<Cart>('/cart/items', { productId, quantity });
      if (response.success && response.data) {
        setCart(response.data);
        const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setItemCount(count);
        openCart(); // Open cart sidebar when item is added
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.put<Cart>(`/cart/items/${productId}`, { quantity });
      if (response.success && response.data) {
        setCart(response.data);
        const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setItemCount(count);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.delete<Cart>(`/cart/items/${productId}`);
      if (response.success && response.data) {
        setCart(response.data);
        const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setItemCount(count);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.delete<Cart>('/cart');
      if (response.success) {
        setCart(response.data || null);
        setItemCount(0);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
