'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import {
  ArrowLeft,
  Bell,
  MessageCircle,
  Star,
  ShoppingBag,
  CheckCheck,
  Check,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';

type NotificationType = 'message' | 'review' | 'order' | 'system' | 'ideabook' | 'project' | 'quote';

interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
  sender?: { firstName: string; lastName: string; avatar?: string };
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  message: { icon: MessageCircle, color: 'bg-purple-100 text-purple-600', label: 'Message' },
  review: { icon: Star, color: 'bg-amber-100 text-amber-600', label: 'Avis' },
  order: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', label: 'Commande' },
  system: { icon: Bell, color: 'bg-gray-100 text-gray-600', label: 'Système' },
  ideabook: { icon: Bell, color: 'bg-pink-100 text-pink-600', label: 'Ideabook' },
  project: { icon: Bell, color: 'bg-indigo-100 text-indigo-600', label: 'Projet' },
  quote: { icon: Bell, color: 'bg-teal-100 text-teal-600', label: 'Devis' },
};

const tabs = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'message', label: 'Messages' },
  { value: 'review', label: 'Avis' },
  { value: 'order', label: 'Commandes' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function filterNotifications(notifications: Notification[], tab: string): Notification[] {
  if (tab === 'all') return notifications;
  if (tab === 'unread') return notifications.filter((n) => !n.read);
  return notifications.filter((n) => n.type === tab);
}

export default function DashboardNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await api.get<Notification[]>('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch {
      // API unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    try {
      await api.put(`/notifications/${id}/read`);
    } catch { /* revert silently */ }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put('/notifications/read-all');
    } catch { /* revert silently */ }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Centre de Notifications</h1>
              {unreadCount > 0 && (
                <p className="mt-1 text-gray-500">
                  <span className="font-medium text-emerald-600">{unreadCount}</span> notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
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

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
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
                        const config = typeConfig[notification.type] || typeConfig.system;
                        const Icon = config.icon;
                        return (
                          <Card
                            key={notification._id}
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
                                  <p className="text-sm text-gray-500">{notification.content}</p>
                                  <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
                                </div>
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification._id)}
                                    className="shrink-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Lu
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
          )}

          {/* Link to full notifications */}
          <div className="text-center mt-6">
            <Link href="/notifications" className="text-sm text-emerald-600 hover:underline">
              Voir toutes les notifications →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
