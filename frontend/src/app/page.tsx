import React from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Link from 'next/link';

export default function HomePage() {
  const featuredCategories = [
    {
      name: 'Cuisine',
      image: '/images/kitchen.jpg',
      href: '/projects?category=cuisine',
      description: '1,250+ projets'
    },
    {
      name: 'Salle de bain',
      image: '/images/bathroom.jpg',
      href: '/projects?category=salle-de-bain',
      description: '890+ projets'
    },
    {
      name: 'Salon',
      image: '/images/living-room.jpg',
      href: '/projects?category=salon',
      description: '2,100+ projets'
    },
    {
      name: 'Chambre',
      image: '/images/bedroom.jpg',
      href: '/projects?category=chambre',
      description: '756+ projets'
    }
  ];

  const stats = [
    { label: 'Projets inspirants', value: '15,000+' },
    { label: 'Professionnels', value: '2,500+' },
    { label: 'Produits', value: '50,000+' },
    { label: 'Utilisateurs actifs', value: '100,000+' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transformez votre maison en 
              <span className="text-emerald-600"> rêve</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez des millions d&apos;idées pour votre intérieur, connectez-vous avec des professionnels 
              qualifiés et trouvez les meilleurs produits pour vos projets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Explorer les projets
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Trouver un professionnel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Que cherchez-vous ? (ex: cuisine moderne, carrelage...)"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <Button size="lg" className="md:w-auto px-8">
              Rechercher
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explorez par pièce
            </h2>
            <p className="text-lg text-gray-600">
              Trouvez l&apos;inspiration pour chaque espace de votre maison
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="h-64 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ 
                      backgroundImage: `url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center)` 
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              MyHouz en chiffres
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-600">
              Une plateforme complète pour tous vos projets de décoration et rénovation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inspiration illimitée</h3>
              <p className="text-gray-600">
                Parcourez des milliers de projets réalisés par des professionnels et des particuliers passionnés.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professionnels qualifiés</h3>
              <p className="text-gray-600">
                Connectez-vous avec des architectes, décorateurs et artisans vérifiés près de chez vous.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Marketplace intégrée</h3>
              <p className="text-gray-600">
                Achetez directement les produits que vous aimez avec livraison et garantie incluses.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre projet ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers d&apos;utilisateurs qui ont transformé leur intérieur avec MyHouz
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              S&apos;inscrire gratuitement
            </Button>
            <Button variant="outline" size="lg" className="px-8 border-white text-white hover:bg-white hover:text-gray-900">
              En savoir plus
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
