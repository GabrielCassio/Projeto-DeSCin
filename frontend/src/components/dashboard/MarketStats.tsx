import { useProjectStore } from '../../stores/project.store';
import { DSC_INDEX_DATA } from '../../mocks/dashboard';

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
  overflow: 'hidden',
};

function fmtVol(v: number): string {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `R$ ${Math.round(v / 1_000)}K`;
  return `R$ ${Math.round(v)}`;
}

function Sparkline() {
  const pts = DSC_INDEX_DATA;
  const W = 120, H = 44;
  const vals = pts.map(p => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const coords = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * W;
    const y = H - ((p.value - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const last = vals[vals.length - 1];
  const first = vals[0];
  const change = (((last - first) / first) * 100).toFixed(1);
  const pos = last >= first;

  return (
    <div style={{ paddingTop: 20, borderTop: '1px solid var(--rule)', marginTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>
            DSC Index
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
            {last.toFixed(0)}
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: pos ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)', border: `1px solid ${pos ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}` }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: pos ? '#22c55e' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
            {pos ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height: H }}>
        <polyline points={coords} fill="none" stroke="var(--red)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function MarketStats() {
  const projects = useProjectStore(s => s.projects);
  const approved = projects.filter(p => p.status === 'approved');
  const totalVol = approved.reduce((sum, p) => sum + (p.volume24h || 0), 0);
  const activeCount = approved.length;

  const stats = [
    { label: 'Volume 24h',       value: fmtVol(totalVol),         sub: 'soma de todos os projetos' },
    { label: 'Projetos ativos',  value: String(activeCount),       sub: '8 universidades'           },
    { label: 'Carteiras únicas', value: '4.832',                   sub: '+38 hoje'                  },
    { label: 'DSC Index',        value: DSC_INDEX_DATA[DSC_INDEX_DATA.length - 1].value.toFixed(0), sub: 'índice geral do mercado' },
  ];

  return (
    <div style={{ ...GLASS, padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 20 }}>
        Mercado · 24h
      </h3>

      {/* 2×2 stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {stats.map(({ label, value, sub }) => (
          <div key={label}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              {value}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', marginTop: 3 }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      <Sparkline />
    </div>
  );
}
