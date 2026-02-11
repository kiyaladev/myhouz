import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recherche - MyHouz',
  description: 'Recherchez des projets, des professionnels et des produits sur MyHouz.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
