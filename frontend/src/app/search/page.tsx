'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, FolderOpen, ShoppingBag, Users, FileText, Star, MapPin, SlidersHorizontal, X } from 'lucide-react';

// --- Mock Data ---

const mockProjects = [
  {
    id: 'proj-1',
    title: 'Cuisine moderne avec îlot central',
    category: 'Rénovation',
    description: 'Rénovation complète d\'une cuisine avec des matériaux contemporains et un design épuré pour un espace fonctionnel.',
  },
  {
    id: 'proj-2',
    title: 'Salon scandinave lumineux',
    category: 'Décoration',
    description: 'Aménagement d\'un salon dans un style scandinave avec des tons neutres, du bois naturel et beaucoup de lumière.',
  },
  {
    id: 'proj-3',
    title: 'Terrasse méditerranéenne',
    category: 'Aménagement extérieur',
    description: 'Création d\'une terrasse avec pergola, plantes méditerranéennes et coin repas en pierre naturelle.',
  },
];

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Canapé modulable Milano',
    brand: 'Maison du Monde',
    price: 1299,
  },
  {
    id: 'prod-2',
    name: 'Suspension luminaire Éclat',
    brand: 'Luminaire Design',
    price: 189,
  },
  {
    id: 'prod-3',
    name: 'Table basse en chêne massif',
    brand: 'Atelier Bois',
    price: 549,
  },
];

const mockProfessionals = [
  {
    id: 'pro-1',
    name: 'Sophie Dubois',
    company: 'Dubois Design Intérieur',
    specialties: ['Architecture intérieure', 'Décoration'],
    rating: 4.8,
    city: 'Paris',
  },
  {
    id: 'pro-2',
    name: 'Pierre Martin',
    company: 'Martin & Fils Construction',
    specialties: ['Construction', 'Rénovation'],
    rating: 4.5,
    city: 'Lyon',
  },
  {
    id: 'pro-3',
    name: 'Marie Larsson',
    company: 'Larsson Paysage',
    specialties: ['Paysagisme', 'Aménagement extérieur'],
    rating: 4.9,
    city: 'Marseille',
  },
];

const mockArticles = [
  {
    id: 'art-1',
    title: 'Les tendances déco 2024 à adopter',
    category: 'Tendances',
    excerpt: 'Découvrez les couleurs, matériaux et styles qui marqueront cette année dans le monde de la décoration intérieure.',
  },
  {
    id: 'art-2',
    title: 'Comment choisir son artisan pour une rénovation',
    category: 'Conseils',
    excerpt: 'Guide complet pour bien sélectionner les professionnels qui interviendront dans votre projet de rénovation.',
  },
];

const projectCategories = ['Rénovation', 'Décoration', 'Aménagement extérieur', 'Construction'];
const articleCategories = ['Tendances', 'Conseils', 'Guides', 'Interviews'];

