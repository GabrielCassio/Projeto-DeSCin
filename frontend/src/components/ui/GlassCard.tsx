import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Padding = 'none' | 'sm' | 'md' | 'lg';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: Padding;
  interactive?: boolean;
}

const paddingClasses: Record<Padding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function GlassCard({
  children,
  padding = 'md',
  interactive = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-surface-primary/80 backdrop-blur-xl',
        'border border-border-subtle rounded-xl',
        'shadow-sm',
        paddingClasses[padding],
        interactive && [
          'cursor-pointer',
          'transition-all duration-200',
          'hover:shadow-md hover:border-border-default',
          'active:scale-[0.995]',
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
