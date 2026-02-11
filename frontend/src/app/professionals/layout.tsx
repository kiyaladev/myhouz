import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professionnels - MyHouz',
  description: 'Trouvez des professionnels qualifiés pour vos projets de rénovation et décoration près de chez vous.',
};

export default function ProfessionalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
