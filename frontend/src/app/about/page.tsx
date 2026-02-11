import React from 'react';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      title: 'Innovation',
      description:
        'Nous repoussons les limites de la technologie pour offrir une expérience unique à nos utilisateurs.',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Qualité',
      description:
        'Nous sélectionnons rigoureusement nos professionnels et produits pour garantir l&apos;excellence.',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      title: 'Communauté',
      description:
        'Nous croyons en la force du partage et de la collaboration entre passionnés de décoration.',
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const stats = [
    { label: 'Projets inspirants', value: '15,000+' },
    { label: 'Professionnels vérifiés', value: '2,500+' },
    { label: 'Produits disponibles', value: '50,000+' },
    { label: 'Utilisateurs satisfaits', value: '100,000+' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            À propos de MyHouz
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            La plateforme qui connecte les passionnés de décoration avec les meilleurs
            professionnels et produits pour transformer chaque intérieur.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Chez MyHouz, notre mission est de rendre la décoration et la rénovation
              accessibles à tous. Nous croyons que chaque foyer mérite d&apos;être un
              espace qui inspire et reflète la personnalité de ses habitants. En
              connectant particuliers, professionnels et fournisseurs, nous créons un
              écosystème unique où chaque projet devient une réalité.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos valeurs</h2>
            <p className="text-lg text-gray-600">
              Les principes qui guident chacune de nos actions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Notre histoire
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                MyHouz est né d&apos;un constat simple : trouver l&apos;inspiration et
                les bons professionnels pour un projet de décoration ou de rénovation
                est souvent un parcours du combattant.
              </p>
              <p>
                Fondée par une équipe passionnée de design et de technologie, notre
                plateforme rassemble aujourd&apos;hui une communauté dynamique de
                particuliers, d&apos;architectes, de décorateurs et d&apos;artisans qui
                partagent la même passion pour les beaux intérieurs.
              </p>
              <p>
                Depuis nos débuts, nous avons aidé des milliers de familles à
                concrétiser leurs rêves en leur offrant les outils, l&apos;inspiration
                et les contacts nécessaires pour mener à bien leurs projets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Rejoignez la communauté MyHouz
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Que vous soyez particulier ou professionnel, MyHouz vous accompagne dans
            tous vos projets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              S&apos;inscrire gratuitement
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
