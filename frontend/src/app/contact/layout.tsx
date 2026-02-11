import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - MyHouz',
  description: 'Contactez l\'équipe MyHouz pour toute question ou suggestion. Nous sommes là pour vous aider.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
