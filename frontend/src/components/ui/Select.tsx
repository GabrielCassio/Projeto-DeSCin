import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  error,
  disabled = false,
  size = 'md',
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const sizes = {
    sm: 'h-8 text-xs px-3',
    md: 'h-10 text-sm px-3.5',
    lg: 'h-12 text-base px-4',
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'w-full bg-surface-primary rounded-lg',
          'border border-border-default',
          'flex items-center justify-between gap-2',
          'text-left transition-all duration-200',
          'focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary-subtle',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-secondary',
          error && 'border-danger focus:border-danger focus:ring-danger-subtle',
          !selectedOption && 'text-text-tertiary',
          sizes[size]
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'text-text-tertiary transition-transform duration-200 flex-shrink-0',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-50 w-full mt-1.5',
            'bg-surface-primary border border-border-subtle rounded-lg',
            'py-1 max-h-64 overflow-auto shadow-lg',
            'animate-in animate-in-fast'
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'w-full px-3 py-2',
                'flex items-center justify-between gap-2',
                'text-sm text-left',
                'transition-colors duration-150',
                'hover:bg-surface-secondary',
                option.value === value && 'bg-accent-primary-subtle'
              )}
            >
              <span className="flex items-center gap-2 flex-1 min-w-0">
                {option.icon}
                <span className="flex flex-col min-w-0">
                  <span className={cn(
                    'truncate',
                    option.value === value && 'text-accent-primary font-medium'
                  )}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-text-tertiary truncate">
                      {option.description}
                    </span>
                  )}
                </span>
              </span>
              {option.value === value && (
                <Check size={16} className="text-accent-primary flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
