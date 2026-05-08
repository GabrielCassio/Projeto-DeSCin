import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollState } from '../../hooks/useScrollState';
import { useAuthStore } from '../../stores/auth.store';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderBalance } from './HeaderBalance';
import { HeaderUserMenu } from './HeaderUserMenu';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export function Header() {
  const { scrolled } = useScrollState();
  const { isAuthenticated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <>
      <header
        className="header-float"
        style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 1180,
          height: 60,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px 0 24px',
          gap: 16,
          background: scrolled ? 'var(--glass-bg-scrolled)' : 'var(--glass-bg)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${scrolled ? 'var(--glass-border-strong)' : 'var(--glass-border)'}`,
          borderRadius: 20,
          boxShadow: scrolled
            ? `
              inset 0 1px 0 var(--glass-highlight),
              0 1px 3px rgba(20, 20, 20, 0.08),
              0 8px 24px rgba(20, 20, 20, 0.10),
              0 24px 64px rgba(20, 20, 20, 0.06)
            `
            : `
              inset 0 1px 0 var(--glass-highlight),
              0 1px 2px rgba(20, 20, 20, 0.06),
              0 8px 24px rgba(20, 20, 20, 0.06),
              0 24px 64px rgba(20, 20, 20, 0.04)
            `,
          transition: `
            background 400ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 400ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1)
          `,
        }}
      >
        <HeaderLogo />

        <HeaderNav />

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeaderBalance />

          <HeaderUserMenu />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex md:hidden"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--glass-inner-bg)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--ink-secondary)',
              transition: 'background 200ms ease, color 200ms ease, transform 100ms ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--glass-inner-bg-hover)';
              el.style.color = 'var(--ink-primary)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--glass-inner-bg)';
              el.style.color = 'var(--ink-secondary)';
            }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)'; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {mobileOpen && <HeaderMobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}
