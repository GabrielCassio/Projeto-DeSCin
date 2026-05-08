import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Plus, Compass } from 'lucide-react';

function useCount(target: number, delay = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!target) return;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - t0) / 900, 0), 1);
      setVal(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, delay]);
  return val;
}

function fmt(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

interface StatRowProps { label: string; value: string; accent?: 'success' | 'danger'; }
function StatRow({ label, value, accent }: StatRowProps) {
  const color = accent === 'success' ? '#22c55e' : accent === 'danger' ? 'var(--red)' : 'var(--ink-primary)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        {label}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color, letterSpacing: '-0.01em' }}>
        {value}
      </span>
    </div>
  );
}

export function PortfolioOverview() {
  const navigate = useNavigate();
  const total    = useCount(12847.32, 0);
  const avail    = useCount(3420.00,  80);
  const invested = useCount(9427.32,  160);
  const pnl      = useCount(1247.15,  240);

  const [intPart, decPart] = fmt(total).split(',');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Big number */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Patrimônio total
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            BRL
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', color: 'var(--ink-primary)' }}>{intPart},</span>
          <span style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', color: 'var(--ink-muted)' }}>{decPart ?? '00'}</span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.18)' }}>
            <ArrowUpRight size={12} style={{ color: '#22c55e' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: '#22c55e', fontVariantNumeric: 'tabular-nums' }}>+1.83%</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-secondary)', fontVariantNumeric: 'tabular-nums' }}>
            +R$ 231,40 hoje
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
        <StatRow label="Saldo disponível" value={fmt(avail)} />
        <StatRow label="Total investido"  value={fmt(invested)} />
        <StatRow label="P&L total"        value={`+${fmt(pnl)}`} accent="success" />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: '+ Depositar', primary: true, icon: <Plus size={13} />, path: '/depositar' },
          { label: 'Explorar',    primary: false, icon: <Compass size={13} />, path: '/explorar' },
        ].map(({ label, primary, icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, height: 42, padding: '0 18px',
              borderRadius: 11, border: primary ? 'none' : '1.5px solid var(--rule)',
              background: primary ? 'var(--ink-primary)' : 'transparent',
              color: primary ? 'var(--bg-form)' : 'var(--ink-primary)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'transform 120ms ease, box-shadow 200ms ease',
              boxShadow: primary ? '0 4px 14px rgba(10,10,10,0.16)' : 'none',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
          >
            {icon}{label}
          </button>
        ))}
      </div>
    </div>
  );
}
