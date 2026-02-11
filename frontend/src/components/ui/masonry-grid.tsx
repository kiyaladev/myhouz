'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className,
}: MasonryGridProps) {
  const items = React.Children.toArray(children);

  // Distribute items across columns round-robin
  const cols: React.ReactNode[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => {
    cols[i % columns].push(item);
  });

  return (
    <div
      className={cn('flex', className)}
      style={{ gap: `${gap}px` }}
    >
      {cols.map((col, colIndex) => (
        <div
          key={colIndex}
          className="flex flex-col flex-1"
          style={{ gap: `${gap}px` }}
        >
          {col.map((item, itemIndex) => (
            <div key={itemIndex}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
