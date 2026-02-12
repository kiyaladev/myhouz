'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Search,
  Truck,
  Plus,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit,
  Trash2,
  X,
  Package,
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  company?: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  siret?: string;
  categories: string[];
  notes?: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1', name: 'Jean Dupont', company: 'Quincaillerie Dupont SARL',
    contact: { email: 'contact@dupont-quinc.fr', phone: '01 23 45 67 89', address: '12 Rue du Commerce, 75001 Paris' },
    siret: '123 456 789 00012', categories: ['Visserie', 'Quincaillerie'], notes: 'Fournisseur principal visserie'
  },
  {
    id: '2', name: 'Marie Lefèvre', company: 'Serrurerie Moderne',
    contact: { email: 'ml@serrurerie-moderne.fr', phone: '01 98 76 54 32', address: '45 Avenue de la Sécurité, 69001 Lyon' },
    siret: '987 654 321 00034', categories: ['Serrurerie'], notes: ''
  },
  {
    id: '3', name: 'Pierre Martin', company: 'Martin Colles & Adhésifs',
    contact: { email: 'p.martin@mca.fr', phone: '04 56 78 90 12' },
    categories: ['Colles & Mastics'], notes: 'Livraison sous 48h'
  },
  {
    id: '4', name: 'Sophie Bernard', company: 'Outillage Pro Bernard',
    contact: { email: 'sophie@opb.fr', phone: '05 67 89 01 23', address: '8 Zone Industrielle Nord, 33000 Bordeaux' },
    siret: '456 789 012 00056', categories: ['Outils', 'Quincaillerie']
  },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const categories = ['all', 'Visserie', 'Quincaillerie', 'Serrurerie', 'Colles & Mastics', 'Outils'];

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(s => {
      const matchSearch = !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || s.categories.includes(selectedCategory);
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pro/pos"><ArrowLeft className="h-4 w-4 mr-1" /> Caisse</Link>
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-600" />
              Gestion des Fournisseurs
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/stock">Stocks</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/invoices">Factures</Link>
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Nouveau fournisseur
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Truck className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-gray-500">Total fournisseurs</p><p className="text-xl font-bold">{mockSuppliers.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><Package className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-sm text-gray-500">Catégories couvertes</p><p className="text-xl font-bold">{new Set(mockSuppliers.flatMap(s => s.categories)).size}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Building2 className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-gray-500">Avec SIRET</p><p className="text-xl font-bold">{mockSuppliers.filter(s => s.siret).length}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Tous' : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Liste des fournisseurs */}
        {filteredSuppliers.length === 0 ? (
          <EmptyState
            title="Aucun fournisseur trouvé"
            description="Ajoutez votre premier fournisseur pour commencer la gestion."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuppliers.map(supplier => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      {supplier.company && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {supplier.company}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    {supplier.contact.email && (
                      <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> {supplier.contact.email}</p>
                    )}
                    {supplier.contact.phone && (
                      <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {supplier.contact.phone}</p>
                    )}
                    {supplier.contact.address && (
                      <p className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {supplier.contact.address}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {supplier.categories.map(cat => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                  {supplier.notes && (
                    <p className="text-xs text-gray-400 mt-2 italic">{supplier.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal détail fournisseur */}
        {selectedSupplier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {selectedSupplier.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedSupplier(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSupplier.company && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Entreprise</p>
                    <p>{selectedSupplier.company}</p>
                  </div>
                )}
                {selectedSupplier.siret && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">SIRET</p>
                    <p>{selectedSupplier.siret}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  {selectedSupplier.contact.email && <p className="flex items-center gap-2 text-sm"><Mail className="h-3 w-3" /> {selectedSupplier.contact.email}</p>}
                  {selectedSupplier.contact.phone && <p className="flex items-center gap-2 text-sm"><Phone className="h-3 w-3" /> {selectedSupplier.contact.phone}</p>}
                  {selectedSupplier.contact.address && <p className="flex items-center gap-2 text-sm"><MapPin className="h-3 w-3" /> {selectedSupplier.contact.address}</p>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Catégories</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSupplier.categories.map(cat => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </div>
                {selectedSupplier.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm">{selectedSupplier.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal ajout fournisseur */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nouveau fournisseur</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nom du fournisseur *" />
                <Input placeholder="Entreprise" />
                <Input placeholder="SIRET" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Téléphone" type="tel" />
                <Input placeholder="Adresse" />
                <textarea className="w-full border rounded-lg p-2 text-sm" rows={2} placeholder="Notes..."></textarea>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
                  <Button onClick={() => setShowAddModal(false)}>Créer</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
