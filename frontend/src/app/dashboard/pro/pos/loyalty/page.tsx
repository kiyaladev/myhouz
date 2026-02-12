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
  Star,
  Plus,
  Mail,
  Phone,
  Users,
  Trophy,
  X,
  Minus,
} from 'lucide-react';

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

interface LoyaltyCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  points: number;
  tier: Tier;
  history: { date: string; label: string; points: number }[];
}

const tierConfig: Record<Tier, { label: string; bg: string; text: string }> = {
  bronze: { label: 'Bronze', bg: 'bg-amber-100', text: 'text-amber-800' },
  silver: { label: 'Silver', bg: 'bg-gray-200', text: 'text-gray-800' },
  gold: { label: 'Gold', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  platinum: { label: 'Platinum', bg: 'bg-purple-100', text: 'text-purple-800' },
};

const mockCustomers: LoyaltyCustomer[] = [
  {
    id: '1', name: 'Alice Martin', email: 'alice@example.fr', phone: '06 12 34 56 78',
    points: 4200, tier: 'platinum',
    history: [
      { date: '2026-02-10', label: 'Achat outillage', points: 200 },
      { date: '2026-02-05', label: 'Bon de réduction utilisé', points: -500 },
    ],
  },
  {
    id: '2', name: 'Bruno Lefèvre', email: 'bruno.l@mail.fr', phone: '07 65 43 21 00',
    points: 2100, tier: 'gold',
    history: [
      { date: '2026-02-11', label: 'Achat peinture', points: 150 },
    ],
  },
  {
    id: '3', name: 'Claire Dupont', phone: '06 99 88 77 66',
    points: 850, tier: 'silver',
    history: [
      { date: '2026-02-08', label: 'Achat visserie', points: 80 },
      { date: '2026-01-20', label: 'Achat colle', points: 50 },
    ],
  },
  {
    id: '4', name: 'David Bernard', email: 'david.b@pro.fr',
    points: 300, tier: 'bronze',
    history: [
      { date: '2026-02-12', label: 'Inscription fidélité', points: 100 },
    ],
  },
  {
    id: '5', name: 'Emma Petit', email: 'emma.p@mail.fr', phone: '06 11 22 33 44',
    points: 3500, tier: 'gold',
    history: [
      { date: '2026-02-09', label: 'Achat électricité', points: 300 },
      { date: '2026-02-01', label: 'Parrainage client', points: 500 },
    ],
  },
];

export default function LoyaltyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<'all' | Tier>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null);
  const [pointsModal, setPointsModal] = useState<{ customer: LoyaltyCustomer; mode: 'earn' | 'spend' } | null>(null);

  const tiers: ('all' | Tier)[] = ['all', 'bronze', 'silver', 'gold', 'platinum'];

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(c => {
      const matchSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = selectedTier === 'all' || c.tier === selectedTier;
      return matchSearch && matchTier;
    });
  }, [searchQuery, selectedTier]);

  const totalPoints = mockCustomers.reduce((s, c) => s + c.points, 0);

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
              <Star className="h-6 w-6 text-yellow-500" />
              Programme de Fidélité
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos">Caisse</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/history">Historique</Link>
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Nouveau client
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-gray-500">Total clients fidélité</p><p className="text-xl font-bold">{mockCustomers.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg"><Star className="h-5 w-5 text-yellow-600" /></div>
              <div><p className="text-sm text-gray-500">Total points distribués</p><p className="text-xl font-bold">{totalPoints.toLocaleString('fr-FR')}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Trophy className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-gray-500">Clients Platinum</p><p className="text-xl font-bold">{mockCustomers.filter(c => c.tier === 'platinum').length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg"><Trophy className="h-5 w-5 text-yellow-500" /></div>
              <div><p className="text-sm text-gray-500">Clients Gold</p><p className="text-xl font-bold">{mockCustomers.filter(c => c.tier === 'gold').length}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tiers.map(t => (
              <Button
                key={t}
                variant={selectedTier === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier(t)}
              >
                {t === 'all' ? 'Tous' : tierConfig[t].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Customer list */}
        {filteredCustomers.length === 0 ? (
          <EmptyState
            title="Aucun client trouvé"
            description="Ajoutez votre premier client fidélité pour commencer."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map(customer => {
              const tier = tierConfig[customer.tier];
              return (
                <Card key={customer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        <Badge className={`${tier.bg} ${tier.text} border-0`}>{tier.label}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-600">{customer.points.toLocaleString('fr-FR')}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      {customer.email && (
                        <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> {customer.email}</p>
                      )}
                      {customer.phone && (
                        <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {customer.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setPointsModal({ customer, mode: 'earn' })}>
                        <Plus className="h-3 w-3 mr-1" /> Points
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setPointsModal({ customer, mode: 'spend' })}>
                        <Minus className="h-3 w-3 mr-1" /> Utiliser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detail modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  {selectedCustomer.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={`${tierConfig[selectedCustomer.tier].bg} ${tierConfig[selectedCustomer.tier].text} border-0`}>
                    {tierConfig[selectedCustomer.tier].label}
                  </Badge>
                  <p className="text-2xl font-bold text-yellow-600">{selectedCustomer.points.toLocaleString('fr-FR')} pts</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  {selectedCustomer.email && <p className="flex items-center gap-2 text-sm"><Mail className="h-3 w-3" /> {selectedCustomer.email}</p>}
                  {selectedCustomer.phone && <p className="flex items-center gap-2 text-sm"><Phone className="h-3 w-3" /> {selectedCustomer.phone}</p>}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Historique des points</p>
                  <div className="space-y-2">
                    {selectedCustomer.history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium">{h.label}</p>
                          <p className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`font-semibold ${h.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {h.points >= 0 ? '+' : ''}{h.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add customer modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nouveau client fidélité</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nom du client *" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Téléphone" type="tel" />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
                  <Button onClick={() => setShowAddModal(false)}>Créer</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Spend points modal */}
        {pointsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {pointsModal.mode === 'earn' ? 'Ajouter des points' : 'Utiliser des points'} — {pointsModal.customer.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setPointsModal(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Solde actuel : <span className="font-semibold">{pointsModal.customer.points.toLocaleString('fr-FR')} points</span>
                </p>
                <Input placeholder="Nombre de points" type="number" min={1} />
                <Input placeholder="Description (ex: Achat outillage)" />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setPointsModal(null)}>Annuler</Button>
                  <Button onClick={() => setPointsModal(null)}>
                    {pointsModal.mode === 'earn' ? 'Ajouter' : 'Déduire'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
