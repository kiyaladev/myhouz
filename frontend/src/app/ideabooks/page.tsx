'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

interface Ideabook {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  items: Array<{ _id: string }>;
  isPublic: boolean;
  creator: { _id: string; firstName: string; lastName: string };
  tags: string[];
  createdAt: string;
}

const mockIdeabooks: Ideabook[] = [
  {
    _id: '1',
    title: 'Cuisine de rêve',
    description: 'Inspiration pour ma future cuisine moderne',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    items: [{ _id: 'i1' }, { _id: 'i2' }, { _id: 'i3' }, { _id: 'i4' }],
    isPublic: true,
    creator: { _id: 'u1', firstName: 'Marie', lastName: 'Dupont' },
    tags: ['cuisine', 'moderne'],
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Salon scandinave',
    description: 'Ambiance cosy et minimaliste pour le salon',
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    items: [{ _id: 'i1' }, { _id: 'i2' }],
    isPublic: true,
    creator: { _id: 'u2', firstName: 'Jean', lastName: 'Martin' },
    tags: ['salon', 'scandinave'],
    createdAt: '2025-02-01T10:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Salle de bain zen',
    description: 'Idées pour une salle de bain relaxante',
    coverImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    items: [{ _id: 'i1' }, { _id: 'i2' }, { _id: 'i3' }],
    isPublic: true,
    creator: { _id: 'u1', firstName: 'Marie', lastName: 'Dupont' },
    tags: ['salle de bain', 'zen'],
    createdAt: '2025-01-20T10:00:00.000Z',
  },
];

export default function IdeabooksPage() {
  const [ideabooks, setIdeabooks] = useState<Ideabook[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIdeabooks = async () => {
      try {
        const response = await api.get<Ideabook[]>('/ideabooks');
        if (response.success && response.data) {
          setIdeabooks(response.data);
        }
      } catch {
        setIdeabooks(mockIdeabooks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeabooks();
  }, []);

  const filteredIdeabooks = ideabooks.filter((ib) =>
    ib.title.toLowerCase().includes(search.toLowerCase()) ||
    ib.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Carnets d&apos;Idées
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez et créez vos collections d&apos;idées pour vos projets de décoration et rénovation
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Create */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher un carnet d'idées..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/ideabooks/create">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un carnet
              </Button>
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-gray-500">Chargement des carnets...</div>
            </div>
          )}

          {/* Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeabooks.map((ideabook) => (
                <Card key={ideabook._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <Link href={`/ideabooks/${ideabook._id}`} aria-label={`Voir le carnet : ${ideabook.title}`}>
                    <div className="relative">
                      <img
                        src={ideabook.coverImage}
                        alt={ideabook.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        {ideabook.isPublic ? (
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {ideabook.items.length} élément{ideabook.items.length > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {ideabook.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {ideabook.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-600 font-medium text-sm">
                              {ideabook.creator.firstName.charAt(0)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {ideabook.creator.firstName} {ideabook.creator.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {new Date(ideabook.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ideabook.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredIdeabooks.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun carnet trouvé</h3>
              <p className="text-gray-500">Essayez une autre recherche ou créez votre premier carnet d&apos;idées.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
