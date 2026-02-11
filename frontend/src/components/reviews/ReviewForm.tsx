'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RatingInput } from '@/components/ui/rating';
import { CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  entityType: 'professional' | 'product';
  entityName: string;
  onSubmit?: (review: { rating: number; title: string; content: string }) => void;
}

export function ReviewForm({ entityType, entityName, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; content?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const entityLabel = entityType === 'professional' ? 'le professionnel' : 'le produit';

  const validate = (): boolean => {
    const newErrors: { rating?: string; content?: string } = {};
    if (rating === 0) newErrors.rating = 'Veuillez attribuer une note.';
    if (content.length < 10) newErrors.content = 'Le commentaire doit contenir au moins 10 caractères.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({ rating, title, content });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Merci pour votre avis !</h3>
          <p className="text-sm text-gray-600">
            Votre avis sur {entityLabel} <span className="font-medium">{entityName}</span> a bien été envoyé.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Donner votre avis sur {entityLabel} {entityName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Note</Label>
            <RatingInput value={rating} onChange={setRating} size="lg" />
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Titre (optionnel)</Label>
            <Input
              id="review-title"
              placeholder="Résumez votre expérience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="review-content">Commentaire</Label>
            <textarea
              id="review-content"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Décrivez votre expérience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Publier mon avis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
