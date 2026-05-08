import { useState } from 'react';
import { MOCK_TOP_ALTA, MOCK_TOP_BAIXA, MOCK_TOP_VOL, type TopMover } from '../../mocks/dashboard';

type Tab = 'alta' | 'baixa' | 'volume';

const TABS: { id: Tab; label: string }[] = [
  { id: 'alta',   label: 'Em alta'  },
  { id: 'baixa',  label: 'Em baixa' },
  { id: 'volume', label: 'Volume'   },
];

const DATA: Record<Tab, TopMover[]> = {
  alta: MOCK_TOP_ALTA,
  baixa: MOCK_TOP_BAIXA,
  volume: MOCK_TOP_VOL,
};

export function TopMovers() {
  const [tab, setTab] = useState<Tab>('alta');
  const items = DATA[tab];

  return (
    <div style={{ background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(20,20,20,0.08)', borderRadius: 20, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)', overflow: 'hidden' }}>
      {/* Header + Tabs */}
      <div style={{ padding: '24px 24px 0' }}>
        <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 16 }}>
          Top movers
        </h3>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--rule)' }}>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
                color: tab === id ? 'var(--ink-primary)' : 'var(--ink-muted)',
                borderBottom: tab === id ? '1.5px solid var(--red)' : '1.5px solid transparent',
                marginBottom: -1, transition: 'color 150ms ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '4px 24px 20px' }}>
        {items.map((m, i) => {
          const pos = m.change >= 0;
          return (
            <div key={m.code + i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid var(--rule)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', fontVariantNumeric: 'tabular-nums', width: 16, flexShrink: 0 }}>
                  {String(m.rank).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.02em' }}>{m.code}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 2 }}>{m.university} · {m.area}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: pos ? '#22c55e' : 'var(--red)' }}>
                  {pos ? '+' : ''}{tab === 'volume' ? m.volume : `${m.change.toFixed(1)}%`}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-secondary)', marginTop: 2 }}>R$ {m.price.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
