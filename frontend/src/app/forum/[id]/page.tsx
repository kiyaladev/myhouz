'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface Reply {
  _id: string;
  content: string;
  author: { _id: string; firstName: string; lastName: string };
  isBestAnswer: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

interface DiscussionDetail {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: { _id: string; firstName: string; lastName: string };
  tags: string[];
  replies: Reply[];
  replyCount: number;
  views: number;
  isSolved: boolean;
  lastActivity: string;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  renovation: 'Rénovation',
  decoration: 'Décoration',
  amenagement: 'Aménagement',
  materiaux: 'Matériaux',
  budget: 'Budget',
  autre: 'Autre',
};

const mockReplies: Reply[] = [
  {
    _id: 'r1',
    content: 'Pour une cuisine ouverte, je recommande le carrelage imitation parquet. C\'est résistant à l\'eau, facile d\'entretien et ça donne un rendu chaleureux.',
    author: { _id: 'u5', firstName: 'Marc', lastName: 'Dubois' },
    isBestAnswer: true,
    upvotes: 8,
    downvotes: 0,
    createdAt: '2025-02-08T12:00:00.000Z',
  },
  {
    _id: 'r2',
    content: 'Le vinyle LVT est aussi une excellente option. Très facile à poser et il y a des designs vraiment réalistes maintenant.',
    author: { _id: 'u6', firstName: 'Nathalie', lastName: 'Roy' },
    isBestAnswer: false,
    upvotes: 5,
    downvotes: 1,
    createdAt: '2025-02-08T14:00:00.000Z',
  },
  {
    _id: 'r3',
    content: 'J\'ai mis du béton ciré dans ma cuisine ouverte et je ne regrette pas. Par contre il faut bien le traiter avec un imperméabilisant.',
    author: { _id: 'u7', firstName: 'Olivier', lastName: 'Lambert' },
    isBestAnswer: false,
    upvotes: 3,
    downvotes: 0,
    createdAt: '2025-02-09T10:00:00.000Z',
  },
];

const mockDiscussion: DiscussionDetail = {
  _id: '1',
  title: 'Quel revêtement de sol pour une cuisine ouverte ?',
  content: 'Bonjour, je suis en train de rénover ma cuisine ouverte sur le salon et je me demande quel type de sol choisir. Je veux quelque chose de pratique et esthétique.\n\nJ\'hésite entre plusieurs options :\n- Carrelage imitation parquet\n- Vinyle LVT\n- Béton ciré\n- Parquet massif traité\n\nLa pièce fait environ 35m² et nous avons deux enfants en bas âge. Le budget n\'est pas illimité mais je préfère investir dans quelque chose de durable.\n\nMerci pour vos retours d\'expérience !',
  category: 'renovation',
  author: { _id: 'u1', firstName: 'Thomas', lastName: 'Petit' },
  tags: ['cuisine', 'sol', 'rénovation'],
  replies: mockReplies,
  replyCount: 12,
  views: 245,
  isSolved: true,
  lastActivity: '2025-02-10T14:30:00.000Z',
  createdAt: '2025-02-08T10:00:00.000Z',
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours} h`;
  if (diffDays === 1) return 'il y a 1 jour';
  return `il y a ${diffDays} jours`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ForumDiscussionPage() {
  const params = useParams();
  const [discussion, setDiscussion] = useState<DiscussionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replyError, setReplyError] = useState('');

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const response = await api.get<DiscussionDetail>(`/forum/${params.id}`);
        if (response.success && response.data) {
          setDiscussion(response.data);
        } else {
          setDiscussion(mockDiscussion);
        }
      } catch {
        setDiscussion(mockDiscussion);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussion();
  }, [params.id]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setReplyError('');
    try {
      const response = await api.post(`/forum/${params.id}/replies`, { content: replyContent });
      if (response.success && response.data) {
        setDiscussion(prev => prev ? {
          ...prev,
          replies: [...prev.replies, response.data as Reply],
          replyCount: prev.replyCount + 1
        } : prev);
      }
      setReplyContent('');
    } catch {
      setReplyError('Erreur lors de la publication de votre réponse. Veuillez réessayer.');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement de la discussion...</div>
        </div>
      </Layout>
    );
  }

  if (!discussion) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Discussion non trouvée</h2>
            <p className="text-gray-500 mb-4">Cette discussion n&apos;existe pas ou a été supprimée.</p>
            <Link href="/forum">
              <Button>Retour au forum</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const sortedReplies = [...discussion.replies].sort((a, b) => {
    if (a.isBestAnswer && !b.isBestAnswer) return -1;
    if (!a.isBestAnswer && b.isBestAnswer) return 1;
    return 0;
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/forum" className="hover:text-emerald-600">Forum</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 truncate">{discussion.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Discussion Header & Original Post */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge variant="outline">
                  {categoryLabels[discussion.category] || discussion.category}
                </Badge>
                {discussion.isSolved && (
                  <Badge className="bg-emerald-100 text-emerald-700">✓ Résolu</Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{discussion.title}</h1>

              {/* Author & Meta */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold text-sm">
                    {discussion.author.firstName.charAt(0)}
                    {discussion.author.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {discussion.author.firstName} {discussion.author.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Publié le {formatDate(discussion.createdAt)}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {discussion.views} vues
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                {discussion.content}
              </p>

              {/* Tags */}
              {discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reply Count */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-sm">
              {discussion.replyCount} réponses
            </Badge>
          </div>

          {/* Replies List */}
          <div className="space-y-4 mb-8">
            {sortedReplies.map((reply) => (
              <Card
                key={reply._id}
                className={reply.isBestAnswer ? 'border-2 border-emerald-500' : ''}
              >
                <CardContent className="p-5">
                  {reply.isBestAnswer && (
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Meilleure réponse
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-700 font-semibold text-xs">
                        {reply.author.firstName.charAt(0)}
                        {reply.author.lastName.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {reply.author.firstName} {reply.author.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(reply.createdAt)}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-3">
                        {reply.content}
                      </p>

                      {/* Vote Buttons */}
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          {reply.upvotes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          {reply.downvotes}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répondre</h3>
              <form onSubmit={handleSubmitReply}>
                {replyError && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {replyError}
                  </div>
                )}
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Partagez votre réponse..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={!replyContent.trim()}
                  >
                    Publier la réponse
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
