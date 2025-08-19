'use client';

import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface Product {
  id: string;
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

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    search: ''
  });

  // Mock data
  const products: Product[] = [
    {
      id: '1',
      name: 'Canapé 3 places en velours bleu',
      description: 'Canapé confortable en velours bleu marine avec pieds en bois massif',
      price: {
        amount: 899,
        currency: 'EUR',
        originalPrice: 1299
      },
      images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'],
      category: 'mobilier',
      brand: 'Maison du Canapé',
      rating: {
        average: 4.5,
        totalReviews: 124
      },
      seller: {
        name: 'Mobilier Design',
        location: 'Paris, France'
      }
    },
    {
      id: '2',
      name: 'Lampe de table moderne',
      description: 'Lampe de table design en métal doré avec abat-jour en tissu',
      price: {
        amount: 129,
        currency: 'EUR'
      },
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
      category: 'eclairage',
      brand: 'Lumière & Co',
      rating: {
        average: 4.2,
        totalReviews: 67
      },
      seller: {
        name: 'Éclairage Premium',
        location: 'Lyon, France'
      }
    },
    {
      id: '3',
      name: 'Tapis berbère authentique',
      description: 'Tapis tissé main en laine naturelle, motifs berbères traditionnels',
      price: {
        amount: 299,
        currency: 'EUR'
      },
      images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop'],
      category: 'textile',
      brand: 'Atlas Carpets',
      rating: {
        average: 4.8,
        totalReviews: 89
      },
      seller: {
        name: 'Artisanat du Monde',
        location: 'Marseille, France'
      }
    }
  ];

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'mobilier', label: 'Mobilier' },
    { value: 'eclairage', label: 'Éclairage' },
    { value: 'textile', label: 'Textile' },
    { value: 'decoration', label: 'Décoration' }
  ];

  const priceRanges = [
    { value: '', label: 'Tous les prix' },
    { value: '0-100', label: 'Moins de 100€' },
    { value: '100-500', label: '100€ - 500€' },
    { value: '500-1000', label: '500€ - 1000€' },
    { value: '1000+', label: 'Plus de 1000€' }
  ];

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
          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grille de produits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
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
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <Button variant="outline">Précédent</Button>
              <Button>1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Suivant</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}