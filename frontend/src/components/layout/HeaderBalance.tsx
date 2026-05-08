import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../stores/wallet.store';
import { formatCurrency } from '../../utils/format';

export function HeaderBalance() {
  const navigate = useNavigate();
  const { availableBalance } = useWalletStore();

  return (
    <button
      onClick={() => navigate('/wallet')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        height: 40,
        background: 'var(--glass-inner-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 12,
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 200ms ease, border-color 200ms ease, transform 100ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'var(--glass-inner-bg-hover)';
        el.style.borderColor = 'var(--glass-border-strong)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'var(--glass-inner-bg)';
        el.style.borderColor = 'var(--glass-border)';
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
      className="hidden sm:flex"
    >
      <span
        className="live-dot"
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'var(--red)',
          flexShrink: 0,
          boxShadow: '0 0 5px var(--red-glow)',
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        Saldo
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ink-primary)',
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatCurrency(availableBalance)}
      </span>
    </button>
  );
}
