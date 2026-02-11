import React from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-9xl font-bold text-emerald-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            Vérifiez l&apos;URL ou retournez à la page d&apos;accueil.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </Layout>
  );
}
