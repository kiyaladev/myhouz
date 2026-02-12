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
  RotateCcw,
  ArrowLeft,
  Search,
  Plus,
  Package,
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  X,
  AlertTriangle,
} from 'lucide-react';

interface ReturnItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ProductReturn {
  id: string;
  returnNumber: string;
  date: string;
  customerName: string;
  items: ReturnItem[];
  total: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  resolution: 'refund' | 'exchange' | 'credit';
  reason: string;
  notes?: string;
}

const mockReturns: ProductReturn[] = [
  {
    id: '1', returnNumber: 'RET-2026-001', date: '2026-02-12T10:30:00',
    customerName: 'Jean Dupont',
    items: [{ productName: 'Perceuse Bosch GSB 18V', quantity: 1, unitPrice: 129.90 }],
    total: 129.90, status: 'pending', resolution: 'refund',
    reason: 'Produit défectueux', notes: 'La perceuse ne démarre plus après 2 jours'
  },
  {
    id: '2', returnNumber: 'RET-2026-002', date: '2026-02-11T14:15:00',
    customerName: 'Marie Lefèvre',
    items: [
      { productName: 'Lot vis inox 6x40 (x100)', quantity: 2, unitPrice: 12.50 },
      { productName: 'Chevilles Molly M6 (x50)', quantity: 1, unitPrice: 8.90 },
    ],
    total: 33.90, status: 'approved', resolution: 'exchange',
    reason: 'Mauvais produit livré', notes: 'Échange contre vis 6x50'
  },
  {
    id: '3', returnNumber: 'RET-2026-003', date: '2026-02-10T09:00:00',
    customerName: 'Pierre Martin',
    items: [{ productName: 'Scie circulaire Makita 190mm', quantity: 1, unitPrice: 249.00 }],
    total: 249.00, status: 'completed', resolution: 'refund',
    reason: 'Produit endommagé à la livraison'
  },
  {
    id: '4', returnNumber: 'RET-2026-004', date: '2026-02-09T16:45:00',
    customerName: 'Sophie Bernard',
    items: [{ productName: 'Mastic silicone transparent 310ml', quantity: 3, unitPrice: 7.90 }],
    total: 23.70, status: 'rejected', resolution: 'credit',
    reason: 'Autre', notes: 'Produit ouvert et partiellement utilisé'
  },
  {
    id: '5', returnNumber: 'RET-2026-005', date: '2026-02-08T11:20:00',
    customerName: 'Luc Moreau',
    items: [
      { productName: 'Clé à molette 250mm', quantity: 1, unitPrice: 18.50 },
      { productName: 'Jeu tournevis précision (x6)', quantity: 1, unitPrice: 14.90 },
    ],
    total: 33.40, status: 'pending', resolution: 'credit',
    reason: 'Produit défectueux'
  },
];

