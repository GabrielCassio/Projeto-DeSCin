import { useState, useEffect, useRef } from 'react';
import { getInitialTransactions, generateTransaction, type LiveTransaction } from '../../mocks/dashboard';

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
  overflow: 'hidden',
};

function TxRow({ tx, isNew }: { tx: LiveTransaction; isNew: boolean }) {
  const buy = tx.type === 'BUY';
  return (
    <div
      className={isNew ? 'animate-slide-down' : ''}
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 48px 68px 1fr auto auto',
        gap: 12,
        alignItems: 'center',
        padding: '10px 24px',
        borderBottom: '1px solid rgba(20,20,20,0.05)',
        transition: 'background 150ms ease',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.40)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* Time */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
        {tx.time.slice(0, 5)}
      </span>

      {/* Type badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '2px 8px', borderRadius: 5,
        background: buy ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)',
        border: `1px solid ${buy ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}`,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: buy ? '#22c55e' : 'var(--red)' }}>
          {tx.type}
        </span>
      </div>

      {/* Code */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.04em' }}>
        {tx.code}
      </span>

      {/* Tokens */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-secondary)', fontVariantNumeric: 'tabular-nums' }}>
        {tx.tokens} <span style={{ color: 'var(--ink-muted)', fontSize: 10 }}>tok</span>
      </span>

      {/* Value */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
        R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>

      {/* Wallet */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.04em', textAlign: 'right' }}>
        {tx.wallet}
      </span>
    </div>
  );
}

export function LiveFeed() {
  const [items, setItems] = useState<LiveTransaction[]>(getInitialTransactions);
  const [newestId, setNewestId] = useState<string | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      counter.current += 1;
      const tx = generateTransaction(counter.current);
      setNewestId(tx.id);
      setItems(prev => [tx, ...prev.slice(0, 7)]);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={GLASS}>
      {/* Header */}
      <div style={{ padding: '24px 24px 0', borderBottom: '1px solid var(--rule)', paddingBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)' }}>
          Atividade ao vivo
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red-glow)' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
            Ao vivo
          </span>
        </div>
      </div>

      {/* Column labels */}
      <div style={{ display: 'grid', gridTemplateColumns: '56px 48px 68px 1fr auto auto', gap: 12, padding: '8px 24px', borderBottom: '1px solid rgba(20,20,20,0.04)' }}>
        {['Hora', 'Tipo', 'Ativo', 'Qtd', 'Valor', 'Carteira'].map(col => (
          <span key={col} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: col === 'Valor' || col === 'Carteira' ? 'right' : 'left' }}>
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {items.map((tx) => (
        <TxRow key={tx.id} tx={tx} isNew={tx.id === newestId} />
      ))}
    </div>
  );
}
