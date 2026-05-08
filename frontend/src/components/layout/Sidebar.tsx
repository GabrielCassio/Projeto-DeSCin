import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Wallet,
  Settings,
  LogOut,
  Plus,
  Shield,
  Folder,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Logo } from '../brand/Logo';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  end?: boolean;
}

const mainNavItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/explorar', icon: Compass, label: 'Marketplace' },
  { to: '/wallet', icon: Wallet, label: 'Carteira' },
];

const founderNavItems: NavItem[] = [
  { to: '/founder', icon: Folder, label: 'Meus Projetos', end: true },
  { to: '/founder/projetos/novo', icon: Plus, label: 'Novo Projeto' },
];

const curatorNavItems: NavItem[] = [
  { to: '/curadoria', icon: Shield, label: 'Curadoria' },
];

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg',
          'text-sm transition-all duration-150',
          'group',
          isActive
            ? 'bg-bg-surface text-text-primary'
            : 'text-text-tertiary hover:text-text-primary hover:bg-bg-surface/50',
          collapsed && 'justify-center px-2.5'
        )
      }
    >
      <Icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="font-medium">{item.label}</span>}
    </NavLink>
  );
}

function NavSection({
  title,
  items,
  collapsed
}: {
  title?: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  return (
    <div className="space-y-1">
      {title && !collapsed && (
        <p className="px-3 py-2 text-[10px] font-semibold text-text-muted uppercase tracking-widest">
          {title}
        </p>
      )}
      {items.map((item) => (
        <NavItemComponent key={item.to} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isFounder = hasRole('founder');
  const isCurator = hasRole('curator');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const sidebarContent = (
    <>
      <div className={cn(
        'flex items-center h-16 px-4',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <Logo variant={sidebarCollapsed ? 'mark' : 'full'} size="sm" />
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors hidden lg:flex"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <div className="h-px bg-border-subtle mx-4" />

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto scrollbar-hide">
        <NavSection items={mainNavItems} collapsed={sidebarCollapsed} />

        {isFounder && (
          <NavSection title="Founder" items={founderNavItems} collapsed={sidebarCollapsed} />
        )}

        {isCurator && (
          <NavSection title="Curadoria" items={curatorNavItems} collapsed={sidebarCollapsed} />
        )}
      </nav>

      <div className="p-3 border-t border-border-subtle">
        <NavItemComponent
          item={{ to: '/configuracoes', icon: Settings, label: 'Configurações' }}
          collapsed={sidebarCollapsed}
        />

        <div className={cn(
          'mt-3 flex items-center gap-3 px-3 py-2.5',
          sidebarCollapsed && 'justify-center px-0'
        )}>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-bg flex-shrink-0">
            {initials}
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors hidden lg:flex"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-bg-elevated border border-border lg:hidden"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="fixed left-0 top-0 h-full w-64 bg-bg-elevated border-r border-border flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-text-muted hover:text-text-primary"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen',
          'bg-bg-elevated border-r border-border-subtle',
          'hidden lg:flex flex-col',
          'transition-all duration-200',
          'z-40'
        )}
        style={{ width: sidebarCollapsed ? 72 : 240 }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
