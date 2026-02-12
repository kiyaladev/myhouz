'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Search,
  Eye,
  MessageSquareReply,
  FileText,
  Clock,
  CalendarDays,
  Wallet,
} from 'lucide-react';

interface Quote {
  id: string;
  clientName: string;
  category: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined';
  createdAt: string;
}

const mockQuotes: Quote[] = [
  { id: '1', clientName: 'Marie Dupont', category: 'Rénovation cuisine', description: 'Rénovation complète de la cuisine avec îlot central, nouveaux plans de travail en quartz et installation d\'électroménager encastré.', budgetMin: 15000, budgetMax: 25000, timeline: '2-3 mois', status: 'pending', createdAt: '15 Jan 2025' },
  { id: '2', clientName: 'Jean-Pierre Martin', category: 'Salle de bain', description: 'Transformation de la salle de bain principale : douche à l\'italienne, double vasque et carrelage mosaïque.', budgetMin: 8000, budgetMax: 12000, timeline: '1-2 mois', status: 'responded', createdAt: '12 Jan 2025' },
  { id: '3', clientName: 'Sophie Laurent', category: 'Aménagement extérieur', description: 'Création d\'une terrasse en bois composite avec pergola bioclimatique et éclairage intégré.', budgetMin: 10000, budgetMax: 18000, timeline: '1 mois', status: 'accepted', createdAt: '8 Jan 2025' },
  { id: '4', clientName: 'Thomas Bernard', category: 'Peinture intérieure', description: 'Peinture complète d\'un appartement 4 pièces, préparation des murs et finitions soignées.', budgetMin: 3000, budgetMax: 5000, timeline: '2 semaines', status: 'declined', createdAt: '5 Jan 2025' },
  { id: '5', clientName: 'Claire Moreau', category: 'Rénovation salon', description: 'Ouverture d\'un mur porteur entre salon et salle à manger, création d\'une bibliothèque sur mesure et pose de parquet massif.', budgetMin: 20000, budgetMax: 35000, timeline: '2-3 mois', status: 'pending', createdAt: '3 Jan 2025' },
  { id: '6', clientName: 'Antoine Leroy', category: 'Électricité', description: 'Mise aux normes de l\'installation électrique d\'une maison de 120m², tableau électrique et prises.', budgetMin: 5000, budgetMax: 8000, timeline: '3 semaines', status: 'accepted', createdAt: '28 Dec 2024' },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
  responded: { label: 'Répondu', className: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepté', className: 'bg-emerald-100 text-emerald-800' },
  declined: { label: 'Refusé', className: 'bg-red-100 text-red-800' },
};

const filterLabels: Record<string, string> = {
  all: 'Tous',
  pending: 'En attente',
  responded: 'Répondu',
  accepted: 'Accepté',
  declined: 'Refusé',
};

export default function ProQuotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredQuotes = mockQuotes.filter((quote) => {
    const matchesSearch =
      quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Devis</h1>
              <p className="mt-1 text-gray-500">Consultez et répondez aux demandes de devis de vos clients</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total devis', value: '23', color: 'bg-gray-100 text-gray-600' },
              { label: 'En attente', value: '8', color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Acceptés', value: '12', color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Refusés', value: '3', color: 'bg-red-100 text-red-600' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par client ou description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'pending', 'responded', 'accepted', 'declined'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    >
                      {filterLabels[status]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes List */}
          {filteredQuotes.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-10 w-10" />}
              title="Aucun devis trouvé"
              description="Aucune demande de devis ne correspond à vos critères de recherche."
            />
          ) : (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{quote.clientName}</h3>
                          <Badge className={statusStyles[quote.status].className}>
                            {statusStyles[quote.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-emerald-700 mb-1">{quote.category}</p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quote.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Wallet className="h-4 w-4" /> {quote.budgetMin.toLocaleString()} – {quote.budgetMax.toLocaleString()} €
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {quote.timeline}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" /> {quote.createdAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                        {quote.status === 'pending' && (
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <MessageSquareReply className="h-4 w-4 mr-2" />
                            Répondre
                          </Button>
                        )}
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
