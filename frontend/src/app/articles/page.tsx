'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: { _id: string; firstName: string; lastName: string };
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  status: string;
  publishedAt: string;
  createdAt: string;
}

const mockArticles: Article[] = [
  {
    _id: '1',
    title: 'Les tendances déco 2025 : couleurs, matériaux et styles à adopter',
    slug: 'tendances-deco-2025',
    excerpt: 'Découvrez les grandes tendances décoration de cette année : du terracotta aux matériaux naturels, en passant par le style japandi qui continue de séduire.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=400&fit=crop',
    category: 'tendances',
    author: { _id: 'a1', firstName: 'Sophie', lastName: 'Martin' },
    tags: ['tendances', 'décoration', '2025'],
    readTime: 8,
    views: 3420,
    likes: 156,
    status: 'published',
    publishedAt: '2025-01-20T10:00:00.000Z',
    createdAt: '2025-01-20T10:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Comment rénover sa cuisine sans se ruiner',
    slug: 'renover-cuisine-budget',
    excerpt: 'Astuces et conseils pratiques pour transformer votre cuisine avec un budget limité. Peinture, poignées, crédence : les petits changements qui font toute la différence.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    category: 'renovation',
    author: { _id: 'a2', firstName: 'Pierre', lastName: 'Durand' },
    tags: ['rénovation', 'cuisine', 'budget'],
    readTime: 6,
    views: 2150,
    likes: 89,
    status: 'published',
    publishedAt: '2025-02-01T10:00:00.000Z',
    createdAt: '2025-02-01T10:00:00.000Z',
  },
  {
    _id: '3',
    title: '10 plantes d\'intérieur faciles à entretenir',
    slug: 'plantes-interieur-faciles',
    excerpt: 'Envie de verdure sans avoir la main verte ? Voici notre sélection de plantes robustes qui embelliront votre intérieur sans demander trop d\'attention.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    category: 'decoration',
    author: { _id: 'a1', firstName: 'Sophie', lastName: 'Martin' },
    tags: ['plantes', 'décoration', 'intérieur'],
    readTime: 5,
    views: 1820,
    likes: 134,
    status: 'published',
    publishedAt: '2025-01-25T10:00:00.000Z',
    createdAt: '2025-01-25T10:00:00.000Z',
  },
  {
    _id: '4',
    title: 'Guide : choisir son revêtement de sol',
    slug: 'guide-revetement-sol',
    excerpt: 'Parquet, carrelage, vinyle ou béton ciré ? Comparatif complet des revêtements de sol avec leurs avantages, inconvénients et fourchettes de prix.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
    category: 'conseils',
    author: { _id: 'a3', firstName: 'Luc', lastName: 'Bernard' },
    tags: ['sol', 'revêtement', 'guide'],
    readTime: 10,
    views: 980,
    likes: 67,
    status: 'published',
    publishedAt: '2025-02-05T10:00:00.000Z',
    createdAt: '2025-02-05T10:00:00.000Z',
  },
];

const categories = [
  { value: 'all', label: 'Tous' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'decoration', label: 'Décoration' },
  { value: 'tendances', label: 'Tendances' },
  { value: 'conseils', label: 'Conseils' },
  { value: 'architecture', label: 'Architecture' },
];

const categoryLabels: Record<string, string> = {
  renovation: 'Rénovation',
  decoration: 'Décoration',
  tendances: 'Tendances',
  conseils: 'Conseils',
  architecture: 'Architecture',
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params: Record<string, string> = { page: String(page), limit: String(perPage) };
        if (activeCategory !== 'all') params.category = activeCategory;
        if (search) params.search = search;
        const response = await api.get<Article[]>('/articles', params);
        if (response.success && response.data) {
          setArticles(response.data);
        } else {
          setArticles(mockArticles);
        }
      } catch {
        setArticles(mockArticles);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, search, page]);

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Magazine &amp; Articles
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Inspirations, conseils et tendances pour sublimer votre intérieur
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={activeCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setActiveCategory(cat.value); setPage(1); }}
                    className={activeCategory === cat.value ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement des articles...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <Link href={`/articles/${featured.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative h-64 md:h-auto">
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                        <Badge className="w-fit mb-3 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          {categoryLabels[featured.category] || featured.category}
                        </Badge>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {featured.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-700 font-medium text-sm">
                                {featured.author.firstName.charAt(0)}{featured.author.lastName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {featured.author.firstName} {featured.author.lastName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{featured.readTime} min de lecture</span>
                            <span>
                              {new Date(featured.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <Card key={article._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <Link href={`/articles/${article.slug}`}>
                      <div className="relative">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          {categoryLabels[article.category] || article.category}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-700 font-medium text-xs">
                                {article.author.firstName.charAt(0)}{article.author.lastName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-700">
                              {article.author.firstName} {article.author.lastName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 pt-3 border-t">
                          <span>{article.readTime} min</span>
                          <span>·</span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Précédent
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      className={p === page ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
