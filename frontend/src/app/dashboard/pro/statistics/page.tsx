'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  FileText,
  TrendingUp,
  Euro,
  Star,
  Heart,
  BarChart3,
} from 'lucide-react';

const overviewStats = [
  { label: 'Vues du profil', value: '1 247', icon: Eye, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Demandes de devis', value: '23', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { label: 'Taux de conversion', value: '18.4%', icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
  { label: "Chiffre d'affaires", value: '12 450 €', icon: Euro, color: 'bg-purple-100 text-purple-600' },
];

const monthlyViews = [
  { month: 'Oct', value: 180 },
  { month: 'Nov', value: 220 },
  { month: 'Déc', value: 165 },
  { month: 'Jan', value: 310 },
  { month: 'Fév', value: 275 },
  { month: 'Mar', value: 350 },
];

const quoteCategories = [
  { category: 'Rénovation cuisine', count: 8, acceptanceRate: 75, avgBudget: 15000 },
  { category: 'Aménagement salon', count: 5, acceptanceRate: 60, avgBudget: 8500 },
  { category: 'Salle de bain', count: 4, acceptanceRate: 50, avgBudget: 12000 },
  { category: 'Extension maison', count: 3, acceptanceRate: 33, avgBudget: 45000 },
  { category: 'Terrasse & Jardin', count: 3, acceptanceRate: 67, avgBudget: 6000 },
];

const ratingDistribution = [
  { stars: 5, count: 18, percentage: 60 },
  { stars: 4, count: 7, percentage: 23 },
  { stars: 3, count: 3, percentage: 10 },
  { stars: 2, count: 1, percentage: 4 },
  { stars: 1, count: 1, percentage: 3 },
];

const topProjects = [
  { id: '1', title: 'Rénovation Appartement Haussmannien', views: 1432, likes: 89 },
  { id: '2', title: 'Cuisine Moderne Minimaliste', views: 987, likes: 67 },
  { id: '3', title: 'Loft Industriel Converti', views: 756, likes: 54 },
  { id: '4', title: 'Jardin Méditerranéen', views: 623, likes: 41 },
  { id: '5', title: 'Suite Parentale Luxe', views: 512, likes: 38 },
];

const maxMonthlyValue = Math.max(...monthlyViews.map((m) => m.value));

export default function ProStatisticsPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/pro" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
              <p className="mt-1 text-gray-500">Suivez les performances de votre activité</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800">
              <BarChart3 className="h-3 w-3 mr-1" />
              30 derniers jours
            </Badge>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {overviewStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vues mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-48">
                  {monthlyViews.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">{m.value}</span>
                      <div
                        className="w-full bg-emerald-500 rounded-t-md transition-all"
                        style={{ height: `${(m.value / maxMonthlyValue) * 100}%` }}
                      />
                      <span className="text-xs text-gray-500">{m.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Review Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Avis clients</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-900">4.3</span>
                    <span className="text-sm text-gray-500">(30 avis)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratingDistribution.map((r) => (
                    <div key={r.stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-8">{r.stars} ★</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{ width: `${r.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-6 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote Request Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Demandes de devis par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Catégorie</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Demandes</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Taux d&apos;acceptation</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Budget moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteCategories.map((q) => (
                      <tr key={q.category} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{q.category}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-blue-100 text-blue-800">{q.count}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            className={
                              q.acceptanceRate >= 60
                                ? 'bg-emerald-100 text-emerald-800'
                                : q.acceptanceRate >= 40
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                            }
                          >
                            {q.acceptanceRate}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {q.avgBudget.toLocaleString('fr-FR')} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Projects by Views */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top projets par vues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-lg font-bold text-emerald-600 w-8 text-center">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{project.title}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views.toLocaleString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {project.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
