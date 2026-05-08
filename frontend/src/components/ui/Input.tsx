import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconRight,
      inputSize = 'md',
      type,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg',
              'bg-bg-surface text-text-primary',
              'border border-border',
              'placeholder:text-text-muted',
              'transition-all duration-150',
              'hover:border-border-strong',
              'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              icon && 'pl-11',
              (iconRight || isPassword) && 'pr-11',
              {
                'h-9 px-3 text-sm': inputSize === 'sm',
                'h-11 px-4 text-sm': inputSize === 'md',
                'h-12 px-4 text-base': inputSize === 'lg',
              },
              className
            )}
            {...props}
          />
          {(iconRight || isPassword) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              ) : (
                <span className="text-text-muted">{iconRight}</span>
              )}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-danger' : 'text-text-muted')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium tracking-wider uppercase text-text-tertiary mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg min-h-[120px] resize-y',
            'bg-bg-surface text-text-primary',
            'border border-border',
            'placeholder:text-text-muted',
            'transition-all duration-150',
            'hover:border-border-strong',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'px-4 py-3 text-sm',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-danger' : 'text-text-muted')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
