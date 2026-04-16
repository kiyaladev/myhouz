'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Lock, Bell, Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface NotificationPrefs {
  globalEnabled: boolean;
  email: Record<string, boolean>;
  inApp: Record<string, boolean>;
}

export default function DashboardSettingsPage() {
  const [profileForm, setProfileForm] = useState({
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.com',
    phone: '06 12 34 56 78',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    globalEnabled: true,
    email: { messages: true, reviews: true, orders: true, ideabooks: true, projects: true, system: true, quotes: true },
    inApp: { messages: true, reviews: true, orders: true, ideabooks: true, projects: true, system: true, quotes: true },
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Load notification preferences from API
  const loadPreferences = useCallback(async () => {
    try {
      const res = await api.get<NotificationPrefs>('/notifications/preferences');
      if (res.success && res.data) {
        setNotifPrefs(res.data);
      }
    } catch {
      // Use defaults
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const savePreferences = async () => {
    setSavingPrefs(true);
    setPrefsSaved(false);
    try {
      await api.put('/notifications/preferences', notifPrefs);
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch {
      // Could show error
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
              <p className="mt-1 text-gray-500">Gérez votre compte et vos préférences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-emerald-600" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  Changer le mot de passe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Lock className="h-4 w-4 mr-2" />
                  Mettre à jour
                </Button>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-emerald-600" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Global toggle */}
                <label className="flex items-center justify-between py-2 cursor-pointer border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Activer les notifications</p>
                    <p className="text-xs text-gray-500">Désactiver toutes les notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPrefs.globalEnabled}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, globalEnabled: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>

                {notifPrefs.globalEnabled && (
                  <>
                    {/* Email notifications */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Notifications par e-mail</h4>
                      {[
                        { key: 'messages', label: 'Messages', desc: 'Recevoir un e-mail pour chaque nouveau message' },
                        { key: 'reviews', label: 'Avis et réponses', desc: 'Être notifié des nouveaux avis' },
                        { key: 'orders', label: 'Commandes', desc: 'Mises à jour sur vos commandes' },
                        { key: 'quotes', label: 'Devis', desc: 'Nouvelles demandes de devis' },
                        { key: 'ideabooks', label: 'Ideabooks', desc: 'Activité sur vos carnets d\'idées' },
                        { key: 'projects', label: 'Projets', desc: 'Activité sur vos projets' },
                        { key: 'system', label: 'Système', desc: 'Mises à jour et annonces de la plateforme' },
                      ].map((pref) => (
                        <label key={pref.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                            <p className="text-xs text-gray-500">{pref.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifPrefs.email[pref.key] !== false}
                            onChange={(e) => setNotifPrefs({
                              ...notifPrefs,
                              email: { ...notifPrefs.email, [pref.key]: e.target.checked },
                            })}
                            className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                        </label>
                      ))}
                    </div>

                    {/* In-app notifications */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Notifications dans l&apos;application</h4>
                      {[
                        { key: 'messages', label: 'Messages', desc: 'Notifications temps réel pour les messages' },
                        { key: 'reviews', label: 'Avis', desc: 'Notifications pour les nouveaux avis' },
                        { key: 'orders', label: 'Commandes', desc: 'Notifications de suivi de commandes' },
                        { key: 'quotes', label: 'Devis', desc: 'Notifications de devis' },
                        { key: 'ideabooks', label: 'Ideabooks', desc: 'Notifications d\'activité ideabooks' },
                        { key: 'projects', label: 'Projets', desc: 'Notifications d\'activité projets' },
                        { key: 'system', label: 'Système', desc: 'Notifications système' },
                      ].map((pref) => (
                        <label key={pref.key} className="flex items-center justify-between py-2 cursor-pointer">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                            <p className="text-xs text-gray-500">{pref.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifPrefs.inApp[pref.key] !== false}
                            onChange={(e) => setNotifPrefs({
                              ...notifPrefs,
                              inApp: { ...notifPrefs.inApp, [pref.key]: e.target.checked },
                            })}
                            className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </>
                )}

                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={savePreferences}
                  disabled={savingPrefs}
                >
                  {savingPrefs ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {prefsSaved ? 'Préférences enregistrées ✓' : 'Enregistrer les préférences'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
