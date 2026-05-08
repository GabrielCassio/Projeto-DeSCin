import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Wallet, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/explorar', icon: Compass, label: 'Explorar' },
  { to: '/wallet', icon: Wallet, label: 'Carteira' },
  { to: '/configuracoes', icon: Settings, label: 'Config' },
];

export function BottomNav() {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 h-16',
        'glass border-t border-border',
        'flex lg:hidden z-50',
        'safe-bottom'
      )}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center gap-1',
              'text-xs font-medium transition-all duration-150',
              isActive
                ? 'text-accent'
                : 'text-text-muted active:text-text-secondary'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'w-10 h-8 flex items-center justify-center rounded-full transition-colors',
                  isActive && 'bg-accent/15'
                )}
              >
                <Icon size={20} />
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
