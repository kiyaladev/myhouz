'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Heart, ArrowLeft, FolderOpen, Eye, ThumbsUp } from 'lucide-react';

const mockFavorites = [
  {
    id: 'proj-1',
    title: 'Cuisine moderne avec îlot central',
    category: 'Rénovation',
    professional: 'Rénovation Plus',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
    views: 1240,
    likes: 89,
    savedAt: '15 Jan 2025',
  },
  {
    id: 'proj-2',
    title: 'Salon scandinave lumineux',
    category: 'Décoration',
    professional: 'Dubois Design Intérieur',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=250&fit=crop',
    views: 856,
    likes: 67,
    savedAt: '10 Jan 2025',
  },
  {
    id: 'proj-3',
    title: 'Terrasse méditerranéenne',
    category: 'Aménagement extérieur',
    professional: 'Larsson Paysage',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
    views: 2100,
    likes: 145,
    savedAt: '5 Jan 2025',
  },
];

export default function DashboardFavoritesPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Projets Favoris</h1>
              <p className="mt-1 text-gray-500">{mockFavorites.length} projets sauvegardés</p>
            </div>
          </div>

          {/* Favorites grid */}
          {mockFavorites.length === 0 ? (
            <EmptyState
              icon={<Heart className="w-12 h-12" />}
              title="Aucun favori"
              description="Vous n'avez pas encore de projets favoris. Explorez les projets et sauvegardez vos préférés !"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavorites.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <button className="p-2 bg-white/90 rounded-full text-red-500">
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">par {project.professional}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> {project.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" /> {project.likes}
                        </span>
                        <span className="ml-auto text-xs">Sauvé le {project.savedAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
