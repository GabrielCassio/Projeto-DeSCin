import { useNavigate } from 'react-router-dom';
import type { FeaturedProject } from '../../mocks/dashboard';

type Tab = 'alta' | 'compradas' | 'vistas';

function heroMetric(project: FeaturedProject, tab: Tab): { value: string; label: string } {
  if (tab === 'compradas') return { value: project.buyCount.toLocaleString('pt-BR'),  label: 'compras 7d' };
  if (tab === 'vistas')    return { value: project.viewCount.toLocaleString('pt-BR'), label: 'visualizações' };
  const pos = project.change7d >= 0;
  return { value: `${pos ? '+' : ''}${project.change7d.toFixed(1)}%`, label: '7 dias' };
}

export function FeaturedProjectCard({ project, tab = 'alta' }: { project: FeaturedProject; tab?: Tab }) {
  const navigate = useNavigate();
  const metric = heroMetric(project, tab);

  return (
    <div
      onClick={() => navigate(`/projetos/${project.code}`)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.32)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(20,20,20,0.08)',
        borderRadius: 20,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.70), 0 14px 36px rgba(20,20,20,0.11)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)';
      }}
    >
      {/* Dark gradient header — fixed 144px */}
      <div style={{ background: project.gradient, height: 144, flexShrink: 0, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Code */}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.55)' }}>
          {project.code}
        </span>

        {/* Hero metric */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 3 }}>
            {metric.label}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: project.accentColor, lineHeight: 1 }}>
            {metric.value}
          </div>
        </div>
      </div>

      {/* Card body — flex:1 so all cards stretch to same height */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Name + description */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.01em', marginBottom: 5 }}>
            {project.name}
          </div>
          <div style={{ fontFamily: "'Geist', 'Inter', sans-serif", fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
            {project.description}
          </div>
        </div>

        {/* University + area tags */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', padding: '2px 8px', borderRadius: 5, background: 'rgba(20,20,20,0.06)' }}>
            {project.university}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', padding: '2px 8px', borderRadius: 5, background: 'rgba(20,20,20,0.06)' }}>
            {project.area}
          </span>
        </div>

        {/* Progress bar — push to bottom with flex spacer */}
        <div style={{ flex: 1 }} />
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Captação</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{project.soldPercent}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(20,20,20,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${project.soldPercent}%`,
              background: project.accentColor === 'var(--red)' ? 'var(--red)' : project.accentColor,
              borderRadius: 2,
            }} />
          </div>
        </div>

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 14, borderTop: '1px solid var(--rule)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Preço</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>
              R$ {project.price.toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Volume</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>
              {project.volume}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
