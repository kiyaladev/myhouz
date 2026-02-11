'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

interface Discussion {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: { _id: string; firstName: string; lastName: string };
  tags: string[];
  replies: number;
  views: number;
  isSolved: boolean;
  lastActivity: string;
  createdAt: string;
}

const mockDiscussions: Discussion[] = [
  {
    _id: '1',
    title: 'Quel revêtement de sol pour une cuisine ouverte ?',
    content: 'Bonjour, je suis en train de rénover ma cuisine ouverte sur le salon et je me demande quel type de sol choisir. Je veux quelque chose de pratique et esthétique...',
    category: 'renovation',
    author: { _id: 'u1', firstName: 'Thomas', lastName: 'Petit' },
    tags: ['cuisine', 'sol', 'rénovation'],
    replies: 12,
    views: 245,
    isSolved: true,
    lastActivity: '2025-02-10T14:30:00.000Z',
    createdAt: '2025-02-08T10:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Budget réaliste pour une rénovation de salle de bain ?',
    content: 'J\'aimerais savoir combien prévoir pour rénover entièrement une salle de bain de 6m². Douche italienne, double vasque, carrelage sol et murs...',
    category: 'budget',
    author: { _id: 'u2', firstName: 'Camille', lastName: 'Leroy' },
    tags: ['salle de bain', 'budget', 'rénovation'],
    replies: 8,
    views: 189,
    isSolved: false,
    lastActivity: '2025-02-09T16:00:00.000Z',
    createdAt: '2025-02-07T08:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Peinture écologique : vos recommandations ?',
    content: 'Je cherche des marques de peinture écologique (faible COV) pour repeindre les chambres des enfants. Quelles sont vos expériences ?',
    category: 'materiaux',
    author: { _id: 'u3', firstName: 'Julie', lastName: 'Moreau' },
    tags: ['peinture', 'écologie', 'chambre'],
    replies: 15,
    views: 312,
    isSolved: true,
    lastActivity: '2025-02-11T09:00:00.000Z',
    createdAt: '2025-02-05T12:00:00.000Z',
  },
  {
    _id: '4',
    title: 'Comment aménager un petit balcon de 4m² ?',
    content: 'Mon balcon fait seulement 4m² mais je voudrais en faire un vrai petit coin de paradis. Des idées d\'aménagement ?',
    category: 'amenagement',
    author: { _id: 'u4', firstName: 'Antoine', lastName: 'Garcia' },
    tags: ['balcon', 'aménagement', 'extérieur'],
    replies: 6,
    views: 156,
    isSolved: false,
    lastActivity: '2025-02-10T11:00:00.000Z',
    createdAt: '2025-02-09T15:00:00.000Z',
  },
];

const categories = [
  { value: 'all', label: 'Tous' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'amenagement', label: 'Aménagement' },
  { value: 'materiaux', label: 'Matériaux' },
  { value: 'budget', label: 'Budget' },
  { value: 'autre', label: 'Autre' },
];

const categoryLabels: Record<string, string> = {
  renovation: 'Rénovation',
  decoration: 'Décoration',
  amenagement: 'Aménagement',
  materiaux: 'Matériaux',
  budget: 'Budget',
  autre: 'Autre',
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

export default function ForumPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await api.get<Discussion[]>('/forum');
        if (response.success && response.data) {
          setDiscussions(response.data);
        } else {
          setDiscussions(mockDiscussions);
        }
      } catch {
        setDiscussions(mockDiscussions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredDiscussions.length / perPage));
  const paginatedDiscussions = filteredDiscussions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Forum &amp; Discussions</h1>
                <p className="text-gray-600 mt-1">
                  Posez vos questions, partagez vos expériences et trouvez des conseils
                </p>
              </div>
              <Link href="/forum/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Poser une question
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Rechercher une discussion..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setSelectedCategory(cat.value); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-emerald-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Discussions List */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement des discussions...</div>
          ) : paginatedDiscussions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Aucune discussion trouvée.</div>
          ) : (
            <div className="space-y-3">
              {paginatedDiscussions.map((discussion) => (
                <Link key={discussion._id} href={`/forum/${discussion._id}`}>
                  <Card className="hover:shadow-md transition-shadow duration-200 mb-3">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Author Avatar */}
                        <div className="hidden sm:flex w-10 h-10 bg-emerald-100 rounded-full items-center justify-center flex-shrink-0">
                          <span className="text-emerald-700 font-semibold text-sm">
                            {discussion.author.firstName.charAt(0)}
                            {discussion.author.lastName.charAt(0)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-base font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                              {discussion.title}
                            </h3>
                            {discussion.isSolved && (
                              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                ✓ Résolu
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {discussion.content}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[discussion.category] || discussion.category}
                            </Badge>
                            <span>
                              {discussion.author.firstName} {discussion.author.lastName}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {discussion.replies} réponses
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {discussion.views} vues
                            </span>
                            <span>{formatTimeAgo(discussion.lastActivity)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Précédent
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
