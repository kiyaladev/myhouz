'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Bookmark, Expand, MessageCircle } from 'lucide-react';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import Lightbox from '../../../components/ui/lightbox';
import SaveToIdeabookModal from '../../../components/SaveToIdeabookModal';
import { useAuth } from '../../../contexts/AuthContext';

interface ProjectDetail {
  _id: string;
  title: string;
  description: string;
  images: Array<{ url: string; caption?: string }>;
  category: string;
  room: string;
  style: string[];
  professional: {
    _id: string;
    firstName: string;
    lastName: string;
    professionalInfo?: {
      companyName?: string;
      rating?: { average: number; count: number };
    };
    profileImage?: string;
    location?: { city?: string };
  };
  likes: number;
  views: number;
  budget?: { min: number; max: number; currency: string };
  duration?: string;
  location?: { city?: string; state?: string };
  tags?: string[];
  createdAt: string;
}

// Mock data for when API is unavailable
const mockProject: ProjectDetail = {
  _id: '1',
  title: 'Cuisine moderne avec îlot central',
  description: 'Rénovation complète d\'une cuisine avec des matériaux contemporains et un design épuré. Le projet comprenait la démolition de l\'ancienne cuisine, la création d\'un nouvel espace ouvert avec un îlot central multifonctionnel, et l\'installation de nouveaux appareils haut de gamme. Les matériaux utilisés incluent du marbre de Carrare pour les plans de travail, du chêne naturel pour les armoires, et de l\'acier inoxydable pour les appareils.',
  images: [
    { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Vue d\'ensemble de la cuisine' },
    { url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=600&fit=crop', caption: 'Îlot central' },
    { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop', caption: 'Détails des finitions' },
  ],
  category: 'renovation',
  room: 'cuisine',
  style: ['moderne', 'contemporain', 'minimaliste'],
  professional: {
    _id: 'pro1',
    firstName: 'Sophie',
    lastName: 'Dubois',
    professionalInfo: {
      companyName: 'Dubois Design Intérieur',
      rating: { average: 4.8, count: 42 },
    },
    location: { city: 'Paris' },
  },
  likes: 124,
  views: 1250,
  budget: { min: 15000, max: 25000, currency: 'EUR' },
  duration: '3 mois',
  location: { city: 'Paris', state: 'Île-de-France' },
  tags: ['cuisine', 'rénovation', 'moderne', 'îlot central'],
  createdAt: '2025-01-15T10:00:00.000Z',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get<ProjectDetail>(`/projects/${params.id}`);
        if (response.success && response.data) {
          setProject(response.data);
        }
      } catch {
        // Fallback to mock data if API is unavailable
        setProject(mockProject);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    try {
      await api.post(`/projects/${params.id}/like`);
      setIsLiked(!isLiked);
      if (project) {
        setProject({
          ...project,
          likes: isLiked ? project.likes - 1 : project.likes + 1
        });
      }
    } catch {
      // Ignore error
    }
  };

  const handleSaveToIdeabook = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleContactProfessional = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (project?.professional?._id) {
      router.push(`/messages?to=${project.professional._id}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement du projet...</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h2>
            <p className="text-gray-500 mb-4">Le projet que vous cherchez n&apos;existe pas.</p>
            <Link href="/projects">
              <Button>Retour aux projets</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Lightbox */}
        <Lightbox
          images={project.images}
          initialIndex={selectedImage}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />

        {/* Save to Ideabook Modal */}
        <SaveToIdeabookModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          itemType="project"
          itemId={project._id}
        />

        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/projects" className="hover:text-emerald-600">Projets</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{project.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative group">
                  <img
                    src={project.images[selectedImage]?.url || project.images[0]?.url}
                    alt={project.images[selectedImage]?.caption || project.title}
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  {/* Image overlay actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      title="Plein écran"
                    >
                      <Expand className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleLike}
                      className={`p-2 rounded-full transition-colors ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-black/50 hover:bg-black/70 text-white'
                      }`}
                      title="J'aime"
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleSaveToIdeabook}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      title="Sauvegarder"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                      {selectedImage + 1} / {project.images.length}
                    </div>
                  )}
                </div>
                {project.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {project.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === idx ? 'border-emerald-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Description */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.style.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                    <Badge variant="outline">{project.room}</Badge>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails du projet</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.budget && (
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-semibold text-gray-900">
                          {project.budget.min.toLocaleString('fr-FR')} - {project.budget.max.toLocaleString('fr-FR')} €
                        </p>
                      </div>
                    )}
                    {project.duration && (
                      <div>
                        <p className="text-sm text-gray-500">Durée</p>
                        <p className="font-semibold text-gray-900">{project.duration}</p>
                      </div>
                    )}
                    {project.location?.city && (
                      <div>
                        <p className="text-sm text-gray-500">Lieu</p>
                        <p className="font-semibold text-gray-900">
                          {project.location.city}{project.location.state ? `, ${project.location.state}` : ''}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(project.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Professional Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Réalisé par</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold">
                        {project.professional.firstName.charAt(0)}{project.professional.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {project.professional.firstName} {project.professional.lastName}
                      </p>
                      {project.professional.professionalInfo?.companyName && (
                        <p className="text-sm text-gray-500">
                          {project.professional.professionalInfo.companyName}
                        </p>
                      )}
                    </div>
                  </div>
                  {project.professional.professionalInfo?.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">
                        {project.professional.professionalInfo.rating.average.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({project.professional.professionalInfo.rating.count} avis)
                      </span>
                    </div>
                  )}
                  {project.professional.location?.city && (
                    <p className="text-sm text-gray-500 mb-4">
                      📍 {project.professional.location.city}
                    </p>
                  )}
                  <Link href={`/professionals/${project.professional._id}`}>
                    <Button className="w-full mb-2">Voir le profil</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContactProfessional}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex gap-2">
                    <Button
                      variant={isLiked ? 'default' : 'outline'}
                      className={`flex-1 ${isLiked ? 'bg-red-500 hover:bg-red-600' : ''}`}
                      onClick={handleLike}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Aimé' : 'Aimer'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleSaveToIdeabook}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{project.likes}</p>
                      <p className="text-sm text-gray-500">Likes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{project.views}</p>
                      <p className="text-sm text-gray-500">Vues</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{project.images.length}</p>
                      <p className="text-sm text-gray-500">Photos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