const statusConfig: Record<ProductReturn['status'], { label: string; classes: string }> = {
  pending: { label: 'En attente', classes: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approuvé', classes: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Complété', classes: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejeté', classes: 'bg-red-100 text-red-800' },
};

const resolutionLabels: Record<ProductReturn['resolution'], string> = {
  refund: 'Remboursement',
  exchange: 'Échange',
  credit: 'Avoir',
};

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [resolutionFilter, setResolutionFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ProductReturn | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredReturns = useMemo(() => {
    return mockReturns.filter(r => {
      const matchSearch = !searchQuery ||
        r.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchResolution = resolutionFilter === 'all' || r.resolution === resolutionFilter;
      return matchSearch && matchStatus && matchResolution;
    });
  }, [searchQuery, statusFilter, resolutionFilter]);

  const pendingCount = mockReturns.filter(r => r.status === 'pending').length;
  const totalRefunded = mockReturns.filter(r => r.status === 'completed').reduce((s, r) => s + r.total, 0);
  const creditCount = mockReturns.filter(r => r.resolution === 'credit' && r.status !== 'rejected').length;

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
              <RotateCcw className="h-6 w-6 text-blue-600" />
              Gestion des Retours
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/sales">Historique ventes</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pro/pos/stock">Stocks</Link>
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-1" /> Nouveau retour
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><RotateCcw className="h-5 w-5 text-blue-600" /></div>
              <div><p className="text-sm text-gray-500">Total retours</p><p className="text-xl font-bold">{mockReturns.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-sm text-gray-500">En attente</p><p className="text-xl font-bold">{pendingCount}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><Euro className="h-5 w-5 text-green-600" /></div>
              <div><p className="text-sm text-gray-500">Montant remboursé</p><p className="text-xl font-bold">{totalRefunded.toFixed(2)} €</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><AlertTriangle className="h-5 w-5 text-purple-600" /></div>
              <div><p className="text-sm text-gray-500">Avoirs en cours</p><p className="text-xl font-bold">{creditCount}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un retour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map(s => (
              <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)}>
                {s === 'all' ? 'Tous' : statusConfig[s].label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-6">
          <span className="text-sm text-gray-500 self-center">Résolution :</span>
          {(['all', 'refund', 'exchange', 'credit'] as const).map(r => (
            <Button key={r} variant={resolutionFilter === r ? 'default' : 'outline'} size="sm" onClick={() => setResolutionFilter(r)}>
              {r === 'all' ? 'Tous' : resolutionLabels[r]}
            </Button>
          ))}
        </div>

        {/* Return list */}
        {filteredReturns.length === 0 ? (
          <EmptyState
            title="Aucun retour trouvé"
            description="Aucun retour ne correspond à vos critères de recherche."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReturns.map(ret => (
              <Card key={ret.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedReturn(ret)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{ret.returnNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(ret.date).toLocaleDateString('fr-FR')} — {ret.customerName}
                      </p>
                    </div>
                    <Badge className={statusConfig[ret.status].classes}>{statusConfig[ret.status].label}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p className="flex items-center gap-1"><Package className="h-3 w-3" /> {ret.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{resolutionLabels[ret.resolution]}</Badge>
                    <span className="font-semibold">{ret.total.toFixed(2)} €</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail modal */}
        {selectedReturn && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  {selectedReturn.returnNumber}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReturn(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={statusConfig[selectedReturn.status].classes}>{statusConfig[selectedReturn.status].label}</Badge>
                  <Badge variant="secondary">{resolutionLabels[selectedReturn.resolution]}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Client</p>
                  <p>{selectedReturn.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{new Date(selectedReturn.date).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Raison</p>
                  <p className="text-sm">{selectedReturn.reason}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Articles</p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    {selectedReturn.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.productName} × {item.quantity}</span>
                        <span className="font-semibold">{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{selectedReturn.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
                {selectedReturn.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm">{selectedReturn.notes}</p>
                  </div>
                )}
                {selectedReturn.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" onClick={() => setSelectedReturn(null)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600" onClick={() => setSelectedReturn(null)}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create return modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nouveau retour</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nom du client *" />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Rechercher un produit..." className="pl-10" />
                </div>
                <Input placeholder="Quantité" type="number" defaultValue="1" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Raison</label>
                  <select className="w-full border rounded-lg p-2 text-sm mt-1">
                    <option value="defective">Produit défectueux</option>
                    <option value="wrong">Mauvais produit</option>
                    <option value="damaged">Endommagé</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Résolution</label>
                  <select className="w-full border rounded-lg p-2 text-sm mt-1">
                    <option value="refund">Remboursement</option>
                    <option value="exchange">Échange</option>
                    <option value="credit">Avoir</option>
                  </select>
                </div>
                <textarea className="w-full border rounded-lg p-2 text-sm" rows={2} placeholder="Notes..." />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
                  <Button onClick={() => setShowAddModal(false)}>Créer le retour</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
