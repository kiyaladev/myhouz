'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { api } from '../../lib/api';
import { SlidersHorizontal, X } from 'lucide-react';

interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    originalPrice?: number;
  };
  images: string[];
  category: string;
  brand: string;
  rating: {
    average: number;
    totalReviews: number;
  };
  seller: {
    name: string;
    location: string;
  };
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Canapé 3 places en velours bleu',
    description: 'Canapé confortable en velours bleu marine avec pieds en bois massif',
    price: { amount: 899, currency: 'EUR', originalPrice: 1299 },
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'],
    category: 'mobilier',
    brand: 'Maison du Canapé',
    rating: { average: 4.5, totalReviews: 124 },
    seller: { name: 'Mobilier Design', location: 'Paris, France' }
  },
  {
    id: '2',
    name: 'Lampe de table moderne',
    description: 'Lampe de table design en métal doré avec abat-jour en tissu',
    price: { amount: 129, currency: 'EUR' },
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    category: 'eclairage',
    brand: 'Lumière & Co',
    rating: { average: 4.2, totalReviews: 67 },
    seller: { name: 'Éclairage Premium', location: 'Lyon, France' }
  },
  {
    id: '3',
    name: 'Tapis berbère authentique',
    description: 'Tapis tissé main en laine naturelle, motifs berbères traditionnels',
    price: { amount: 299, currency: 'EUR' },
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop'],
    category: 'textile',
    brand: 'Atlas Carpets',
    rating: { average: 4.8, totalReviews: 89 },
    seller: { name: 'Artisanat du Monde', location: 'Marseille, France' }
  }
];

const colorOptions = [
  { value: 'blanc', label: 'Blanc' },
  { value: 'noir', label: 'Noir' },
  { value: 'gris', label: 'Gris' },
  { value: 'beige', label: 'Beige' },
  { value: 'marron', label: 'Marron' },
  { value: 'bleu', label: 'Bleu' },
  { value: 'vert', label: 'Vert' },
  { value: 'rouge', label: 'Rouge' },
];

const materialOptions = [
  { value: 'bois', label: 'Bois' },
  { value: 'metal', label: 'Métal' },
  { value: 'verre', label: 'Verre' },
  { value: 'tissu', label: 'Tissu' },
  { value: 'cuir', label: 'Cuir' },
  { value: 'pierre', label: 'Pierre' },
  { value: 'plastique', label: 'Plastique' },
  { value: 'ceramique', label: 'Céramique' },
];

const styleOptions = [
  { value: 'moderne', label: 'Moderne' },
  { value: 'classique', label: 'Classique' },
  { value: 'scandinave', label: 'Scandinave' },
  { value: 'industriel', label: 'Industriel' },
  { value: 'boheme', label: 'Bohème' },
  { value: 'minimaliste', label: 'Minimaliste' },
  { value: 'rustique', label: 'Rustique' },
];

const sortOptions = [
  { value: '', label: 'Plus récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'popular', label: 'Populaires' },
  { value: 'rating', label: 'Mieux notés' },
];

const categories = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'mobilier', label: 'Mobilier' },
  { value: 'eclairage', label: 'Éclairage' },
  { value: 'textile', label: 'Textile' },
  { value: 'decoration', label: 'Décoration' },
];

