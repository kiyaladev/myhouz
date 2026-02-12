'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Check,
  Crown,
  Star,
  CreditCard,
} from 'lucide-react';

const currentPlan = 'gratuit';

const plans = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    price: 0,
    features: [
      '5 projets',
      '10 produits',
      'Profil basique',
      'Support par email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    recommended: true,
    features: [
      'Projets illimités',
      '100 produits',
      'Profil vérifié',
      'Statistiques avancées',
      'Support prioritaire',
      'Badge Pro',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    features: [
      'Tout Pro +',
      'Produits illimités',
      'Mise en avant dans les résultats',
      'Publicité sur la plateforme',
      'Manager dédié',
    ],
  },
];

const invoices = [
  { id: '1', date: '01 Jan 2025', description: 'Abonnement Gratuit — Janvier 2025', amount: '0,00 €', status: 'Payée' },
  { id: '2', date: '01 Déc 2024', description: 'Abonnement Gratuit — Décembre 2024', amount: '0,00 €', status: 'Payée' },
  { id: '3', date: '01 Nov 2024', description: 'Abonnement Gratuit — Novembre 2024', amount: '0,00 €', status: 'Payée' },
  { id: '4', date: '01 Oct 2024', description: 'Abonnement Gratuit — Octobre 2024', amount: '0,00 €', status: 'Payée' },
];

export default function ProSubscriptionPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion de l&apos;Abonnement</h1>
              <p className="mt-1 text-gray-500">Gérez votre abonnement et consultez vos factures</p>
            </div>
          </div>

          {/* Current Plan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-emerald-600" />
                Plan actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Plan Gratuit</h3>
                  <p className="text-gray-500 mt-1">Votre plan actif depuis octobre 2024</p>
                  <ul className="mt-4 space-y-2">
                    {plans[0].features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-100 text-emerald-800">Actif</Badge>
                  <p className="mt-2 text-2xl font-bold text-gray-900">0 €<span className="text-sm font-normal text-gray-500">/mois</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Choisir un plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              return (
                <Card
                  key={plan.id}
                  className={
                    plan.recommended
                      ? 'border-2 border-emerald-500 relative'
                      : ''
                  }
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Recommandé
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {plan.price} €<span className="text-sm font-normal text-gray-500">/mois</span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <Button disabled className="w-full">
                        Plan actuel
                      </Button>
                    ) : (
                      <Button
                        className={
                          plan.recommended
                            ? 'w-full bg-emerald-600 hover:bg-emerald-700'
                            : 'w-full bg-gray-900 hover:bg-gray-800'
                        }
                      >
                        Passer au {plan.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Historique de facturation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Description</th>
                      <th className="pb-3 font-medium">Montant</th>
                      <th className="pb-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b last:border-0">
                        <td className="py-3 text-gray-600">{invoice.date}</td>
                        <td className="py-3 text-gray-900">{invoice.description}</td>
                        <td className="py-3 text-gray-600">{invoice.amount}</td>
                        <td className="py-3">
                          <Badge className="bg-emerald-100 text-emerald-800">{invoice.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
