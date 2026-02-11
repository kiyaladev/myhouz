import type { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Home, ShoppingBag, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos - MyHouz',
  description:
    'Découvrez MyHouz, la plateforme de référence pour la rénovation et la décoration de votre maison.',
};

const stats = [
  { label: 'Projets', value: '10,000+', icon: Home },
  { label: 'Professionnels', value: '5,000+', icon: Users },
  { label: 'Produits', value: '50,000+', icon: ShoppingBag },
  { label: 'Utilisateurs', value: '100,000+', icon: Star },
];

const team = [
  {
    name: 'Sophie Martin',
    role: 'Directrice Générale',
    bio: 'Passionnée d\'architecture et de design, Sophie dirige MyHouz avec la vision de rendre la rénovation accessible à tous.',
  },
  {
    name: 'Lucas Dupont',
    role: 'Directeur Technique',
    bio: 'Ingénieur de formation, Lucas conçoit l\'infrastructure technique qui connecte propriétaires et professionnels.',
  },
  {
    name: 'Camille Lefèvre',
    role: 'Responsable Design',
    bio: 'Ancienne architecte d\'intérieur, Camille veille à offrir une expérience utilisateur inspirante et intuitive.',
  },
  {
    name: 'Antoine Bernard',
    role: 'Responsable Commercial',
    bio: 'Fort de 10 ans dans le secteur de la rénovation, Antoine développe notre réseau de professionnels partenaires.',
  },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            À propos de <span className="text-emerald-600">MyHouz</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La plateforme de référence pour transformer votre maison en un espace qui vous ressemble.
          </p>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              MyHouz a pour mission de connecter les propriétaires avec les meilleurs professionnels
              de la rénovation et de la décoration. Nous croyons que chaque maison mérite d&apos;être
              un lieu d&apos;inspiration et de bien-être.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Que vous cherchiez à rénover votre cuisine, aménager votre jardin ou simplement
              trouver l&apos;inspiration pour votre prochain projet, MyHouz vous accompagne à chaque étape
              avec des outils, des idées et un réseau de professionnels qualifiés.
            </p>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="h-8 w-8 text-emerald-200 mx-auto mb-3" />
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-emerald-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-emerald-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez la communauté MyHouz</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Que vous soyez propriétaire ou professionnel, MyHouz vous offre les outils pour donner vie à vos projets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/auth/register">Créer un compte</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">Parcourir les projets</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
