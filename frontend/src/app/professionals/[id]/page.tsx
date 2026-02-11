'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface ProfessionalProject {
  _id: string;
  title: string;
  images: { url: string; caption?: string }[];
  category: string;
  room: string;
  likes: number;
  views: number;
}

interface ProfessionalProfile {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  professionalInfo?: {
    companyName?: string;
    services?: string[];
    rating?: { average: number; count: number };
    verified?: boolean;
    description?: string;
    yearsOfExperience?: number;
    website?: string;
  };
  createdAt?: string;
}

// Mock data
const mockProfessional: ProfessionalProfile = {
  _id: 'pro1',
  firstName: 'Sophie',
  lastName: 'Dubois',
  location: { city: 'Paris', state: 'Île-de-France', country: 'France' },
  professionalInfo: {
    companyName: 'Dubois Design Intérieur',
    services: ['Architecture intérieure', 'Décoration', 'Rénovation', 'Conseil en aménagement'],
    rating: { average: 4.8, count: 42 },
    verified: true,
    description: 'Architecte d\'intérieur passionnée par les espaces contemporains. Avec plus de 15 ans d\'expérience, je transforme vos idées en réalité. Spécialisée dans les rénovations haut de gamme et les projets résidentiels.',
    yearsOfExperience: 15,
    website: 'www.dubois-design.fr',
  },
  createdAt: '2023-06-15T00:00:00.000Z',
};

const mockProjects: ProfessionalProject[] = [
  {
    _id: 'p1',
    title: 'Rénovation appartement haussmannien',
    images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', caption: 'Salon principal' }],
    category: 'renovation',
    room: 'salon',
    likes: 89,
    views: 1200,
  },
  {
    _id: 'p2',
    title: 'Cuisine moderne ouverte',
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', caption: 'Vue d\'ensemble' }],
    category: 'renovation',
    room: 'cuisine',
    likes: 56,
    views: 890,
  },
  {
    _id: 'p3',
    title: 'Suite parentale contemporaine',
    images: [{ url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300&fit=crop', caption: 'Chambre' }],
    category: 'decoration',
    room: 'chambre',
    likes: 42,
    views: 650,
  },
];

export default function ProfessionalDetailPage() {
  const params = useParams();
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [projects, setProjects] = useState<ProfessionalProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await api.get<ProfessionalProfile>(`/users/professionals/${params.id}`);
        if (response.success && response.data) {
          setProfessional(response.data);
        }
      } catch {
        setProfessional(mockProfessional);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await api.get<ProfessionalProject[]>(`/projects/professional/${params.id}`);
        if (response.success && response.data) {
          setProjects(response.data);
        } else {
          setProjects(mockProjects);
        }
      } catch {
        setProjects(mockProjects);
      }
    };

    fetchProfessional();
    fetchProjects();
  }, [params.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </Layout>
    );
  }

  if (!professional) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Professionnel non trouvé</h2>
            <Link href="/professionals">
              <Button>Retour à l&apos;annuaire</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const info = professional.professionalInfo;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/professionals" className="hover:text-emerald-600">Professionnels</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{professional.firstName} {professional.lastName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <Card className="mb-6">
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-emerald-700">
                        {professional.firstName.charAt(0)}{professional.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {professional.firstName} {professional.lastName}
                        </h1>
                        {info?.verified && (
                          <Badge className="bg-green-100 text-green-800">✓ Vérifié</Badge>
                        )}
                      </div>
                      {info?.companyName && (
                        <p className="text-lg text-gray-600">{info.companyName}</p>
                      )}
                      {professional.location?.city && (
                        <p className="text-gray-500 mt-1">
                          📍 {professional.location.city}
                          {professional.location.state ? `, ${professional.location.state}` : ''}
                          {professional.location.country ? `, ${professional.location.country}` : ''}
                        </p>
                      )}
                      {info?.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{info.rating.average.toFixed(1)}</span>
                          <span className="text-gray-500">({info.rating.count} avis)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              {info?.description && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>À propos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{info.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Services */}
              {info?.services && info.services.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Services proposés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {info.services.map((service) => (
                        <Badge key={service} variant="secondary" className="text-sm py-1 px-3">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Portfolio / Projects Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <Link key={project._id} href={`/projects/${project._id}`}>
                          <div className="group relative overflow-hidden rounded-lg">
                            <img
                              src={project.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop'}
                              alt={project.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h4 className="text-sm font-semibold line-clamp-1">{project.title}</h4>
                              <div className="flex items-center gap-3 text-xs mt-1">
                                <span>❤️ {project.likes}</span>
                                <span>👁️ {project.views}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-lg mb-2">Pas encore de projets</p>
                      <p className="text-sm">Les projets de ce professionnel apparaîtront ici</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <Button className="w-full mb-3">Demander un devis</Button>
                  <Button variant="outline" className="w-full">
                    Contacter
                  </Button>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
                  <div className="space-y-3 text-sm">
                    {info?.yearsOfExperience && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expérience</span>
                        <span className="font-medium">{info.yearsOfExperience} ans</span>
                      </div>
                    )}
                    {professional.location?.city && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ville</span>
                        <span className="font-medium">{professional.location.city}</span>
                      </div>
                    )}
                    {info?.website && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Site web</span>
                        <span className="font-medium text-emerald-600">{info.website}</span>
                      </div>
                    )}
                    {professional.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Membre depuis</span>
                        <span className="font-medium">
                          {new Date(professional.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Avis clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-gray-400 text-sm">
                    Pas encore d&apos;avis
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
