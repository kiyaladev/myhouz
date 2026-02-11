import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets - MyHouz',
  description: 'Explorez des milliers de projets de rénovation et de décoration pour trouver l\'inspiration.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