// --- Search Results Component ---

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPriceMin, setFilterPriceMin] = useState<string>('');
  const [filterPriceMax, setFilterPriceMax] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');

  const hasActiveFilters = filterCategory || filterPriceMin || filterPriceMax || filterCity;

  const clearFilters = () => {
    setFilterCategory(null);
    setFilterPriceMin('');
    setFilterPriceMax('');
    setFilterCity('');
  };

  const filteredProjects = useMemo(() => {
    if (!filterCategory) return mockProjects;
    return mockProjects.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];
    if (filterPriceMin) products = products.filter((p) => p.price >= Number(filterPriceMin));
    if (filterPriceMax) products = products.filter((p) => p.price <= Number(filterPriceMax));
    return products;
  }, [filterPriceMin, filterPriceMax]);

  const filteredProfessionals = useMemo(() => {
    if (!filterCity) return mockProfessionals;
    return mockProfessionals.filter((p) =>
      p.city.toLowerCase().includes(filterCity.toLowerCase())
    );
  }, [filterCity]);

  const filteredArticles = useMemo(() => {
    if (!filterCategory) return mockArticles;
    return mockArticles.filter((a) => a.category === filterCategory);
  }, [filterCategory]);

  const totalResults = filteredProjects.length + filteredProducts.length + filteredProfessionals.length + filteredArticles.length;

  if (!query) {
    return (
      <EmptyState
        icon={<Search className="w-12 h-12" />}
        title="Lancez une recherche"
        description="Entrez un terme de recherche pour trouver des projets, produits, professionnels et articles."
      />
    );
  }

  // Show relevant filter categories based on active tab
  const showCategoryFilter = activeTab === 'all' || activeTab === 'projects' || activeTab === 'articles';
  const showPriceFilter = activeTab === 'all' || activeTab === 'products';
  const showCityFilter = activeTab === 'all' || activeTab === 'professionals';

  const categoryOptions = activeTab === 'articles' ? articleCategories : projectCategories;

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Résultats pour « {query} »
            </h1>
            <p className="text-gray-500 mt-1">{totalResults} résultats trouvés</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="ml-1 bg-white text-emerald-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Affiner les résultats</span>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Réinitialiser
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category filter */}
              {showCategoryFilter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={filterCategory || ''}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Toutes les catégories</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price filter */}
              {showPriceFilter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filterPriceMin}
                      onChange={(e) => setFilterPriceMin(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filterPriceMax}
                      onChange={(e) => setFilterPriceMax(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* City filter */}
              {showCityFilter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    placeholder="Rechercher une ville..."
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tous ({totalResults})</TabsTrigger>
          <TabsTrigger value="projects">Projets ({filteredProjects.length})</TabsTrigger>
          <TabsTrigger value="products">Produits ({filteredProducts.length})</TabsTrigger>
          <TabsTrigger value="professionals">Professionnels ({filteredProfessionals.length})</TabsTrigger>
          <TabsTrigger value="articles">Articles ({filteredArticles.length})</TabsTrigger>
        </TabsList>

        {/* All Results */}
        <TabsContent value="all">
          <SectionHeading icon={<FolderOpen className="w-5 h-5" />} title="Projets" />
          <ProjectsGrid projects={filteredProjects} />
          <SectionHeading icon={<ShoppingBag className="w-5 h-5" />} title="Produits" className="mt-10" />
          <ProductsGrid products={filteredProducts} />
          <SectionHeading icon={<Users className="w-5 h-5" />} title="Professionnels" className="mt-10" />
          <ProfessionalsGrid professionals={filteredProfessionals} />
          <SectionHeading icon={<FileText className="w-5 h-5" />} title="Articles" className="mt-10" />
          <ArticlesGrid articles={filteredArticles} />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsGrid projects={filteredProjects} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsGrid products={filteredProducts} />
        </TabsContent>

        <TabsContent value="professionals">
          <ProfessionalsGrid professionals={filteredProfessionals} />
        </TabsContent>

        <TabsContent value="articles">
          <ArticlesGrid articles={filteredArticles} />
        </TabsContent>
      </Tabs>
    </>
  );
}

// --- Sub-components ---

function SectionHeading({ icon, title, className }: { icon: React.ReactNode; title: string; className?: string }) {
  return (
    <h2 className={`flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4 ${className || ''}`}>
      {icon}
      {title}
    </h2>
  );
}

function ProjectsGrid({ projects }: { projects: typeof mockProjects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="h-40 bg-gray-200 flex items-center justify-center rounded-t-lg">
              <FolderOpen className="w-10 h-10 text-gray-400" />
            </div>
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">{project.category}</Badge>
              <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ProductsGrid({ products }: { products: typeof mockProducts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="h-40 bg-gray-200 flex items-center justify-center rounded-t-lg">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-emerald-600 font-bold">{product.price.toLocaleString('fr-FR')} €</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ProfessionalsGrid({ professionals }: { professionals: typeof mockProfessionals }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals.map((pro) => (
        <Link key={pro.id} href={`/professionals/${pro.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-700 font-bold">
                    {pro.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                  <p className="text-sm text-gray-600">{pro.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {pro.rating}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {pro.city}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {pro.specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function ArticlesGrid({ articles }: { articles: typeof mockArticles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link key={article.id} href={`/articles/${article.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="h-40 bg-gray-200 flex items-center justify-center rounded-t-lg">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">{article.category}</Badge>
              <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// --- Page with Suspense ---

export default function SearchPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="text-center py-12 text-gray-500">Chargement...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
