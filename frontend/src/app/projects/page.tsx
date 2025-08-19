'use client';

import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  room: string;
  style: string[];
  professional: {
    name: string;
    avatar: string;
    location: string;
  };
  likes: number;
  views: number;
}

export default function ProjectsPage() {
  const [filters, setFilters] = useState({
    category: 'all',
    room: 'all',
    style: 'all',
    search: ''
  });

  // Mock data - à remplacer par des appels API
  const projects: Project[] = [
    {
      id: '1',
      title: 'Cuisine moderne avec îlot central',
      description: 'Rénovation complète d\'une cuisine avec des matériaux contemporains et un design épuré.',
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
      category: 'renovation',
      room: 'cuisine',
      style: ['moderne', 'contemporain'],
      professional: {
        name: 'Sophie Dubois',
        avatar: '',
        location: 'Paris, France'
      },
      likes: 124,
      views: 1250
    },
    {
      id: '2',
      title: 'Salon scandinave chaleureux',
      description: 'Aménagement d\'un salon dans un style scandinave avec des tons neutres et du bois naturel.',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
      category: 'decoration',
      room: 'salon',
      style: ['scandinave', 'cosy'],
      professional: {
        name: 'Marie Larsson',
        avatar: '',
        location: 'Lyon, France'
      },
      likes: 89,
      views: 890
    },
    {
      id: '3',
      title: 'Salle de bain industrielle',
      description: 'Transformation d\'une salle de bain avec des éléments industriels et des matériaux bruts.',
      images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop'],
      category: 'renovation',
      room: 'salle-de-bain',
      style: ['industriel', 'loft'],
      professional: {
        name: 'Pierre Martin',
        avatar: '',
        location: 'Marseille, France'
      },
      likes: 67,
      views: 634
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'renovation', label: 'Rénovation' },
    { value: 'decoration', label: 'Décoration' },
    { value: 'architecture', label: 'Architecture' }
  ];

  const rooms = [
    { value: 'all', label: 'Toutes les pièces' },
    { value: 'cuisine', label: 'Cuisine' },
    { value: 'salon', label: 'Salon' },
    { value: 'chambre', label: 'Chambre' },
    { value: 'salle-de-bain', label: 'Salle de bain' },
    { value: 'exterieur', label: 'Extérieur' }
  ];

  const styles = [
    { value: 'all', label: 'Tous les styles' },
    { value: 'moderne', label: 'Moderne' },
    { value: 'contemporain', label: 'Contemporain' },
    { value: 'scandinave', label: 'Scandinave' },
    { value: 'industriel', label: 'Industriel' },
    { value: 'classique', label: 'Classique' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Galerie de projets
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez des milliers de projets réalisés par nos professionnels et trouvez l&apos;inspiration pour votre intérieur
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="search">Recherche</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pièce</Label>
                <Select value={filters.room} onValueChange={(value) => handleFilterChange('room', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une pièce" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.value} value={room.value}>{room.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={filters.style} onValueChange={(value) => handleFilterChange('style', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map(style => (
                      <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Plus populaires
              </Button>
              <Button variant="outline" size="sm">
                Plus récents
              </Button>
              <Button variant="outline" size="sm">
                Plus vus
              </Button>
            </div>
          </div>

          {/* Grille de projets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {project.professional.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {project.professional.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.professional.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {project.likes}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {project.views}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.style.slice(0, 2).map((style) => (
                        <Badge key={style} variant="secondary" className="text-xs">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline">Précédent</Button>
              <Button>1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Suivant</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}