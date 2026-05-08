import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Asset } from '../../types';
import { getTickerColor } from '../../utils/color';
import { formatCurrency, formatNumber, formatChange } from '../../utils/format';
import { Sparkline } from '../charts/Sparkline';

interface AssetRowProps {
  asset: Asset;
  isLast?: boolean;
}

export function AssetRow({ asset, isLast = false }: AssetRowProps) {
  const navigate = useNavigate();
  const color = getTickerColor(asset.ticker);
  const code = asset.ticker.split(':')[1];
  const isPositive = asset.change24h >= 0;
  const pnlPositive = asset.pnl >= 0;

  return (
    <div
      onClick={() => navigate(`/projetos/${code}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderBottom: isLast ? 'none' : '1px solid rgba(20,20,20,0.06)',
        cursor: 'pointer',
        transition: 'background 180ms ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.35)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* Token badge */}
      <div style={{
        width: 42, height: 42, borderRadius: 13, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: color,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700, fontSize: 11,
        color: '#FFFFFF',
        letterSpacing: '0.04em',
        boxShadow: `0 4px 12px ${color}40`,
      }}>
        {code.slice(0, 2)}
      </div>

      {/* Name + tokens */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, fontWeight: 600,
            color: 'var(--ink-primary)', letterSpacing: '0.02em',
          }}>
            {code}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 500,
            color: 'var(--ink-muted)', letterSpacing: '0.08em',
          }}>
            {formatNumber(asset.tokensOwned)} tokens
          </span>
        </div>
        <p style={{
          fontFamily: "'Geist', 'Inter', sans-serif",
          fontSize: 13, color: 'var(--ink-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1,
        }}>
          {asset.projectName}
        </p>
      </div>

      {/* Sparkline */}
      <div style={{ width: 72, flexShrink: 0, display: 'none' }} className="sparkline-col">
        <Sparkline data={asset.priceHistory} positive={isPositive} />
      </div>

      {/* Value + PnL */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13, fontWeight: 600,
          color: 'var(--ink-primary)',
          fontVariantNumeric: 'tabular-nums',
          marginBottom: 3,
        }}>
          {formatCurrency(asset.currentValue)}
        </p>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          color: pnlPositive ? '#22c55e' : 'var(--red)',
        }}>
          {pnlPositive ? '+' : ''}{formatCurrency(asset.pnl)}
        </p>
      </div>

      {/* 24h change badge */}
      <div style={{
        flexShrink: 0,
        padding: '4px 10px', borderRadius: 7,
        background: isPositive ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)',
        border: `1px solid ${isPositive ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}`,
        minWidth: 60, textAlign: 'center',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 600,
          color: isPositive ? '#22c55e' : 'var(--red)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatChange(asset.change24h)}
        </span>
      </div>

      <ChevronRight size={15} style={{ color: 'var(--ink-muted)', flexShrink: 0, transition: 'transform 150ms ease' }} />

      <style>{`
        @media (min-width: 640px) { .sparkline-col { display: block !important; } }
      `}</style>
    </div>
  );
}
