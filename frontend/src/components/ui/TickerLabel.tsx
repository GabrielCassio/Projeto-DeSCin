import { cn } from '../../utils/cn';

interface TickerLabelProps {
  ticker: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-0.5',
  lg: 'text-base px-2.5 py-1',
};

export function TickerLabel({ ticker, size = 'md', className }: TickerLabelProps) {
  return (
    <span
      className={cn(
        'font-mono font-medium',
        'text-accent bg-accent/15',
        'rounded-md',
        sizeClasses[size],
        className
      )}
    >
      {ticker}
    </span>
  );
}
