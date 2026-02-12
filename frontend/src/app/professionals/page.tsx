'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Layout from '../../components/layout/Layout';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import type { MapMarker } from '../../components/ui/map';

const Map = dynamic(() => import('../../components/ui/map'), { ssr: false });

interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  professionalInfo?: {
    companyName?: string;
    services?: string[];
    rating?: { average: number; count: number };
    verified?: boolean;
    description?: string;
  };
}

// Mock data for when API is unavailable
const mockProfessionals: Professional[] = [
  {
    _id: 'pro1',
    firstName: 'Sophie',
    lastName: 'Dubois',
    location: { city: 'Paris', country: 'France' },
    professionalInfo: {
      companyName: 'Dubois Design Intérieur',
      services: ['Architecture intérieure', 'Décoration', 'Rénovation'],
      rating: { average: 4.8, count: 42 },
      verified: true,
      description: 'Architecte d\'intérieur passionnée par les espaces contemporains.',
    },
  },
  {
    _id: 'pro2',
    firstName: 'Pierre',
    lastName: 'Martin',
    location: { city: 'Lyon', country: 'France' },
    professionalInfo: {
      companyName: 'Martin & Fils Construction',
      services: ['Construction', 'Rénovation', 'Extension'],
      rating: { average: 4.5, count: 28 },
      verified: true,
      description: 'Entreprise familiale de construction depuis 3 générations.',
    },
  },
  {
    _id: 'pro3',
    firstName: 'Marie',
    lastName: 'Larsson',
    location: { city: 'Marseille', country: 'France' },
    professionalInfo: {
      companyName: 'Larsson Paysage',
      services: ['Paysagisme', 'Aménagement extérieur', 'Terrasses'],
      rating: { average: 4.9, count: 56 },
      verified: false,
      description: 'Spécialiste en aménagement paysager méditerranéen.',
    },
  },
  {
    _id: 'pro4',
    firstName: 'Thomas',
    lastName: 'Bernard',
    location: { city: 'Bordeaux', country: 'France' },
    professionalInfo: {
      companyName: 'Bernard Cuisines',
      services: ['Cuisine', 'Salle de bain', 'Menuiserie'],
      rating: { average: 4.6, count: 35 },
      verified: true,
      description: 'Cuisiniste et menuisier sur-mesure pour des espaces uniques.',
    },
  },
];

// Approximate coordinates for major French cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Lyon': { lat: 45.7640, lng: 4.8357 },
  'Marseille': { lat: 43.2965, lng: 5.3698 },
  'Bordeaux': { lat: 44.8378, lng: -0.5792 },
  'Toulouse': { lat: 43.6047, lng: 1.4442 },
  'Nice': { lat: 43.7102, lng: 7.2620 },
  'Nantes': { lat: 47.2184, lng: -1.5536 },
  'Strasbourg': { lat: 48.5734, lng: 7.7521 },
  'Lille': { lat: 50.6292, lng: 3.0573 },
  'Montpellier': { lat: 43.6108, lng: 3.8767 },
};

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    city: '',
    service: '',
  });

  useEffect(() => {
    fetchProfessionals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfessionals = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.city) params.city = filters.city;
      if (filters.service) params.services = filters.service;

      const response = await api.get<Professional[]>('/users/professionals/search', params);
      if (response.success && response.data) {
        setProfessionals(response.data);
      }
    } catch {
      // Fallback to mock data
      setProfessionals(mockProfessionals);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfessionals();
  };

  const mapMarkers: MapMarker[] = useMemo(() => {
    return professionals
      .filter((pro) => {
        const city = pro.location?.city;
        return city && cityCoordinates[city];
      })
      .map((pro) => {
        const coords = cityCoordinates[pro.location!.city!];
        return {
          id: pro._id,
          lat: coords.lat,
          lng: coords.lng,
          name: pro.professionalInfo?.companyName || `${pro.firstName} ${pro.lastName}`,
          description: pro.location?.city || '',
        };
      });
  }, [professionals]);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Trouvez un professionnel
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des milliers de professionnels qualifiés pour donner vie à vos projets de rénovation et décoration
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Paris, Lyon, Marseille..."
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Spécialité</Label>
                <Input
                  id="service"
                  type="text"
                  placeholder="Architecture, Cuisine, Paysagisme..."
                  value={filters.service}
                  onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  Rechercher
                </Button>
              </div>
            </form>
          </div>

          {/* View Toggle */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                onClick={() => setViewMode('map')}
              >
                Carte
              </Button>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement des professionnels...</div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun professionnel trouvé</p>
              <p className="text-gray-400 mt-1">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '600px' }}>
              <Map markers={mapMarkers} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionals.map((pro) => (
                <Card key={pro._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-emerald-700">
                          {pro.firstName.charAt(0)}{pro.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pro.firstName} {pro.lastName}
                          </h3>
                          {pro.professionalInfo?.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">✓ Vérifié</Badge>
                          )}
                        </div>
                        {pro.professionalInfo?.companyName && (
                          <p className="text-gray-600 text-sm">{pro.professionalInfo.companyName}</p>
                        )}
                        {pro.location?.city && (
                          <p className="text-gray-500 text-sm">
                            📍 {pro.location.city}{pro.location.country ? `, ${pro.location.country}` : ''}
                          </p>
                        )}

                        {pro.professionalInfo?.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold text-sm">
                              {pro.professionalInfo.rating.average.toFixed(1)}
                            </span>
                            <span className="text-gray-400 text-sm">
                              ({pro.professionalInfo.rating.count} avis)
                            </span>
                          </div>
                        )}

                        {pro.professionalInfo?.description && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {pro.professionalInfo.description}
                          </p>
                        )}

                        {pro.professionalInfo?.services && pro.professionalInfo.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {pro.professionalInfo.services.slice(0, 3).map((service) => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Link href={`/professionals/${pro._id}`}>
                            <Button size="sm">Voir le profil</Button>
                          </Link>
                          <Button size="sm" variant="outline">Contacter</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
