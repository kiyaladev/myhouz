'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { api } from '../../../lib/api';
import { Search, Heart, BookOpen, Layers } from 'lucide-react';

interface PublicIdeabook {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  creator: { _id: string; firstName: string; lastName: string };
  items: Array<{ itemType: string; itemId: string }>;
  tags: string[];
  likes: number;
  createdAt: string;
}

const mockIdeabooks: PublicIdeabook[] = [
  {
    _id: '1',
    name: 'Cuisine de rêve',
    description: 'Inspiration pour ma future cuisine moderne et fonctionnelle',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    creator: { _id: 'u1', firstName: 'Marie', lastName: 'Dupont' },
    items: [{ itemType: 'project', itemId: 'p1' }, { itemType: 'product', itemId: 'p2' }, { itemType: 'project', itemId: 'p3' }],
    tags: ['cuisine', 'moderne'],
    likes: 24,
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Salon scandinave',
    description: 'Ambiance cosy et minimaliste pour le salon',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    creator: { _id: 'u2', firstName: 'Jean', lastName: 'Martin' },
    items: [{ itemType: 'project', itemId: 'p1' }, { itemType: 'product', itemId: 'p2' }],
    tags: ['salon', 'scandinave', 'cosy'],
    likes: 18,
    createdAt: '2025-02-01T10:00:00.000Z',
  },
  {
    _id: '3',
    name: 'Salle de bain zen',
    description: 'Idées pour une salle de bain relaxante et épurée',
    coverImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    creator: { _id: 'u3', firstName: 'Sophie', lastName: 'Bernard' },
    items: [{ itemType: 'product', itemId: 'p1' }, { itemType: 'project', itemId: 'p2' }, { itemType: 'product', itemId: 'p3' }, { itemType: 'project', itemId: 'p4' }],
    tags: ['salle de bain', 'zen'],
    likes: 32,
    createdAt: '2025-01-20T10:00:00.000Z',
  },
];

export default function ExploreIdeabooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ideabooks, setIdeabooks] = useState<PublicIdeabook[]>(mockIdeabooks);
  const [loading, setLoading] = useState(false);
  const [usingMockData, setUsingMockData] = useState(true);

  const fetchIdeabooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;

      const res = await api.get<PublicIdeabook[]>('/ideabooks/public', params);
      if (res.success && res.data) {
        setIdeabooks(res.data);
        setUsingMockData(false);
      }
    } catch {
      setIdeabooks(mockIdeabooks);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchIdeabooks();
  }, [fetchIdeabooks]);

  // Client-side filtering only for mock data; API handles filtering server-side
  const displayedIdeabooks = usingMockData
    ? ideabooks.filter((ib) => ib.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : ideabooks;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/ideabooks" className="hover:text-emerald-600">Ideabooks</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Explorer</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Explorer les Ideabooks
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez les collections d&apos;inspirations partagées par la communauté pour vos projets de décoration et rénovation
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un ideabook..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : displayedIdeabooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun ideabook trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                Essayez avec d&apos;autres termes de recherche ou créez votre propre ideabook.
              </p>
              <Link href="/ideabooks">
                <Button>Créer un Ideabook</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedIdeabooks.map((ideabook) => (
                <Link key={ideabook._id} href={`/ideabooks/${ideabook._id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      {ideabook.coverImage ? (
                        <Image
                          src={ideabook.coverImage}
                          alt={ideabook.name}
                          className="w-full h-48 object-cover"
                          width={400}
                          height={192}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                          <Layers className="w-12 h-12 text-white/70" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-700">{ideabook.likes}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {ideabook.name}
                      </h3>

                      <p className="text-sm text-gray-500 mb-3">
                        par {ideabook.creator.firstName} {ideabook.creator.lastName}
                      </p>

                      {ideabook.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {ideabook.description}
                        </p>
                      )}

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Layers className="w-4 h-4 mr-1" />
                        <span>{ideabook.items.length} élément{ideabook.items.length !== 1 ? 's' : ''}</span>
                      </div>

                      {ideabook.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ideabook.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Vous avez aussi des idées à partager ?
            </p>
            <Link href="/ideabooks">
              <Button variant="outline">Créer mon Ideabook</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
