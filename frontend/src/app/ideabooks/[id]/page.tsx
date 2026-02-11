'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface IdeabookItem {
  _id: string;
  itemType: 'project' | 'product' | 'article';
  itemId: {
    _id: string;
    title?: string;
    name?: string;
    images: Array<{ url: string } | string>;
  };
  note: string;
}

interface IdeabookDetail {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  items: IdeabookItem[];
  isPublic: boolean;
  creator: { _id: string; firstName: string; lastName: string };
  tags: string[];
  createdAt: string;
}

const mockIdeabook: IdeabookDetail = {
  _id: '1',
  title: 'Cuisine de rêve',
  description: 'Inspiration pour ma future cuisine moderne avec îlot central, matériaux naturels et finitions haut de gamme.',
  coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  items: [
    { _id: 'item1', itemType: 'project', itemId: { _id: 'p1', title: 'Cuisine minimaliste blanche', images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' }] }, note: 'J\'adore le plan de travail' },
    { _id: 'item2', itemType: 'product', itemId: { _id: 'pr1', name: 'Robinet design cuivre', images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop'] }, note: 'Pour l\'évier' },
    { _id: 'item3', itemType: 'project', itemId: { _id: 'p2', title: 'Cuisine ouverte avec verrière', images: [{ url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop' }] }, note: '' },
    { _id: 'item4', itemType: 'product', itemId: { _id: 'pr2', name: 'Tabourets îlot en bois', images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop'] }, note: 'Style scandinave' },
  ],
  isPublic: true,
  creator: { _id: 'u1', firstName: 'Marie', lastName: 'Dupont' },
  tags: ['cuisine', 'moderne', 'îlot central'],
  createdAt: '2025-01-15T10:00:00.000Z',
};

function getItemImage(item: IdeabookItem): string {
  const img = item.itemId.images[0];
  if (typeof img === 'string') return img;
  return img?.url || '';
}

function getItemTitle(item: IdeabookItem): string {
  return item.itemId.title || item.itemId.name || '';
}

function getItemTypeLabel(itemType: string): string {
  switch (itemType) {
    case 'project': return 'Projet';
    case 'product': return 'Produit';
    case 'article': return 'Article';
    default: return itemType;
  }
}

function getItemTypeBadgeClass(itemType: string): string {
  switch (itemType) {
    case 'project': return 'bg-emerald-100 text-emerald-800';
    case 'product': return 'bg-blue-100 text-blue-800';
    case 'article': return 'bg-purple-100 text-purple-800';
    default: return '';
  }
}

export default function IdeabookDetailPage() {
  const params = useParams();
  const [ideabook, setIdeabook] = useState<IdeabookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIdeabook = async () => {
      try {
        const response = await api.get<IdeabookDetail>(`/ideabooks/${params.id}`);
        if (response.success && response.data) {
          setIdeabook(response.data);
        }
      } catch {
        setIdeabook(mockIdeabook);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeabook();
  }, [params.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement du carnet d&apos;idées...</div>
        </div>
      </Layout>
    );
  }

  if (!ideabook) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carnet non trouvé</h2>
            <p className="text-gray-500 mb-4">Le carnet d&apos;idées que vous cherchez n&apos;existe pas.</p>
            <Link href="/ideabooks">
              <Button>Retour aux carnets</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/ideabooks" className="hover:text-emerald-600">Carnets d&apos;Idées</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{ideabook.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="relative">
              <img
                src={ideabook.coverImage}
                alt={ideabook.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{ideabook.title}</h1>
                  <p className="text-gray-700 leading-relaxed mb-4">{ideabook.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ideabook.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {ideabook.creator.firstName.charAt(0)}
                        </span>
                      </div>
                      <span>{ideabook.creator.firstName} {ideabook.creator.lastName}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {new Date(ideabook.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">
                      {ideabook.items.length} élément{ideabook.items.length > 1 ? 's' : ''}
                    </Badge>
                    <Badge variant={ideabook.isPublic ? 'secondary' : 'outline'}>
                      {ideabook.isPublic ? '🌐 Public' : '🔒 Privé'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Partager
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Éléments sauvegardés ({ideabook.items.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideabook.items.map((item) => (
              <Card key={item._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={getItemImage(item)}
                    alt={getItemTitle(item)}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getItemTypeBadgeClass(item.itemType)}`}>
                      {getItemTypeLabel(item.itemType)}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {getItemTitle(item)}
                  </h3>
                  {item.note && (
                    <p className="text-sm text-gray-500 italic">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
