'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
  className?: string;
}

export function RatingDisplay({ value, max = 5, size = 'md', showValue, count, className }: RatingDisplayProps) {
  const sizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };
  const iconSize = sizes[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i < Math.floor(value) ? 'text-yellow-400 fill-yellow-400' :
              i < value ? 'text-yellow-400 fill-yellow-400 opacity-50' :
              'text-gray-300'
            )}
          />
        ))}
      </div>
      {showValue && <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-sm text-gray-500">({count})</span>}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingInput({ value, onChange, max = 5, size = 'md', className }: RatingInputProps) {
  const [hoverValue, setHoverValue] = React.useState(0);
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  const iconSize = sizes[size];

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHoverValue(i + 1)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(i + 1)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              iconSize,
              'transition-colors cursor-pointer',
              (hoverValue || value) > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            )}
          />
        </button>
      ))}
    </div>
  );
}
