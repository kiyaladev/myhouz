import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Centre d\'aide - MyHouz',
  description: 'Trouvez des réponses à vos questions dans notre FAQ et centre d\'aide MyHouz.',
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
