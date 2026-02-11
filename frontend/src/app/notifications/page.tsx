'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Bell,
  MessageCircle,
  Star,
  ShoppingBag,
  CheckCheck,
  Check,
} from 'lucide-react';

type NotificationType = 'message' | 'review' | 'order' | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'message', title: 'Nouveau message', description: 'Jean Dupont vous a envoyé un message concernant votre projet', time: 'Il y a 5 min', read: false },
  { id: 2, type: 'review', title: 'Nouvel avis', description: 'Marie Martin a laissé un avis 5 étoiles sur votre profil', time: 'Il y a 1h', read: false },
  { id: 3, type: 'order', title: 'Commande expédiée', description: 'Votre commande #12345 a été expédiée', time: 'Il y a 3h', read: true },
  { id: 4, type: 'system', title: 'Mise à jour du profil', description: 'Votre profil a été vérifié avec succès', time: 'Il y a 5h', read: false },
  { id: 5, type: 'message', title: 'Nouveau message', description: 'Sophie Bernard vous a envoyé un devis', time: 'Il y a 8h', read: true },
  { id: 6, type: 'order', title: 'Commande livrée', description: 'Votre commande #12300 a été livrée', time: 'Hier', read: true },
  { id: 7, type: 'review', title: 'Nouvel avis', description: 'Pierre Durand a laissé un avis 4 étoiles', time: 'Hier', read: false },
  { id: 8, type: 'system', title: 'Nouvelle fonctionnalité', description: 'Découvrez les nouvelles options de recherche avancée', time: 'Il y a 2 jours', read: true },
  { id: 9, type: 'message', title: 'Nouveau message', description: 'Luc Moreau a répondu à votre demande', time: 'Il y a 3 jours', read: true },
  { id: 10, type: 'order', title: 'Confirmation de commande', description: 'Votre commande #12280 a été confirmée', time: 'Il y a 4 jours', read: true },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; label: string }> = {
  message: { icon: MessageCircle, color: 'bg-purple-100 text-purple-600', label: 'Message' },
  review: { icon: Star, color: 'bg-amber-100 text-amber-600', label: 'Avis' },
  order: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', label: 'Commande' },
  system: { icon: Bell, color: 'bg-gray-100 text-gray-600', label: 'Système' },
};

const tabs = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'message', label: 'Messages' },
  { value: 'review', label: 'Avis' },
  { value: 'order', label: 'Commandes' },
  { value: 'system', label: 'Système' },
];

function filterNotifications(notifications: Notification[], tab: string): Notification[] {
  if (tab === 'all') return notifications;
  if (tab === 'unread') return notifications.filter((n) => !n.read);
  return notifications.filter((n) => n.type === tab);
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filterNotifications(notifications, activeTab);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="mt-1 text-gray-500">
                  Vous avez <span className="font-medium text-emerald-600">{unreadCount}</span> notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          {/* Tabs & Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {filterNotifications(notifications, tab.value).length === 0 ? (
                  <EmptyState
                    icon={<Bell className="h-10 w-10" />}
                    title="Aucune notification"
                    description="Vous n'avez aucune notification dans cette catégorie."
                  />
                ) : (
                  <div className="space-y-3">
                    {filterNotifications(notifications, tab.value).map((notification) => {
                      const config = typeConfig[notification.type];
                      const Icon = config.icon;
                      return (
                        <Card
                          key={notification.id}
                          className={
                            notification.read
                              ? ''
                              : 'border-l-4 border-l-emerald-600 bg-emerald-50/40'
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded-lg shrink-0 ${config.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </p>
                                  <Badge variant={notification.read ? 'secondary' : 'default'} className={notification.read ? '' : 'bg-emerald-600'}>
                                    {config.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500">{notification.description}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Marquer comme lu
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
