import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useWallet } from '../../hooks/useWallet';
import { cn } from '../../utils/cn';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidths = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  full: 'max-w-none',
};

export function AppLayout({ children, requireAuth = true, maxWidth = 'xl' }: AppLayoutProps) {
  useWallet();
  const { isAuthenticated } = useAuthStore();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={cn(maxWidths[maxWidth], 'mx-auto w-full px-4 lg:px-6 page-enter')}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          {subtitle && (
            <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--ember)' }}>
              {subtitle}
            </p>
          )}
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-base max-w-xl" style={{ color: 'var(--ink-secondary)' }}>{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, subtitle, action, children, className }: SectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 gap-4">
          <div>
            {title && (
              <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--ink-muted)' }}>
                {title}
              </h2>
            )}
            {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--ink-muted)' }}>{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
