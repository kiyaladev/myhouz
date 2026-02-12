'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delayMs?: number;
}

export function Tooltip({ content, children, side = 'top', className, delayMs = 200 }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95',
            positionClasses[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
