'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/ui/empty-state';
import { Heart, ArrowLeft, Plus, Trash2, X } from 'lucide-react';

interface WishlistItem {
  product: {
    _id: string;
    name: string;
    price: { amount: number; currency: string };
    images: Array<{ url: string; caption?: string }>;
  };
  addedAt: string;
}

interface Wishlist {
  _id: string;
  name: string;
  isDefault: boolean;
  items: WishlistItem[];
  createdAt: string;
}

const mockWishlists: Wishlist[] = [
  {
    _id: 'wl-1',
    name: 'Ma liste par défaut',
    isDefault: true,
    items: [
      {
        product: {
          _id: 'p1',
          name: 'Canapé 3 places en velours bleu',
          price: { amount: 899, currency: 'EUR' },
          images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop' }],
        },
        addedAt: '2025-01-15T10:00:00.000Z',
      },
      {
        product: {
          _id: 'p2',
          name: 'Lampe de bureau design',
          price: { amount: 129, currency: 'EUR' },
          images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=300&fit=crop' }],
        },
        addedAt: '2025-01-12T10:00:00.000Z',
      },
    ],
    createdAt: '2025-01-01T10:00:00.000Z',
  },
  {
    _id: 'wl-2',
    name: 'Salon',
    isDefault: false,
    items: [
      {
        product: {
          _id: 'p3',
          name: 'Table basse en chêne massif',
          price: { amount: 349, currency: 'EUR' },
          images: [{ url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop' }],
        },
        addedAt: '2025-01-10T10:00:00.000Z',
      },
    ],
    createdAt: '2025-01-05T10:00:00.000Z',
  },
];

export default function DashboardFavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchWishlists = useCallback(async () => {
    try {
      const response = await api.get<Wishlist[]>('/wishlists');
      if (response.success && response.data && response.data.length > 0) {
        setWishlists(response.data);
      } else {
        setWishlists(mockWishlists);
      }
    } catch {
      setWishlists(mockWishlists);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  useEffect(() => {
    if (wishlists.length > 0 && !selectedWishlist) {
      setSelectedWishlist(wishlists[0]._id);
    }
  }, [wishlists, selectedWishlist]);

  const handleCreateWishlist = async () => {
    if (!newListName.trim()) return;
    setCreating(true);
    try {
      const response = await api.post<Wishlist>('/wishlists', { name: newListName.trim() });
      if (response.success && response.data) {
        setWishlists((prev) => [...prev, response.data as Wishlist]);
        setSelectedWishlist(response.data._id);
      }
    } catch {
      // silent
    } finally {
      setNewListName('');
      setShowCreateForm(false);
      setCreating(false);
    }
  };

  const handleDeleteWishlist = async (id: string) => {
    try {
      await api.delete(`/wishlists/${id}`);
      setWishlists((prev) => prev.filter((w) => w._id !== id));
      if (selectedWishlist === id) {
        setSelectedWishlist(wishlists.find((w) => w._id !== id)?._id || null);
      }
    } catch {
      // silent
    }
  };

  const handleRemoveItem = async (wishlistId: string, productId: string) => {
    try {
      await api.delete(`/wishlists/${wishlistId}/items/${productId}`);
      setWishlists((prev) =>
        prev.map((w) =>
          w._id === wishlistId
            ? { ...w, items: w.items.filter((i) => i.product._id !== productId) }
            : w
        )
      );
    } catch {
      // silent
    }
  };

  const activeWishlist = wishlists.find((w) => w._id === selectedWishlist);
  const totalItems = wishlists.reduce((sum, w) => sum + w.items.length, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement de vos favoris...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Mes Favoris</h1>
              <p className="mt-1 text-gray-500">
                {wishlists.length} liste{wishlists.length > 1 ? 's' : ''} · {totalItems} produit{totalItems > 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle liste
            </Button>
          </div>

          {/* Create wishlist form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardContent className="p-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nom de la liste..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateWishlist()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <Button onClick={handleCreateWishlist} disabled={creating || !newListName.trim()}>
                  {creating ? 'Création...' : 'Créer'}
                </Button>
                <button onClick={() => { setShowCreateForm(false); setNewListName(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          )}

          {wishlists.length === 0 ? (
            <EmptyState
              icon={<Heart className="w-12 h-12" />}
              title="Aucun favori"
              description="Vous n'avez pas encore de liste de favoris. Explorez la marketplace et sauvegardez vos produits préférés !"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar - Wishlist tabs */}
              <div className="lg:col-span-1">
                <div className="space-y-2">
                  {wishlists.map((wl) => (
                    <button
                      key={wl._id}
                      onClick={() => setSelectedWishlist(wl._id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
                        selectedWishlist === wl._id
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm">{wl.name}</p>
                        <p className="text-xs text-gray-500">{wl.items.length} produit{wl.items.length > 1 ? 's' : ''}</p>
                      </div>
                      {!wl.isDefault && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteWishlist(wl._id); }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer la liste"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main content - Product grid */}
              <div className="lg:col-span-3">
                {activeWishlist && activeWishlist.items.length === 0 ? (
                  <EmptyState
                    icon={<Heart className="w-12 h-12" />}
                    title="Liste vide"
                    description="Cette liste ne contient aucun produit. Parcourez la marketplace pour ajouter des produits."
                  />
                ) : activeWishlist ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeWishlist.items.map((item) => (
                      <Card key={item.product._id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <Link href={`/products/${item.product._id}`}>
                          <div className="relative h-48 bg-gray-200">
                            <Image
                              src={item.product.images[0]?.url || 'https://via.placeholder.com/400x300'}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              width={400}
                              height={192}
                              unoptimized
                            />
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <Link href={`/products/${item.product._id}`}>
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-emerald-600 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-lg font-bold text-emerald-600 mb-2">
                            {item.product.price.amount.toLocaleString('fr-FR')} €
                          </p>
                          <p className="text-xs text-gray-400 mb-3">
                            Ajouté le {new Date(item.addedAt).toLocaleDateString('fr-FR')}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(activeWishlist._id, item.product._id)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Retirer
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
