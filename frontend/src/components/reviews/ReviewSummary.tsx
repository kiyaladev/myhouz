'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RatingDisplay } from '@/components/ui/rating';
import { Star } from 'lucide-react';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: { [key: number]: number };
}

export function ReviewSummary({ averageRating, totalReviews, distribution }: ReviewSummaryProps) {

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Average rating */}
          <div className="flex flex-col items-center justify-center sm:min-w-[140px]">
            <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            <RatingDisplay value={averageRating} size="md" className="mt-2" />
            <span className="text-sm text-gray-500 mt-1">
              {totalReviews} avis
            </span>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] ?? 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-6 text-right">{star}</span>
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
