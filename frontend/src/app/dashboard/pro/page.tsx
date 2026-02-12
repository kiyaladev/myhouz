'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye,
  FileText,
  Star,
  FolderOpen,
  ArrowRight,
  Heart,
  Plus,
  Package,
  MessageSquare,
  Settings,
  BarChart3,
  CreditCard,
  ShoppingCart,
} from 'lucide-react';

// Mock data
const statsCards = [
  { label: 'Vues du profil', value: '1 247', icon: Eye, color: 'bg-emerald-100 text-emerald-600', change: '+12% ce mois' },
  { label: 'Demandes de devis', value: '23', icon: FileText, color: 'bg-blue-100 text-blue-600', change: '+5 cette semaine' },
  { label: 'Note moyenne', value: '4.8/5', icon: Star, color: 'bg-amber-100 text-amber-600', change: 'basé sur 156 avis' },
  { label: 'Projets publiés', value: '18', icon: FolderOpen, color: 'bg-purple-100 text-purple-600', change: '' },
];

const recentRequests = [
  { id: '1', client: 'Marie Lefevre', type: 'Rénovation cuisine', date: '15 Jan 2025', status: 'Nouveau' as const },
  { id: '2', client: 'Pierre Martin', type: 'Aménagement salon', date: '14 Jan 2025', status: 'En cours' as const },
  { id: '3', client: 'Claire Dupont', type: 'Décoration chambre', date: '12 Jan 2025', status: 'Répondu' as const },
];

const requestStatusStyles: Record<string, string> = {
  'Nouveau': 'bg-emerald-100 text-emerald-800',
  'En cours': 'bg-yellow-100 text-yellow-800',
  'Répondu': 'bg-gray-100 text-gray-800',
};

const recentProjects = [
  { id: '1', title: 'Rénovation Appartement Haussmannien', views: 342, likes: 28 },
  { id: '2', title: 'Cuisine Moderne Minimaliste', views: 215, likes: 19 },
  { id: '3', title: 'Terrasse Rooftop Végétalisée', views: 189, likes: 15 },
];

const recentReviews = [
  { id: '1', client: 'Sophie Bernard', rating: 5, text: 'Travail exceptionnel ! La rénovation de notre cuisine a dépassé toutes nos attentes. Très professionnel et à l\'écoute.', date: '10 Jan 2025' },
  { id: '2', client: 'Marc Dubois', rating: 4, text: 'Très bon travail sur l\'aménagement du salon. Quelques retards mais le résultat final est superbe.', date: '5 Jan 2025' },
];

export default function ProDashboardPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Professionnel</h1>
            <p className="mt-1 text-gray-500">Gérez votre activité et suivez vos performances</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${card.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-500">{card.label}</p>
                      </div>
                    </div>
                    {card.change && (
                      <p className="text-xs text-gray-400 mt-2">{card.change}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Demandes récentes */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Demandes récentes
                </CardTitle>
                <Link href="/dashboard/pro/quotes" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                  Voir tout <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Client</th>
                      <th className="pb-3 font-medium">Type de projet</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Statut</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="py-3 font-medium text-gray-900">{request.client}</td>
                        <td className="py-3 text-gray-600">{request.type}</td>
                        <td className="py-3 text-gray-500">{request.date}</td>
                        <td className="py-3">
                          <Badge className={requestStatusStyles[request.status]}>
                            {request.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Mes Projets */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderOpen className="h-5 w-5 text-emerald-600" />
                  Mes Projets
                </CardTitle>
                <Link href="/dashboard/pro/projects" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                  Voir tout <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg overflow-hidden">
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      <FolderOpen className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">{project.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" /> {project.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" /> {project.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avis Récents */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-emerald-600" />
                  Avis Récents
                </CardTitle>
                <Link href="/dashboard/pro/reviews" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                  Voir tout <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">{review.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-gray-900">{review.client}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/pro/projects">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un projet
                  </Button>
                </Link>
                <Link href="/dashboard/pro/products">
                  <Button variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Gérer mes produits
                  </Button>
                </Link>
                <Link href="/dashboard/pro/reviews">
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Voir mes avis
                  </Button>
                </Link>
                <Link href="/dashboard/pro/settings">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Profil professionnel
                  </Button>
                </Link>
                <Link href="/dashboard/pro/quotes">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Gérer les devis
                  </Button>
                </Link>
                <Link href="/dashboard/pro/statistics">
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistiques
                  </Button>
                </Link>
                <Link href="/dashboard/pro/subscription">
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Abonnement
                  </Button>
                </Link>
                <Link href="/dashboard/pro/pos">
                  <Button variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Point de Vente (POS)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
