'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, Plus, Lock, Globe, Trash2, ArrowLeft, Image } from 'lucide-react';

const mockIdeabooks = [
  {
    id: '1',
    name: 'Salon Moderne',
    itemCount: 12,
    isPublic: true,
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=200&fit=crop',
    updatedAt: '15 Jan 2025',
  },
  {
    id: '2',
    name: 'Cuisine Contemporaine',
    itemCount: 8,
    isPublic: false,
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    updatedAt: '12 Jan 2025',
  },
  {
    id: '3',
    name: 'Terrasse Été 2025',
    itemCount: 3,
    isPublic: true,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
    updatedAt: '10 Jan 2025',
  },
  {
    id: '4',
    name: 'Salle de Bain Zen',
    itemCount: 6,
    isPublic: false,
    thumbnail: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=200&fit=crop',
    updatedAt: '5 Jan 2025',
  },
];

export default function DashboardIdeabooksPage() {
  const [ideabooks, setIdeabooks] = useState(mockIdeabooks);

  const handleDelete = (id: string) => {
    setIdeabooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mes Ideabooks</h1>
                <p className="mt-1 text-gray-500">{ideabooks.length} carnets d&apos;inspiration</p>
              </div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau carnet
            </Button>
          </div>

          {/* Ideabooks grid */}
          {ideabooks.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title="Aucun ideabook"
              description="Créez votre premier carnet d'inspiration pour sauvegarder vos idées préférées."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideabooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={book.thumbnail}
                      alt={book.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={book.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {book.isPublic ? (
                          <><Globe className="h-3 w-3 mr-1" /> Public</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" /> Privé</>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{book.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          <Image className="h-3.5 w-3.5 inline mr-1" />
                          {book.itemCount} éléments · Modifié le {book.updatedAt}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
