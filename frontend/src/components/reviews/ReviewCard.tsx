'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { RatingDisplay } from '@/components/ui/rating';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageSquare } from 'lucide-react';

interface ReviewCardProps {
  author: { name: string; avatar?: string };
  rating: number;
  date: string;
  content: string;
  helpful?: { yes: number; no: number };
  response?: { author: string; content: string; date: string };
  verified?: boolean;
}

export function ReviewCard({
  author,
  rating,
  date,
  content,
  helpful,
  response,
  verified,
}: ReviewCardProps) {
  const [helpfulVote, setHelpfulVote] = useState<'yes' | 'no' | null>(null);

  const yesCount = (helpful?.yes ?? 0) + (helpfulVote === 'yes' ? 1 : 0);
  const noCount = (helpful?.no ?? 0) + (helpfulVote === 'no' ? 1 : 0);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-sm">
                  {author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{author.name}</span>
                {verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Vérifié
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{date}</span>
            </div>
          </div>
          <RatingDisplay value={rating} size="sm" />
        </div>

        {/* Review content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{content}</p>

        {/* Helpful buttons */}
        {helpful && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs text-gray-500">Cet avis vous a été utile ?</span>
            <button
              type="button"
              onClick={() => setHelpfulVote(helpfulVote === 'yes' ? null : 'yes')}
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                helpfulVote === 'yes'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-100'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Utile ({yesCount})
            </button>
            <button
              type="button"
              onClick={() => setHelpfulVote(helpfulVote === 'no' ? null : 'no')}
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                helpfulVote === 'no'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Pas utile ({noCount})
            </button>
          </div>
        )}

        {/* Professional response */}
        {response && (
          <div className="ml-6 mt-2 p-4 bg-gray-50 rounded-lg border-l-2 border-emerald-500">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-900">
                Réponse de {response.author}
              </span>
              <span className="text-xs text-gray-500">{response.date}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{response.content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
