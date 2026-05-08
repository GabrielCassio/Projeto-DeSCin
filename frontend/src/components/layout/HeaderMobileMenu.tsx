import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

interface Props {
  onClose: () => void;
}

const links = [
  { to: '/', label: 'Painel', end: true },
  { to: '/explorar', label: 'Explorar' },
  { to: '/wallet', label: 'Carteira' },
  { to: '/configuracoes', label: 'Config.' },
];

export function HeaderMobileMenu({ onClose }: Props) {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();

  const visibleLinks = [
    ...links,
    ...(hasRole('curator') ? [{ to: '/curadoria', label: 'Curadoria', end: false }] : []),
    ...(hasRole('founder') ? [{ to: '/founder', label: 'Projetos', end: false }] : []),
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(200, 200, 204, 0.70)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animation: 'fadeIn 300ms ease both',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'var(--glass-bg-scrolled)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          borderBottom: '1px solid var(--glass-border)',
          boxShadow: '0 8px 32px rgba(20, 20, 20, 0.12)',
          padding: '88px 32px 40px',
          animation: 'drawerDown 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
            >
              {({ isActive }) => (
                <span
                  style={{
                    display: 'block',
                    padding: '14px 4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    fontSize: 24,
                    letterSpacing: '-0.01em',
                    color: isActive ? 'var(--ink-primary)' : 'var(--ink-muted)',
                    borderBottom: '1px solid var(--glass-border)',
                    transition: 'color 150ms ease',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 5,
                        height: 5,
                        borderRadius: 0,
                        background: 'var(--red)',
                        marginLeft: 10,
                        verticalAlign: 'middle',
                        boxShadow: '0 0 6px var(--red-glow)',
                      }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ color: 'var(--ink-primary)', fontWeight: 600, fontSize: 15 }}>{user.name}</p>
              <p style={{ color: 'var(--ink-muted)', fontSize: 13 }}>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'rgba(229, 37, 26, 0.10)',
                border: '1px solid rgba(229, 37, 26, 0.20)',
                borderRadius: 10,
                color: 'var(--red)',
                cursor: 'pointer',
                fontFamily: "'Geist', 'Inter', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                transition: 'background 150ms ease, transform 100ms ease',
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)'; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes drawerDown {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
