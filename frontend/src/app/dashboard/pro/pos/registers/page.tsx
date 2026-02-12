'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Monitor,
  Plus,
  Power,
  PowerOff,
  Euro,
  ShoppingCart,
  Clock,
  Trash2,
  X,
} from 'lucide-react';

interface Register {
  id: string;
  name: string;
  status: 'open' | 'closed';
  openedAt?: string;
  closedAt?: string;
  openingBalance: number;
  closingBalance?: number;
  salesCount: number;
  totalSales: number;
}

const mockRegisters: Register[] = [
  {
    id: '1', name: 'Caisse Principale', status: 'open',
    openedAt: '2026-02-12T08:00:00', openingBalance: 200,
    salesCount: 18, totalSales: 1580.40
  },
  {
    id: '2', name: 'Caisse Extérieur', status: 'open',
    openedAt: '2026-02-12T09:00:00', openingBalance: 100,
    salesCount: 7, totalSales: 420.80
  },
  {
    id: '3', name: 'Caisse Réserve', status: 'closed',
    closedAt: '2026-02-11T18:00:00', openingBalance: 150,
    closingBalance: 890.50, salesCount: 12, totalSales: 740.50
  },
];

export default function RegistersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);

  const openRegisters = mockRegisters.filter(r => r.status === 'open');
  const totalSalesAll = mockRegisters.filter(r => r.status === 'open').reduce((sum, r) => sum + r.totalSales, 0);

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
              <Monitor className="h-6 w-6 text-blue-600" />
              Gestion Multi-Caisse
            </h1>
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nouvelle caisse
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><Power className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-sm text-gray-500">Caisses ouvertes</p><p className="text-xl font-bold">{openRegisters.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><ShoppingCart className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-gray-500">Ventes du jour</p><p className="text-xl font-bold">{openRegisters.reduce((s, r) => s + r.salesCount, 0)}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Euro className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-gray-500">CA total ouvert</p><p className="text-xl font-bold">{totalSalesAll.toFixed(2)} €</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des caisses */}
        {mockRegisters.length === 0 ? (
          <EmptyState
            title="Aucune caisse configurée"
            description="Créez votre première caisse pour commencer."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRegisters.map(register => (
              <Card key={register.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    {register.name}
                  </CardTitle>
                  <Badge variant={register.status === 'open' ? 'default' : 'secondary'} className={register.status === 'open' ? 'bg-green-500' : ''}>
                    {register.status === 'open' ? 'Ouverte' : 'Fermée'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Fond de caisse</p>
                      <p className="font-semibold">{register.openingBalance.toFixed(2)} €</p>
                    </div>
                    {register.status === 'open' ? (
                      <div>
                        <p className="text-gray-500">CA en cours</p>
                        <p className="font-semibold text-green-600">{register.totalSales.toFixed(2)} €</p>
                      </div>
                    ) : register.closingBalance !== undefined ? (
                      <div>
                        <p className="text-gray-500">Solde clôture</p>
                        <p className="font-semibold">{register.closingBalance.toFixed(2)} €</p>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-gray-500">Transactions</p>
                      <p className="font-semibold">{register.salesCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{register.status === 'open' ? 'Ouverte à' : 'Fermée à'}</p>
                      <p className="font-semibold text-xs">
                        {register.status === 'open' && register.openedAt
                          ? new Date(register.openedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                          : register.closedAt
                            ? new Date(register.closedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                            : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {register.status === 'open' ? (
                      <Button variant="outline" size="sm" className="flex-1 text-red-600" onClick={() => setSelectedRegister(register)}>
                        <PowerOff className="h-4 w-4 mr-1" /> Fermer
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" className="flex-1" onClick={() => setSelectedRegister(register)}>
                          <Power className="h-4 w-4 mr-1" /> Ouvrir
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal action caisse */}
        {selectedRegister && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedRegister.status === 'open' ? 'Fermer' : 'Ouvrir'} — {selectedRegister.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRegister(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRegister.status === 'open' ? (
                  <>
                    <p className="text-sm text-gray-600">Résumé de la session :</p>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between"><span>Fond de caisse</span><span className="font-semibold">{selectedRegister.openingBalance.toFixed(2)} €</span></div>
                      <div className="flex justify-between"><span>Ventes</span><span className="font-semibold text-green-600">+{selectedRegister.totalSales.toFixed(2)} €</span></div>
                      <div className="flex justify-between"><span>Transactions</span><span className="font-semibold">{selectedRegister.salesCount}</span></div>
                      <hr />
                      <div className="flex justify-between font-bold"><span>Total théorique</span><span>{(selectedRegister.openingBalance + selectedRegister.totalSales).toFixed(2)} €</span></div>
                    </div>
                    <Input placeholder="Solde de clôture réel (€)" type="number" />
                    <textarea className="w-full border rounded-lg p-2 text-sm" rows={2} placeholder="Notes de clôture..."></textarea>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Configurez le fond de caisse pour ouvrir la session.</p>
                    <Input placeholder="Fond de caisse (€)" type="number" defaultValue="200" />
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedRegister(null)}>Annuler</Button>
                  <Button onClick={() => setSelectedRegister(null)}>
                    {selectedRegister.status === 'open' ? 'Fermer la caisse' : 'Ouvrir la caisse'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal nouvelle caisse */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nouvelle caisse</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nom de la caisse *" />
                <Input placeholder="Fond de caisse initial (€)" type="number" defaultValue="200" />
                <textarea className="w-full border rounded-lg p-2 text-sm" rows={2} placeholder="Notes..."></textarea>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
                  <Button onClick={() => setShowAddModal(false)}>Créer la caisse</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
