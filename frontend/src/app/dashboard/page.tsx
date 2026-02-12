'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  ShoppingBag,
  Star,
  MessageCircle,
  Clock,
  ArrowRight,
  Search,
  Package,
  Users,
  Heart,
  Settings,
  Bell,
} from 'lucide-react';

// Mock data
const user = { firstName: 'Marie' };

const overviewCards = [
  { label: 'Mes Ideabooks', count: 5, icon: BookOpen, color: 'bg-emerald-100 text-emerald-600', href: '/dashboard/ideabooks' },
  { label: 'Mes Commandes', count: 3, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', href: '/dashboard/orders' },
  { label: 'Mes Avis', count: 8, icon: Star, color: 'bg-amber-100 text-amber-600', href: '/dashboard/reviews' },
  { label: 'Messages', count: 2, icon: MessageCircle, color: 'bg-purple-100 text-purple-600', href: '/messages' },
];

const recentActivity = [
  { id: '1', text: 'Vous avez ajouté une photo à l\'ideabook "Salon Moderne"', time: 'Il y a 2 heures' },
  { id: '2', text: 'Votre commande #CMD-2024-042 a été expédiée', time: 'Il y a 5 heures' },
  { id: '3', text: 'Vous avez laissé un avis sur "Rénovation Cuisine Paris"', time: 'Hier' },
  { id: '4', text: 'Nouveau message de Jean Dupont (Architecte)', time: 'Hier' },
  { id: '5', text: 'Vous avez créé l\'ideabook "Terrasse Été 2025"', time: 'Il y a 3 jours' },
];

const ideabooks = [
  { id: '1', name: 'Salon Moderne', itemCount: 12, thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=150&fit=crop' },
  { id: '2', name: 'Cuisine Contemporaine', itemCount: 8, thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop' },
  { id: '3', name: 'Terrasse Été 2025', itemCount: 3, thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=150&fit=crop' },
];

const recentOrders = [
  { id: '1', orderNumber: 'CMD-2024-042', date: '15 Jan 2025', status: 'En cours' as const, total: 249.99 },
  { id: '2', orderNumber: 'CMD-2024-039', date: '08 Jan 2025', status: 'Livrée' as const, total: 589.00 },
];

const statusStyles: Record<string, string> = {
  'En cours': 'bg-yellow-100 text-yellow-800',
  'Livrée': 'bg-green-100 text-green-800',
  'En attente': 'bg-gray-100 text-gray-800',
};

export default function DashboardPage() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de Bord</h1>
            <p className="mt-1 text-gray-500">
              Bienvenue, <span className="font-medium text-emerald-600">{user.firstName}</span> 👋
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.label} href={card.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${card.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                          <p className="text-sm text-gray-500">{card.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="flex items-start gap-3">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">{activity.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accès Rapide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/projects">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Search className="h-4 w-4 mr-2" />
                        Parcourir les projets
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        Découvrir les produits
                      </Button>
                    </Link>
                    <Link href="/professionals">
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Trouver un professionnel
                      </Button>
                    </Link>
                    <Link href="/dashboard/favorites">
                      <Button variant="outline">
                        <Heart className="h-4 w-4 mr-2" />
                        Mes favoris
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Button>
                    </Link>
                    <Link href="/dashboard/notifications">
                      <Button variant="outline">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Mes Ideabooks */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      Mes Ideabooks
                    </CardTitle>
                    <Link href="/ideabooks" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                      Voir tout <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {ideabooks.map((book) => (
                      <li key={book.id} className="flex items-center gap-3">
                        <Image
                          src={book.thumbnail}
                          alt={book.name}
                          className="w-14 h-14 rounded-lg object-cover"
                          width={56}
                          height={56}
                          unoptimized
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{book.name}</p>
                          <p className="text-xs text-gray-500">{book.itemCount} éléments</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Commandes Récentes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingBag className="h-5 w-5 text-emerald-600" />
                      Commandes Récentes
                    </CardTitle>
                    <Link href="/orders" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                      Voir tout <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recentOrders.map((order) => (
                      <li key={order.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">#{order.orderNumber}</span>
                          <Badge className={statusStyles[order.status]}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{order.date}</span>
                          <span className="font-medium text-gray-900">{order.total.toFixed(2)} €</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
