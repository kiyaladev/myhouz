'use client';

import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import { Star, SlidersHorizontal } from 'lucide-react';

const mockReviews = [
  {
    author: { name: 'Marie Dupont' },
    rating: 5,
    date: '15 janvier 2025',
    content:
      'Travail exceptionnel ! L\'équipe a été très professionnelle du début à la fin. La rénovation de notre cuisine a dépassé nos attentes. Je recommande vivement.',
    helpful: { yes: 12, no: 1 },
    verified: true,
    response: {
      author: 'Rénovation Plus',
      content:
        'Merci beaucoup Marie ! Ce fut un plaisir de travailler avec vous sur ce beau projet de cuisine.',
      date: '17 janvier 2025',
    },
  },
  {
    author: { name: 'Pierre Martin', avatar: '' },
    rating: 4,
    date: '8 janvier 2025',
    content:
      'Très bon travail sur la salle de bain. Quelques jours de retard mais le résultat final est superbe. Bon rapport qualité-prix.',
    helpful: { yes: 8, no: 2 },
    verified: true,
  },
  {
    author: { name: 'Sophie Laurent' },
    rating: 3,
    date: '2 janvier 2025',
    content:
      'Le travail est correct mais la communication aurait pu être meilleure. J\'ai dû relancer plusieurs fois pour avoir des mises à jour sur l\'avancement du chantier.',
    helpful: { yes: 5, no: 3 },
    verified: false,
  },
  {
    author: { name: 'Jean Petit' },
    rating: 5,
    date: '20 décembre 2024',
    content:
      'Parfait ! Rénovation complète de notre salon avec pose de parquet et peinture. Travail soigné, propre et dans les délais. L\'équipe est très à l\'écoute.',
    helpful: { yes: 15, no: 0 },
    verified: true,
    response: {
      author: 'Rénovation Plus',
      content: 'Merci Jean pour votre confiance. Au plaisir de collaborer à nouveau !',
      date: '22 décembre 2024',
    },
  },
];

const mockDistribution = { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 };

type SortOption = 'recent' | 'rating-desc' | 'rating-asc' | 'helpful';

export default function ReviewsPage() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredAndSorted = useMemo(() => {
    let reviews = [...mockReviews];

    // Filter by rating
    if (filterRating !== null) {
      reviews = reviews.filter((r) => r.rating === filterRating);
    }

    // Sort
    switch (sortBy) {
      case 'rating-desc':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        reviews.sort((a, b) => (b.helpful?.yes ?? 0) - (a.helpful?.yes ?? 0));
        break;
      case 'recent':
      default:
        break; // Already in chronological order from mock data
    }

    return reviews;
  }, [filterRating, sortBy]);

  return (
    <Layout>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Avis <span className="text-emerald-600">clients</span>
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Découvrez ce que nos clients pensent des professionnels MyHouz.
          </p>

          {/* Summary */}
          <div className="mb-8">
            <ReviewSummary
              averageRating={4.3}
              totalReviews={100}
              distribution={mockDistribution}
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border">
            {/* Rating filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">Filtrer :</span>
              <button
                onClick={() => setFilterRating(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterRating === null
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                    filterRating === star
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {star} <Star className="h-3 w-3 fill-current" />
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="recent">Plus récents</option>
                <option value="rating-desc">Note décroissante</option>
                <option value="rating-asc">Note croissante</option>
                <option value="helpful">Plus utiles</option>
              </select>
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4 mb-12">
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun avis trouvé pour cette note.
              </div>
            ) : (
              filteredAndSorted.map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))
            )}
          </div>

          {/* Review form */}
          <ReviewForm
            entityType="professional"
            entityName="Rénovation Plus"
          />
        </div>
      </section>
    </Layout>
  );
}
