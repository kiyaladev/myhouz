import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produits - MyHouz',
  description: 'Découvrez notre sélection de produits de qualité pour la rénovation et la décoration de votre maison.',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
