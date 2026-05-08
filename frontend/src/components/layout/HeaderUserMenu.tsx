import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Folder } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

interface MenuItem {
  icon: typeof User;
  label: string;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}

export function HeaderUserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout, hasRole, activateFounderRole } = useAuthStore();

  const isFounder = hasRole('founder');

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  const menuItems: MenuItem[] = [
    { icon: User, label: 'Meu Perfil', onClick: () => { navigate('/configuracoes'); setOpen(false); } },
    { icon: Settings, label: 'Configurações', onClick: () => { navigate('/configuracoes'); setOpen(false); } },
    ...(!isFounder ? [{ icon: Folder, label: 'Tornar-se Founder', separator: true, onClick: () => { activateFounderRole(); setOpen(false); } }] : []),
    { icon: LogOut, label: 'Sair', separator: true, danger: true, onClick: handleLogout },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--glass-inner-bg)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontFamily: "'Geist', 'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--ink-primary)',
          flexShrink: 0,
          transition: 'border-color 200ms ease, background 200ms ease, transform 100ms ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--glass-border-strong)';
          el.style.background = 'var(--glass-inner-bg-hover)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--glass-border)';
          el.style.background = 'var(--glass-inner-bg)';
        }}
        onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)'; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        aria-label="Menu do usuário"
      >
        {initials}
      </button>

      {open && (
        <div
          className="dropdown-enter"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 240,
            background: 'var(--glass-bg-scrolled)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            border: '1px solid var(--glass-border)',
            borderRadius: 16,
            boxShadow: `
              inset 0 1px 0 var(--glass-highlight),
              0 1px 3px rgba(20, 20, 20, 0.08),
              0 8px 24px rgba(20, 20, 20, 0.10),
              0 24px 48px rgba(20, 20, 20, 0.06)
            `,
            padding: 8,
            zIndex: 60,
            overflow: 'hidden',
          }}
        >
          {user && (
            <>
              <div
                style={{
                  padding: '12px 12px 14px',
                  borderBottom: '1px solid var(--glass-border)',
                  marginBottom: 4,
                }}
              >
                <p style={{ color: 'var(--ink-primary)', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                  {user.name}
                </p>
                <p style={{ color: 'var(--ink-muted)', fontSize: 12 }}>{user.email}</p>
              </div>
            </>
          )}

          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i}>
                {item.separator && (
                  <div style={{ height: 1, background: 'var(--glass-border)', margin: '4px 0' }} />
                )}
                <button
                  onClick={item.onClick}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: item.danger ? 'var(--red)' : 'var(--ink-secondary)',
                    fontSize: 14,
                    fontFamily: "'Geist', 'Inter', sans-serif",
                    fontWeight: 500,
                    textAlign: 'left',
                    transition: 'background 150ms ease, color 150ms ease, transform 100ms ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--glass-inner-bg-hover)';
                    if (!item.danger) el.style.color = 'var(--ink-primary)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'transparent';
                    el.style.color = item.danger ? 'var(--red)' : 'var(--ink-secondary)';
                  }}
                  onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
                  onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
