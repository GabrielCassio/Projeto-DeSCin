import { useAuthStore } from '../../stores/auth.store';
import { getFormattedDateTime, getGreeting } from '../../utils/briefing';

export function MarketBriefing() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(' ')[0] ?? 'Investidor';

  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
      {/* Date */}
      <span style={{
        display: 'block', marginBottom: 20,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, fontWeight: 500,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--ink-muted)',
      }}>
        {getFormattedDateTime()}
      </span>

      {/* Editorial headline */}
      <h1 style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600, textTransform: 'uppercase',
        lineHeight: 0.95, letterSpacing: '-0.025em',
      }}>
        <span style={{ display: 'block', fontSize: 'clamp(38px, 5.2vw, 76px)', color: 'var(--ink-primary)' }}>
          {getGreeting()},
        </span>
        <span style={{ display: 'block', fontSize: 'clamp(38px, 5.2vw, 76px)', color: 'var(--red)' }}>
          {firstName}.
        </span>
      </h1>
    </div>
  );
}
