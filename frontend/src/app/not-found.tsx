import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-9xl font-bold text-emerald-600 mb-4">404</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page introuvable</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">
                <FolderOpen className="h-4 w-4 mr-2" />
                Parcourir les projets
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
