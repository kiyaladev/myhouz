'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <Badge variant={user.userType === 'professionnel' ? 'default' : 'secondary'}>
                    {user.userType === 'professionnel' ? 'Professionnel' : 'Particulier'}
                  </Badge>
                </div>
                <p className="text-gray-500">{user.email}</p>
                {user.location?.city && (
                  <p className="text-gray-500 text-sm mt-1">
                    📍 {user.location.city}{user.location.country ? `, ${user.location.country}` : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Link href="/profile/edit">
                  <Button variant="outline">Modifier le profil</Button>
                </Link>
                <Button variant="outline" onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          {user.userType === 'professionnel' && user.professionalInfo && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.professionalInfo.companyName && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Entreprise</p>
                      <p className="text-gray-900">{user.professionalInfo.companyName}</p>
                    </div>
                  )}
                  {user.professionalInfo.services && user.professionalInfo.services.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Services</p>
                      <div className="flex flex-wrap gap-1">
                        {user.professionalInfo.services.map((service) => (
                          <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.professionalInfo.rating && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Note moyenne</p>
                      <p className="text-gray-900">
                        ⭐ {user.professionalInfo.rating.average.toFixed(1)} ({user.professionalInfo.rating.count} avis)
                      </p>
                    </div>
                  )}
                  {user.professionalInfo.verified && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Statut</p>
                      <Badge className="bg-green-100 text-green-800">✓ Vérifié</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold text-gray-900 mb-1">Mes Ideabooks</h3>
                <p className="text-sm text-gray-500">Vos carnets d&apos;inspiration</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold text-gray-900 mb-1">Messages</h3>
                <p className="text-sm text-gray-500">Vos conversations</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-semibold text-gray-900 mb-1">Mes Avis</h3>
                <p className="text-sm text-gray-500">Avis que vous avez laissés</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
