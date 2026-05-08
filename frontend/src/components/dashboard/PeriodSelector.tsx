interface PeriodSelectorProps {
  value: string;
  onChange: (p: string) => void;
  periods?: string[];
}

const DEFAULT_PERIODS = ['1D', '7D', '1M', '3M', '1A', 'Tudo'];

export function PeriodSelector({ value, onChange, periods = DEFAULT_PERIODS }: PeriodSelectorProps) {
  return (
    <div style={{
      display: 'flex', gap: 2,
      background: 'rgba(20,20,20,0.07)',
      borderRadius: 10, padding: 3,
    }}>
      {periods.map((p) => {
        const active = p === value;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              padding: '5px 10px', borderRadius: 7,
              border: 'none', cursor: 'pointer',
              transition: 'background 180ms ease, color 180ms ease, box-shadow 180ms ease',
              background: active ? 'rgba(255,255,255,0.85)' : 'transparent',
              color: active ? 'var(--ink-primary)' : 'var(--ink-muted)',
              boxShadow: active ? '0 1px 4px rgba(20,20,20,0.12)' : 'none',
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
