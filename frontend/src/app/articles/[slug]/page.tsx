'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface ArticleDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: { _id: string; firstName: string; lastName: string; bio?: string };
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  status: string;
  publishedAt: string;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  renovation: 'Rénovation',
  decoration: 'Décoration',
  tendances: 'Tendances',
  conseils: 'Conseils',
  architecture: 'Architecture',
};

const mockArticle: ArticleDetail = {
  _id: '1',
  title: 'Les tendances déco 2025 : couleurs, matériaux et styles à adopter',
  slug: 'tendances-deco-2025',
  excerpt: 'Découvrez les grandes tendances décoration de cette année : du terracotta aux matériaux naturels, en passant par le style japandi qui continue de séduire.',
  content: `L'année 2025 s'annonce riche en nouveautés dans le monde de la décoration intérieure. Entre retour aux sources et innovations audacieuses, les tendances de cette année offrent un éventail de possibilités pour transformer votre habitat en un véritable cocon de bien-être.

Les couleurs phares de 2025

Le terracotta reste une valeur sûre, apportant chaleur et caractère à n'importe quelle pièce. On le retrouve désormais décliné dans des nuances plus douces, du rose poudré au sable chaud. Le vert sauge continue également sa percée, offrant une connexion subtile avec la nature. Pour les plus audacieux, le bleu nuit et le bordeaux profond apportent une touche d'élégance sophistiquée aux espaces de vie.

Les matériaux naturels à l'honneur

Le bois brut, la pierre naturelle et le rotin sont plus que jamais présents dans nos intérieurs. La tendance est au mélange des textures : associer un sol en béton ciré avec du mobilier en bois massif, ou marier la douceur du lin avec la robustesse de la céramique artisanale. Les matériaux recyclés et upcyclés gagnent aussi du terrain, reflétant une conscience écologique grandissante.

Le style japandi, toujours en vogue

Fusion du minimalisme japonais et du confort scandinave, le japandi continue de séduire en 2025. Ce style se caractérise par des lignes épurées, des tons neutres et une attention particulière portée à la fonctionnalité. L'idée est de créer des espaces apaisants où chaque objet a sa place et son utilité.

L'éclairage comme élément décoratif

En 2025, l'éclairage n'est plus seulement fonctionnel : il devient un véritable élément de décoration. Les suspensions sculpturales, les lampes en matériaux naturels et les systèmes d'éclairage connectés permettent de créer des ambiances sur mesure. La lumière chaude et tamisée est privilégiée pour les espaces de détente, tandis que les zones de travail bénéficient d'un éclairage plus dynamique.

Vers un intérieur plus durable

La tendance forte de 2025 est sans conteste la durabilité. Les consommateurs privilégient désormais les meubles de qualité, conçus pour durer, plutôt que les pièces jetables. L'artisanat local connaît un regain d'intérêt, et les marques engagées dans une démarche éco-responsable sont de plus en plus plébiscitées.`,
  coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=400&fit=crop',
  category: 'tendances',
  author: { _id: 'a1', firstName: 'Sophie', lastName: 'Martin', bio: 'Journaliste spécialisée en décoration intérieure et design, Sophie partage ses découvertes et coups de cœur depuis plus de 10 ans.' },
  tags: ['tendances', 'décoration', '2025', 'japandi', 'matériaux naturels'],
  readTime: 8,
  views: 3420,
  likes: 156,
  status: 'published',
  publishedAt: '2025-01-20T10:00:00.000Z',
  createdAt: '2025-01-20T10:00:00.000Z',
};

const mockRelatedArticles = [
  {
    _id: '2',
    title: 'Comment rénover sa cuisine sans se ruiner',
    slug: 'renover-cuisine-budget',
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    category: 'renovation',
    readTime: 6,
  },
  {
    _id: '3',
    title: '10 plantes d\'intérieur faciles à entretenir',
    slug: 'plantes-interieur-faciles',
    coverImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    category: 'decoration',
    readTime: 5,
  },
  {
    _id: '4',
    title: 'Guide : choisir son revêtement de sol',
    slug: 'guide-revetement-sol',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
    category: 'conseils',
    readTime: 10,
  },
];

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get<ArticleDetail>(`/articles/${params.slug}`);
        if (response.success && response.data) {
          setArticle(response.data);
        } else {
          setArticle(mockArticle);
        }
      } catch {
        setArticle(mockArticle);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement de l&apos;article...</div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article non trouvé</h2>
            <p className="text-gray-500 mb-4">L&apos;article que vous cherchez n&apos;existe pas.</p>
            <Link href="/articles">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Retour aux articles</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const contentParagraphs = article.content.split('\n\n');

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/articles" className="hover:text-emerald-600">Magazine</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-72 md:h-96">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6 md:p-8">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      {categoryLabels[article.category] || article.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{article.readTime} min de lecture</span>
                    <span className="text-sm text-gray-500">·</span>
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-sm text-gray-500">·</span>
                    <span className="text-sm text-gray-500">{article.views.toLocaleString('fr-FR')} vues</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {article.title}
                  </h1>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-sm">
                        {article.author.firstName.charAt(0)}{article.author.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {article.author.firstName} {article.author.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    {contentParagraphs.map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share */}
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Partager cet article</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.229-.616v.062a4.918 4.918 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.918 4.918 0 004.6 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.634A9.935 9.935 0 0024 4.557z"/></svg>
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
                        Facebook
                      </Button>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        Copier le lien
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Bio */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos de l&apos;auteur</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold">
                        {article.author.firstName.charAt(0)}{article.author.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {article.author.firstName} {article.author.lastName}
                      </p>
                    </div>
                  </div>
                  {article.author.bio && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {article.author.bio}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles similaires</h3>
                  <div className="space-y-4">
                    {mockRelatedArticles.map((related) => (
                      <Link key={related._id} href={`/articles/${related.slug}`} className="block group">
                        <div className="flex gap-3">
                          <img
                            src={related.coverImage}
                            alt={related.title}
                            className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {categoryLabels[related.category] || related.category}
                              </Badge>
                              <span className="text-xs text-gray-500">{related.readTime} min</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
