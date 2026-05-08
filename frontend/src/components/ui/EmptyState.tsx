import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-14 h-14 rounded-xl bg-bg-surface flex items-center justify-center text-text-muted mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-text-primary text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm max-w-xs mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
