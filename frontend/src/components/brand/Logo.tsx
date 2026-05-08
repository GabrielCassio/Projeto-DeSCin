import { cn } from '../../utils/cn';

interface LogoProps {
  variant?: 'mark' | 'wordmark' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { mark: 28, text: 18 },
  md: { mark: 32, text: 22 },
  lg: { mark: 40, text: 28 },
};

function Mark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect width="40" height="40" rx="10" fill="rgb(var(--color-accent))" />
      <path
        d="M12 12h6c5.523 0 10 4.477 10 10s-4.477 10-10 10h-6V12z"
        fill="rgb(var(--color-bg))"
      />
      <rect x="17" y="12" width="4" height="20" rx="2" fill="rgb(var(--color-bg))" />
    </svg>
  );
}

export function Logo({ variant = 'full', size = 'md', className }: LogoProps) {
  const dimensions = sizes[size];

  if (variant === 'mark') {
    return (
      <div className={cn('flex items-center', className)}>
        <Mark size={dimensions.mark} />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center', className)}>
        <span
          className="font-semibold tracking-tight text-text-primary"
          style={{ fontSize: dimensions.text }}
        >
          descin
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Mark size={dimensions.mark} />
      <span
        className="font-semibold tracking-tight text-text-primary"
        style={{ fontSize: dimensions.text }}
      >
        descin
      </span>
    </div>
  );
}
