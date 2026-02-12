import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantConfig = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, dismissible, onDismiss, children, ...props }, ref) => {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative rounded-lg border p-4',
          config.container,
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.iconColor)} />
          <div className="flex-1 min-w-0">
            {title && (
              <h5 className="mb-1 font-semibold text-sm">{title}</h5>
            )}
            <div className="text-sm opacity-90">{children}</div>
          </div>
          {dismissible && (
            <button
              onClick={onDismiss}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps };
