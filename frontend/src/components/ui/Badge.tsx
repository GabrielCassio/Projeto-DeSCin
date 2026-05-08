import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatChange } from '../../utils/format';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';
type Size = 'xs' | 'sm' | 'md';

interface BadgeProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'sm', children, icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'font-medium tracking-wide',
        'rounded-full',
        {
          'bg-bg-surface text-text-secondary': variant === 'default',
          'bg-success/15 text-success': variant === 'success',
          'bg-warning/15 text-warning': variant === 'warning',
          'bg-danger/15 text-danger': variant === 'danger',
          'bg-info/15 text-info': variant === 'info',
          'bg-accent/15 text-accent': variant === 'accent',
          'bg-bg-hover text-text-tertiary': variant === 'neutral',
        },
        {
          'px-2 py-0.5 text-[10px] gap-1': size === 'xs',
          'px-2.5 py-1 text-xs gap-1.5': size === 'sm',
          'px-3 py-1.5 text-sm gap-2': size === 'md',
        },
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

interface ChangeBadgeProps {
  value: number;
  showIcon?: boolean;
  size?: Size;
  className?: string;
}

export function ChangeBadge({ value, showIcon = true, size = 'sm', className }: ChangeBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const variant: Variant = isNeutral ? 'default' : isPositive ? 'success' : 'danger';
  const iconSize = size === 'xs' ? 10 : size === 'sm' ? 12 : 14;

  return (
    <Badge
      variant={variant}
      size={size}
      icon={showIcon ? <Icon size={iconSize} /> : undefined}
      className={cn('tabular-nums font-mono', className)}
    >
      {formatChange(value)}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'paused' | 'draft';
  size?: Size;
  className?: string;
}

const statusConfig: Record<StatusBadgeProps['status'], { variant: Variant; label: string }> = {
  pending: { variant: 'warning', label: 'Pendente' },
  approved: { variant: 'success', label: 'Aprovado' },
  rejected: { variant: 'danger', label: 'Rejeitado' },
  active: { variant: 'success', label: 'Ativo' },
  paused: { variant: 'default', label: 'Pausado' },
  draft: { variant: 'default', label: 'Rascunho' },
};

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
