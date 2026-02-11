'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { RatingDisplay } from '@/components/ui/rating';
import {
  ArrowLeft,
  Star,
  MessageSquare,
  ThumbsUp,
  Search,
  Send,
} from 'lucide-react';

interface Review {
  id: string;
  client: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'approved' | 'pending';
  response?: string;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    client: 'Sophie Bernard',
    rating: 5,
    title: 'Travail exceptionnel',
    comment: 'La rénovation de notre cuisine a dépassé toutes nos attentes. Très professionnel et à l\'écoute de nos besoins.',
    date: '10 Jan 2025',
    status: 'approved',
    helpful: 12,
  },
  {
    id: '2',
    client: 'Marc Dubois',
    rating: 4,
    title: 'Très bon travail',
    comment: 'Aménagement du salon réussi. Quelques retards mais le résultat final est superbe. Je recommande.',
    date: '5 Jan 2025',
    status: 'approved',
    response: 'Merci Marc ! Nous sommes ravis que le résultat vous plaise. Désolé pour les retards, nous travaillons à améliorer nos délais.',
    helpful: 8,
  },
  {
    id: '3',
    client: 'Claire Moreau',
    rating: 5,
    title: 'Service impeccable',
    comment: 'De la conception à la réalisation, tout a été parfait. L\'équipe est très professionnelle et les finitions sont soignées.',
    date: '28 Dec 2024',
    status: 'approved',
    helpful: 15,
  },
  {
    id: '4',
    client: 'Jean-Pierre Leroy',
    rating: 3,
    title: 'Correct mais peut mieux faire',
    comment: 'Le travail est correct mais la communication pourrait être améliorée. Des retards non communiqués.',
    date: '20 Dec 2024',
    status: 'pending',
    helpful: 3,
  },
];

export default function ProReviewsPage() {
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  const filteredReviews = mockReviews.filter((review) =>
    review.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Avis</h1>
              <p className="mt-1 text-gray-500">Consultez et répondez aux avis de vos clients</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                <div className="flex justify-center my-1">
                  <RatingDisplay value={averageRating} size="sm" />
                </div>
                <p className="text-sm text-gray-500">Note moyenne</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{mockReviews.length}</p>
                <p className="text-sm text-gray-500">Total avis</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {mockReviews.filter((r) => r.response).length}
                </p>
                <p className="text-sm text-gray-500">Réponses envoyées</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {mockReviews.filter((r) => !r.response).length}
                </p>
                <p className="text-sm text-gray-500">En attente de réponse</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans les avis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <EmptyState
              icon={<Star className="h-10 w-10" />}
              title="Aucun avis trouvé"
              description="Vos avis clients apparaîtront ici."
            />
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{review.client}</h3>
                          <Badge className={review.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}>
                            {review.status === 'approved' ? 'Approuvé' : 'En attente'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <RatingDisplay value={review.rating} size="sm" />
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <ThumbsUp className="h-4 w-4" />
                        {review.helpful}
                      </div>
                    </div>

                    {/* Review Content */}
                    <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{review.comment}</p>

                    {/* Response */}
                    {review.response ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-800">Votre réponse</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.response}</p>
                      </div>
                    ) : (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Répondre à cet avis</p>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Écrivez votre réponse..."
                            value={replyText[review.id] || ''}
                            onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                            className="flex-1"
                          />
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={!replyText[review.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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
