import React from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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

  const trendingProjects = [
    { id: '1', title: 'Loft parisien contemporain', professional: 'Sophie Dubois', likes: 342, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop' },
    { id: '2', title: 'Villa méditerranéenne', professional: 'Marc Leroy', likes: 289, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop' },
    { id: '3', title: 'Cuisine minimaliste blanche', professional: 'Claire Fontaine', likes: 256, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
    { id: '4', title: 'Jardin zen japonais', professional: 'Yuki Tanaka', likes: 198, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop' },
    { id: '5', title: 'Chambre bohème chic', professional: 'Léa Bernard', likes: 175, image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300&fit=crop' },
    { id: '6', title: 'Salle de bain spa luxe', professional: 'Antoine Moreau', likes: 163, image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop' },
  ];

  const featuredProfessionals = [
    { id: '1', name: 'Sophie Dubois', company: 'Studio Dubois Architecture', location: 'Paris', rating: 4.9, reviews: 127, services: ['Architecture', 'Rénovation'], color: 'bg-emerald-500' },
    { id: '2', name: 'Marc Leroy', company: 'Leroy Design Intérieur', location: 'Lyon', rating: 4.8, reviews: 98, services: ['Décoration', 'Home staging'], color: 'bg-blue-500' },
    { id: '3', name: 'Claire Fontaine', company: 'Fontaine & Associés', location: 'Bordeaux', rating: 4.7, reviews: 85, services: ['Cuisine', 'Salle de bain'], color: 'bg-purple-500' },
    { id: '4', name: 'Antoine Moreau', company: 'AM Paysage', location: 'Marseille', rating: 4.9, reviews: 112, services: ['Paysagisme', 'Extérieur'], color: 'bg-amber-500' },
  ];

  const popularProducts = [
    { id: '1', name: 'Canapé 3 places en velours', price: 899, rating: 4.5, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop' },
    { id: '2', name: 'Lampe suspension design', price: 189, rating: 4.7, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop' },
    { id: '3', name: 'Table basse en chêne massif', price: 449, rating: 4.6, image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=300&fit=crop' },
    { id: '4', name: 'Miroir mural art déco', price: 259, rating: 4.8, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop' },
  ];

  const recentArticles = [
    { slug: 'tendances-deco-2024', title: 'Les 10 tendances déco incontournables', excerpt: 'Découvrez les styles et matériaux qui domineront cette année dans nos intérieurs.', category: 'Tendances', readTime: '5 min', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' },
    { slug: 'renover-cuisine-budget', title: 'Rénover sa cuisine avec un petit budget', excerpt: 'Nos astuces pour transformer votre cuisine sans vous ruiner.', category: 'Rénovation', readTime: '8 min', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop' },
    { slug: 'choisir-artisan-confiance', title: 'Comment choisir un artisan de confiance', excerpt: 'Guide complet pour trouver le bon professionnel pour vos travaux.', category: 'Conseils', readTime: '6 min', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop' },
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

      {/* Trending Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Projets tendance</h2>
              <p className="text-lg text-gray-600">Les projets les plus appréciés du moment</p>
            </div>
            <Link href="/projects" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Voir tout →
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 scrollbar-hide">
            {trendingProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="flex-shrink-0 w-72">
                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative">
                    <img src={project.image} alt={project.title} className="w-full h-44 object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.professional}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {project.likes}
                    </div>
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

      {/* Featured Professionals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Professionnels à la une</h2>
              <p className="text-lg text-gray-600">Des experts vérifiés pour vos projets</p>
            </div>
            <Link href="/professionals" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProfessionals.map((pro) => (
              <Link key={pro.id} href={`/professionals/${pro.id}`}>
                <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${pro.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {pro.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                      <p className="text-sm text-gray-500">{pro.company}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">📍 {pro.location}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(pro.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{pro.rating} ({pro.reviews})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pro.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
                    ))}
                  </div>
                </Card>
              </Link>
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

      {/* Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Produits populaires</h2>
              <p className="text-lg text-gray-600">Les coups de cœur de notre communauté</p>
            </div>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">{product.price} €</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Articles récents</h2>
              <p className="text-lg text-gray-600">Conseils et inspiration pour vos projets</p>
            </div>
            <Link href="/articles" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                    <Badge className="absolute top-4 left-4">{article.category}</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                    <p className="text-xs text-gray-500">🕐 {article.readTime} de lecture</p>
                  </div>
                </Card>
              </Link>
            ))}
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
