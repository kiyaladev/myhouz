'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const popularCategories = [
  { name: 'Cuisine', href: '/projects?category=cuisine', icon: '🍳' },
  { name: 'Salle de bain', href: '/projects?category=salle-de-bain', icon: '🛁' },
  { name: 'Salon', href: '/projects?category=salon', icon: '🛋️' },
  { name: 'Chambre', href: '/projects?category=chambre', icon: '🛏️' },
  { name: 'Extérieur', href: '/projects?category=exterieur', icon: '🌿' },
  { name: 'Bureau', href: '/projects?category=bureau', icon: '💼' },
];

export default function PersonalizedSection() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const isProfessional = user.userType === 'professionnel';

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bienvenue, {user.firstName} 👋
        </h2>

        {isProfessional ? (
          /* Professional quick links */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/dashboard/projects">
              <Card className="p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mes projets</p>
                    <p className="text-sm text-gray-500">Gérer mon portfolio</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/products">
              <Card className="p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mes produits</p>
                    <p className="text-sm text-gray-500">Gérer ma boutique</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/profile">
              <Card className="p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mon profil pro</p>
                    <p className="text-sm text-gray-500">Modifier mes infos</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard">
              <Card className="p-5 bg-emerald-50 border-emerald-200 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-700">Gérer mon activité</p>
                    <p className="text-sm text-emerald-600">Tableau de bord</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ) : (
          /* Particulier quick links + recommended categories */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/favorites">
                <Card className="p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mes favoris</p>
                      <p className="text-sm text-gray-500">Projets sauvegardés</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/ideabooks">
                <Card className="p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mes Ideabooks</p>
                      <p className="text-sm text-gray-500">Collections d&apos;idées</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/orders">
                <Card className="p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mes commandes</p>
                      <p className="text-sm text-gray-500">Suivi des achats</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            {/* Recommended categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Catégories recommandées</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {popularCategories.map((cat) => (
                  <Link key={cat.name} href={cat.href}>
                    <Card className="p-4 text-center hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <span className="text-2xl mb-2 block">{cat.icon}</span>
                      <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
