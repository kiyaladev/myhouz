import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avis - MyHouz',
  description: 'Consultez les avis vérifiés sur les professionnels et produits de la plateforme MyHouz.',
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
