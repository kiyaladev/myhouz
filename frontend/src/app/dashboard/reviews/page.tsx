'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RatingDisplay } from '@/components/ui/rating';
import { Star, ArrowLeft, Pencil, Trash2 } from 'lucide-react';

const mockUserReviews = [
  {
    id: '1',
    entityType: 'professional' as const,
    entityName: 'Rénovation Plus',
    rating: 5,
    content:
      'Travail exceptionnel ! L\'équipe a été très professionnelle du début à la fin.',
    date: '15 Jan 2025',
    status: 'approved' as const,
    helpful: { yes: 12, no: 1 },
  },
  {
    id: '2',
    entityType: 'product' as const,
    entityName: 'Canapé modulable Milano',
    rating: 4,
    content:
      'Très confortable et de bonne qualité. La livraison a été rapide.',
    date: '10 Jan 2025',
    status: 'approved' as const,
    helpful: { yes: 5, no: 0 },
  },
  {
    id: '3',
    entityType: 'professional' as const,
    entityName: 'Dubois Design Intérieur',
    rating: 3,
    content:
      'Travail correct mais communication perfectible. Le résultat est satisfaisant.',
    date: '20 Déc 2024',
    status: 'pending' as const,
    helpful: { yes: 2, no: 1 },
  },
];

const entityTypeLabels = {
  professional: 'Professionnel',
  product: 'Produit',
};

const statusLabels = {
  approved: { label: 'Approuvé', className: 'bg-green-100 text-green-800' },
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
};

export default function DashboardReviewsPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Avis</h1>
              <p className="mt-1 text-gray-500">{mockUserReviews.length} avis rédigés</p>
            </div>
          </div>

          {/* Reviews list */}
          {mockUserReviews.length === 0 ? (
            <EmptyState
              icon={<Star className="w-12 h-12" />}
              title="Aucun avis"
              description="Vous n'avez pas encore rédigé d'avis. Partagez votre expérience avec la communauté !"
            />
          ) : (
            <div className="space-y-4">
              {mockUserReviews.map((review) => {
                const status = statusLabels[review.status];
                return (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {entityTypeLabels[review.entityType]}
                            </Badge>
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1">{review.entityName}</h3>

                          <div className="flex items-center gap-3 mb-3">
                            <RatingDisplay value={review.rating} size="sm" />
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>

                          <div className="mt-3 text-xs text-gray-500">
                            {review.helpful.yes} personne(s) ont trouvé cet avis utile
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-emerald-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
