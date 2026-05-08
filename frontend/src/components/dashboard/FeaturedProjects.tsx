import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FEATURED } from '../../mocks/dashboard';
import { FeaturedProjectCard } from './FeaturedProjectCard';

type Tab = 'alta' | 'compradas' | 'vistas';

const TABS: { id: Tab; label: string }[] = [
  { id: 'alta',      label: 'Em alta'       },
  { id: 'compradas', label: 'Mais compradas' },
  { id: 'vistas',    label: 'Mais vistas'   },
];

function sortProjects(tab: Tab) {
  const copy = [...MOCK_FEATURED];
  if (tab === 'alta')      return copy.sort((a, b) => b.change7d  - a.change7d).slice(0, 3);
  if (tab === 'compradas') return copy.sort((a, b) => b.buyCount  - a.buyCount).slice(0, 3);
  return                          copy.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
}

export function FeaturedProjects() {
  const [tab, setTab] = useState<Tab>('alta');
  const projects = sortProjects(tab);

  return (
    <div>
      {/* Section header + tabs */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--rule)', paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginRight: 24, paddingBottom: 14 }}>
            Projetos
          </h3>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
                color: tab === id ? 'var(--ink-primary)' : 'var(--ink-muted)',
                borderBottom: tab === id ? '1.5px solid var(--red)' : '1.5px solid transparent',
                marginBottom: -1,
                transition: 'color 150ms ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          to="/explorar"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease', paddingBottom: 14 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
        >
          Ver todos →
        </Link>
      </div>

      {/* 3-column card grid */}
      <div className="dash-grid-3" style={{ alignItems: 'stretch' }}>
        {projects.map(project => (
          <FeaturedProjectCard key={project.ticker} project={project} tab={tab} />
        ))}
      </div>
    </div>
  );
}
