import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles - MyHouz',
  description: 'Lisez nos articles et conseils d\'experts pour réussir vos projets de rénovation et décoration.',
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
