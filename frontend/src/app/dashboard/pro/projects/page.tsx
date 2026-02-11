'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Heart,
  Pencil,
  Trash2,
  FolderOpen,
  MoreVertical,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  likes: number;
  images: number;
  createdAt: string;
}

const mockProjects: Project[] = [
  { id: '1', title: 'Rénovation Appartement Haussmannien', category: 'Rénovation', status: 'published', views: 342, likes: 28, images: 12, createdAt: '15 Jan 2025' },
  { id: '2', title: 'Cuisine Moderne Minimaliste', category: 'Cuisine', status: 'published', views: 215, likes: 19, images: 8, createdAt: '10 Jan 2025' },
  { id: '3', title: 'Terrasse Rooftop Végétalisée', category: 'Extérieur', status: 'published', views: 189, likes: 15, images: 10, createdAt: '5 Jan 2025' },
  { id: '4', title: 'Salle de Bain Zen', category: 'Salle de bain', status: 'draft', views: 0, likes: 0, images: 5, createdAt: '2 Jan 2025' },
  { id: '5', title: 'Bureau à Domicile Contemporain', category: 'Bureau', status: 'archived', views: 98, likes: 7, images: 6, createdAt: '20 Dec 2024' },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  published: { label: 'Publié', className: 'bg-emerald-100 text-emerald-800' },
  draft: { label: 'Brouillon', className: 'bg-yellow-100 text-yellow-800' },
  archived: { label: 'Archivé', className: 'bg-gray-100 text-gray-800' },
};

export default function ProProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Gestion du Portfolio</h1>
              <p className="mt-1 text-gray-500">Gérez vos projets et réalisations</p>
            </div>
            <Link href="/projects/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau projet
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un projet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'published', 'draft', 'archived'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      {status === 'all' ? 'Tous' : statusStyles[status]?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-10 w-10" />}
              title="Aucun projet trouvé"
              description="Ajoutez votre premier projet pour le montrer à vos clients potentiels."
            />
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                        <FolderOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                          <Badge className={statusStyles[project.status].className}>
                            {statusStyles[project.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {project.category} · {project.images} photos · Créé le {project.createdAt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" /> {project.views} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" /> {project.likes} likes
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
