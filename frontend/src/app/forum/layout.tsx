import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forum - MyHouz',
  description: 'Participez aux discussions de la communauté MyHouz sur la rénovation et la décoration.',
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
