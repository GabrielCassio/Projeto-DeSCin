import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../../stores/auth.store';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const baseLinks: NavItem[] = [
  { to: '/', label: 'Painel', end: true },
  { to: '/explorar', label: 'Explorar' },
  { to: '/wallet', label: 'Carteira' },
];

const roleLinks: Record<string, NavItem> = {
  curator: { to: '/curadoria', label: 'Curadoria' },
  founder: { to: '/founder', label: 'Projetos' },
};

export function HeaderNav() {
  const { user, hasRole } = useAuthStore();

  const links: NavItem[] = [...baseLinks];
  if (user) {
    if (hasRole('curator')) links.push(roleLinks.curator);
    if (hasRole('founder')) links.push(roleLinks.founder);
  }

  return (
    <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          style={{ position: 'relative' }}
        >
          {({ isActive }) => (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '10px 14px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--ink-primary)' : 'var(--ink-muted)',
                transition: 'color 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                position: 'relative',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--ink-secondary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)';
              }}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 14,
                    right: 14,
                    height: 1.5,
                    background: 'var(--red)',
                    borderRadius: 2,
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