const priceRanges = [
  { value: '', label: 'Tous les prix' },
  { value: '0-100', label: 'Moins de 100€' },
  { value: '100-500', label: '100€ - 500€' },
  { value: '500-1000', label: '500€ - 1000€' },
  { value: '1000+', label: 'Plus de 1000€' },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    search: '',
    colors: [] as string[],
    materials: [] as string[],
    styles: [] as string[],
    brand: '',
    sort: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceRange) count++;
    if (filters.brand) count++;
    if (filters.sort) count++;
    count += filters.colors.length;
    count += filters.materials.length;
    count += filters.styles.length;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      search: '',
      colors: [],
      materials: [],
      styles: [],
      brand: '',
      sort: '',
    });
    setPage(1);
  };

  const toggleArrayFilter = (key: 'colors' | 'materials' | 'styles', value: string) => {
    setFilters(prev => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
    setPage(1);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '12' };
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.brand) params.brand = filters.brand;
      if (filters.sort) params.sort = filters.sort;
      if (filters.colors.length) params.color = filters.colors.join(',');
      if (filters.materials.length) params.material = filters.materials.join(',');
      if (filters.styles.length) params.style = filters.styles.join(',');

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) params.minPrice = min;
        if (max) {
          params.maxPrice = max;
        } else if (filters.priceRange.endsWith('+')) {
          params.minPrice = filters.priceRange.replace('+', '');
        }
      }

      const res = await api.get<Product[]>('/products', params);
      if (res.success && res.data) {
        setProducts(res.data.map(p => ({ ...p, id: p.id || p._id || '' })));
        if (res.pagination) {
          setTotalPages(res.pagination.pages);
        }
      }
    } catch {
      setProducts(mockProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getPageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'ellipsis')[] = [1];
    if (current > 3) pages.push('ellipsis');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('ellipsis');
    pages.push(total);
    return pages;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const renderCheckboxGroup = (
    title: string,
    options: { value: string; label: string }[],
    selected: string[],
    filterKey: 'colors' | 'materials' | 'styles'
  ) => (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="space-y-1">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggleArrayFilter(filterKey, opt.value)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );

  const filterSidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-gray-900">Filtres</span>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
            <X className="h-3 w-3" /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Catégorie</h4>
        <select
          value={filters.category}
          onChange={(e) => { setFilters(prev => ({ ...prev, category: e.target.value })); setPage(1); }}
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Prix</h4>
        <select
          value={filters.priceRange}
          onChange={(e) => { setFilters(prev => ({ ...prev, priceRange: e.target.value })); setPage(1); }}
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {priceRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Marque</h4>
        <input
          type="text"
          placeholder="Rechercher une marque..."
          value={filters.brand}
          onChange={(e) => { setFilters(prev => ({ ...prev, brand: e.target.value })); setPage(1); }}
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Color */}
      {renderCheckboxGroup('Couleur', colorOptions, filters.colors, 'colors')}

      {/* Material */}
      {renderCheckboxGroup('Matériau', materialOptions, filters.materials, 'materials')}

      {/* Style */}
      {renderCheckboxGroup('Style', styleOptions, filters.styles, 'styles')}

      {/* Sort */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Trier par</h4>
        <select
          value={filters.sort}
          onChange={(e) => { setFilters(prev => ({ ...prev, sort: e.target.value })); setPage(1); }}
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Marketplace
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez une sélection de produits de qualité pour votre intérieur, directement chez nos partenaires
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search bar + filter toggle */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recherche
                </label>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showFilters ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                  {activeFilterCount > 0 && (
                    <span className={`ml-1 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold ${
                      showFilters ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'
                    }`}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar – desktop: always visible when open; mobile: collapsible panel */}
            {showFilters && (
              <aside className="w-full lg:w-64 lg:flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4">
                  {filterSidebar}
                </div>
              </aside>
            )}

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Grille de produits */}
              {loading ? (
                <div className="text-center py-12 text-gray-500">Chargement...</div>
              ) : (
              <div className={`grid gap-6 ${showFilters ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.price.originalPrice && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                          -
                          {Math.round(((product.price.originalPrice - product.price.amount) / product.price.originalPrice) * 100)}
                          %
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-2">
                        <span className="text-sm text-emerald-600 font-medium">{product.brand}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {renderStars(product.rating.average)}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {product.rating.average} ({product.rating.totalReviews} avis)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {product.price.amount}€
                          </span>
                          {product.price.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.price.originalPrice}€
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          Vendu par <span className="font-medium">{product.seller.name}</span>
                        </p>
                        <p className="text-xs text-gray-500">{product.seller.location}</p>
                      </div>

                      <Button className="w-full">
                        Ajouter au panier
                      </Button>
                    </div>
                  </Card>
                  </Link>
                ))}
              </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Précédent</Button>
                  {getPageNumbers(page, totalPages).map((p, i) =>
                    p === 'ellipsis' ? (
                      <span key={`ellipsis-${i}`} className="px-3 py-2 text-gray-500">…</span>
                    ) : (
                      <Button key={p} variant={p === page ? 'default' : 'outline'} onClick={() => setPage(p)}>
                        {p}
                      </Button>
                    )
                  )}
                  <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Suivant</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}