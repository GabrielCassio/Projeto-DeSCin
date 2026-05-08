import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-medium tracking-wide uppercase',
          'rounded-lg transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:opacity-40 disabled:pointer-events-none',
          'active:scale-[0.98]',
          fullWidth && 'w-full',
          {
            'bg-accent text-bg hover:bg-accent-hover': variant === 'primary',
            'bg-bg-surface text-text-primary border border-border hover:bg-bg-hover hover:border-border-strong': variant === 'secondary',
            'bg-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary': variant === 'ghost',
            'bg-danger text-white hover:brightness-110': variant === 'danger',
            'bg-transparent text-text-primary border border-border hover:bg-bg-surface hover:border-border-strong': variant === 'outline',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-sm': size === 'lg',
            'h-14 px-8 text-base': size === 'xl',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && <span className="flex-shrink-0 -ml-0.5">{icon}</span>}
            {children}
            {iconRight && <span className="flex-shrink-0 -mr-0.5">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
