import { useState, useMemo, type ReactElement } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AppLayout } from '../components/layout/AppLayout';
import { useProject } from '../hooks/useProject';
import { useProjects } from '../hooks/useProjects';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { useWalletStore } from '../stores/wallet.store';
import { transactionsService } from '../services/transactions';
import { toast } from '../components/ui/Toast';
import { getProjectGradient } from '../utils/color';
import { formatCurrency, formatNumber, formatDateTime } from '../utils/format';
import type { Period, Project } from '../types';

// ─── Glass style ─────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'sobre' | 'tokenomics' | 'equipe' | 'atividade';
type InputMode = 'tokens' | 'valor';
const PERIODS: Period[] = ['1D', '7D', '1M', '3M', '1A', 'Tudo'];

// ─── Price chart ──────────────────────────────────────────────────────────────
function ProjectChart({ data, positive }: { data: { date: string; price: number }[]; positive: boolean }) {
  const color = positive ? '#22c55e' : 'var(--red)';
  const gradId = positive ? 'projGradGreen' : 'projGradRed';
  if (!data.length) return <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-muted)' }}>Sem dados para o período</span></div>;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={positive ? 0.18 : 0.14} />
            <stop offset="70%"  stopColor={color} stopOpacity={0.03} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(20,20,20,0.04)" strokeWidth={1} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#7A7A82', fontFamily: "'JetBrains Mono', monospace" }}
          tickLine={false} axisLine={false} interval="preserveStartEnd"
          tickFormatter={v => { const d = new Date(v); return `${d.getDate()}/${d.getMonth()+1}`; }}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const val = formatCurrency(payload[0].value as number);
            const d = label ? new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '';
            return (
              <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(20,20,20,0.10)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 24px rgba(20,20,20,0.10)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A7A82', marginBottom: 3 }}>{d}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>{val}</p>
              </div>
            );
          }}
          cursor={{ stroke: 'rgba(20,20,20,0.12)', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} fill={`url(#${gradId})`} dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#FAFAF7' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Summary row in buy panel ─────────────────────────────────────────────────
function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: bold ? 14 : 12, fontWeight: bold ? 600 : 500, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

// ─── Related project card ─────────────────────────────────────────────────────
function RelatedCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const code = project.ticker.split(':')[1];
  const gradient = getProjectGradient(project.ticker);
  const pos = project.change24h >= 0;
  const soldPct = Math.round(((project.totalSupply - project.availableTokens) / project.totalSupply) * 100);

  return (
    <div onClick={() => navigate(`/projetos/${code}`)} style={{ ...GLASS, overflow: 'hidden', cursor: 'pointer', transition: 'transform 220ms ease, box-shadow 220ms ease' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.70), 0 12px 28px rgba(20,20,20,0.10)'; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)'; }}
    >
      <div style={{ background: gradient, height: 80, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 16px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.60)' }}>{code}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: pos ? '#22c55e' : '#ff6b6b' }}>
          {pos ? '+' : ''}{project.change24h.toFixed(1)}%
        </span>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 4 }}>{project.name}</div>
        <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-secondary)', marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{project.description}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>R$ {project.currentPrice.toFixed(2)}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>{soldPct}% captado</span>
        </div>
        <div style={{ marginTop: 8, height: 3, background: 'rgba(20,20,20,0.08)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${soldPct}%`, background: 'var(--ink-primary)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Buy confirmation modal ────────────────────────────────────────────────────
function BuyModal({ open, onClose, onConfirm, loading, project, qty, total }: {
  open: boolean; onClose: () => void; onConfirm: () => void; loading: boolean;
  project: Project; qty: number; total: number;
}) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.60)', backdropFilter: 'blur(6px)' }} />
      <div
        style={{ position: 'relative', width: '100%', maxWidth: 420, background: 'rgba(250,250,247,0.96)', backdropFilter: 'blur(24px)', border: '1px solid rgba(20,20,20,0.10)', borderRadius: 20, boxShadow: '0 24px 64px rgba(10,10,10,0.20)', animation: 'scaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '24px 28px 0' }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 4 }}>Confirmar compra</h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{project.ticker}</p>
        </div>

        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--rule)', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SummaryRow label="Projeto"      value={project.name.slice(0, 30) + (project.name.length > 30 ? '…' : '')} />
          <SummaryRow label="Quantidade"   value={`${formatNumber(qty)} tokens`} />
          <SummaryRow label="Preço unit."  value={formatCurrency(project.currentPrice)} />
          <SummaryRow label="Taxa de rede" value="R$ 0,12" />
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 10, marginTop: 4 }}>
            <SummaryRow label="Total" value={formatCurrency(total + 0.12)} bold />
          </div>
        </div>

        <div style={{ padding: '0 28px 28px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} disabled={loading} style={{ flex: 1, height: 44, borderRadius: 11, border: '1.5px solid var(--rule)', background: 'transparent', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-secondary)', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 2, height: 44, borderRadius: 11, border: 'none', background: 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--bg-form)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processando…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Projeto() {
  const { ticker: code } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const fullTicker = code ? `PROJ:${code}` : undefined;

  const { project, loading }                      = useProject(fullTicker);
  const { projects }                              = useProjects();
  const [period, setPeriod]                       = useState<Period>('1M');
  const { data: rawHistory, loading: chartLoading } = usePriceHistory(fullTicker, period);
  const [tab, setTab]                             = useState<Tab>('sobre');
  const [inputMode, setInputMode]                 = useState<InputMode>('tokens');
  const [inputValue, setInputValue]               = useState('');
  const [modalOpen, setModalOpen]                 = useState(false);
  const [buying, setBuying]                       = useState(false);

  const { availableBalance, optimisticBuy } = useWalletStore();

  // Chart data formatted for Recharts
  const chartData = useMemo(() =>
    rawHistory.map(p => ({ date: p.timestamp, price: p.price })),
  [rawHistory]);

  // Buy calculation
  const inputNum = parseFloat(inputValue) || 0;
  const qty   = inputMode === 'tokens' ? Math.floor(inputNum) : Math.floor(inputNum / (project?.currentPrice ?? 1));
  const total = project ? qty * project.currentPrice : 0;
  const canBuy = qty > 0 && total <= availableBalance;

  // Quick amount helpers (% of available balance)
  const setQuickPct = (pct: number) => {
    if (!project) return;
    const brl = availableBalance * pct;
    if (inputMode === 'tokens') {
      setInputValue(String(Math.floor(brl / project.currentPrice)));
    } else {
      setInputValue(brl.toFixed(2));
    }
  };

  const handleBuy = async () => {
    if (!project || !canBuy) return;
    setBuying(true);
    try {
      await transactionsService.buy({ ticker: project.ticker, amount: qty });
      optimisticBuy(project.ticker, project.name, qty, total, project.currentPrice);
      setModalOpen(false);
      toast('success', `${formatNumber(qty)} tokens adicionados à sua carteira.`, 'Compra realizada!');
      navigate('/wallet');
    } catch {
      toast('error', 'Não foi possível processar a compra.', 'Erro');
    } finally {
      setBuying(false);
    }
  };

  // Related projects (same area, excl. current, approved, max 3)
  const related = useMemo(() =>
    projects.filter(p => p.status === 'approved' && p.ticker !== fullTicker && p.area === project?.area).slice(0, 3),
  [projects, fullTicker, project]);

  // Stats derived from price history
  const priceMin  = chartData.length ? Math.min(...chartData.map(d => d.price)) : 0;
  const priceMax  = chartData.length ? Math.max(...chartData.map(d => d.price)) : 0;
  const soldPct   = project ? Math.round(((project.totalSupply - project.availableTokens) / project.totalSupply) * 100) : 0;
  const positive  = (project?.change24h ?? 0) >= 0;

  // Synthetic activity transactions for this project
  const activityTxs = useMemo(() => {
    if (!project) return [];
    const types = ['BUY', 'SELL', 'BUY', 'BUY', 'SELL', 'BUY', 'SELL', 'BUY', 'BUY', 'SELL'] as const;
    return Array.from({ length: 20 }, (_, i) => {
      const isBuy = types[i % types.length] === 'BUY';
      const tokens = Math.round(10 + (i * 13 + 7) % 90);
      const price = +(project.currentPrice * (0.96 + (i * 0.007))).toFixed(2);
      const ts = new Date(Date.now() - i * 3_600_000 * (1 + i % 3)).toISOString();
      return { hash: `0x${(i + 1).toString(16).padStart(6,'0')}...${(i * 17 + 3).toString(16).padStart(4,'0')}`, type: isBuy ? 'BUY' : 'SELL', tokens, value: +(tokens * price).toFixed(2), ts };
    });
  }, [project]);

  // Not found state
  if (!loading && !project) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '96px 24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
            Projeto não encontrado
          </div>
          <Link to="/explorar" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--red)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
            ← Voltar ao mercado
          </Link>
        </div>
      </AppLayout>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'sobre',       label: 'Sobre'       },
    { id: 'tokenomics',  label: 'Tokenomics'  },
    { id: 'equipe',      label: 'Equipe'      },
    { id: 'atividade',   label: 'Atividade'   },
  ];

  return (
    <AppLayout>
      {/* ── Breadcrumb ── */}
      <div className="page-s1" style={{ marginBottom: 24 }}>
        <Link to="/explorar" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
        >
          ← Voltar ao mercado
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="page-s2" style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
        {loading ? (
          <div style={{ height: 120, borderRadius: 12, background: 'linear-gradient(90deg, rgba(20,20,20,0.06) 0%, rgba(20,20,20,0.10) 50%, rgba(20,20,20,0.06) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
        ) : project && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              {[project.ticker, project.university, project.area].map((item, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                  {i > 0 && <span style={{ marginRight: 10, color: 'rgba(20,20,20,0.20)' }}>·</span>}
                  {item}
                </span>
              ))}
            </div>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em', fontSize: 'clamp(28px, 4vw, 56px)', color: 'var(--ink-primary)', marginBottom: 20 }}>
              {project.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 'clamp(28px, 3vw, 44px)', color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {formatCurrency(project.currentPrice)}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: '5px 12px', borderRadius: 7, background: positive ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)', border: `1px solid ${positive ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: positive ? '#22c55e' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
                    {positive ? '+' : ''}{project.change24h.toFixed(2)}%
                  </span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>24h</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Main grid: chart (8) + buy panel (4) ── */}
      <section className="page-s3" style={{ marginBottom: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 24, alignItems: 'start' }}>
          {/* Left: Chart */}
          <div style={{ ...GLASS, padding: '28px 24px 20px' }}>
            {/* Period selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Histórico de preço</span>
              <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'rgba(20,20,20,0.06)' }}>
                {PERIODS.map(p => (
                  <button key={p} onClick={() => setPeriod(p)} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', background: period === p ? 'rgba(255,255,255,0.85)' : 'transparent', color: period === p ? 'var(--ink-primary)' : 'var(--ink-muted)', boxShadow: period === p ? '0 1px 4px rgba(20,20,20,0.10)' : 'none', transition: 'all 180ms ease' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {chartLoading ? (
              <div style={{ height: 320, borderRadius: 12, background: 'linear-gradient(90deg, rgba(20,20,20,0.06) 0%, rgba(20,20,20,0.10) 50%, rgba(20,20,20,0.06) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
            ) : (
              <ProjectChart data={chartData} positive={positive} />
            )}

            {/* Stats bar */}
            {project && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
                {[
                  { label: 'Mín ' + period, value: formatCurrency(priceMin) },
                  { label: 'Máx ' + period, value: formatCurrency(priceMax) },
                  { label: 'Volume 24h',     value: `R$ ${(project.volume / 1000).toFixed(0)}K` },
                  { label: 'Cap. de mkt.',   value: `R$ ${((project.totalSupply - project.availableTokens) * project.currentPrice / 1000).toFixed(0)}K` },
                ].map((s, i, arr) => (
                  <div key={s.label} style={{ textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid var(--rule)' : 'none', padding: '0 8px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Buy panel (sticky) */}
          <div style={{ position: 'sticky', top: 110 }}>
            <div style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(20,20,20,0.10)', borderRadius: 20, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.80), 0 8px 32px rgba(20,20,20,0.08)', padding: 24 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Comprar tokens</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.5)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#22c55e' }}>Aberto</span>
                </div>
              </div>

              {/* Mode toggle */}
              <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'rgba(20,20,20,0.05)', marginBottom: 16 }}>
                {(['tokens', 'valor'] as InputMode[]).map(mode => (
                  <button key={mode} onClick={() => { setInputMode(mode); setInputValue(''); }} style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', background: inputMode === mode ? 'rgba(255,255,255,0.85)' : 'transparent', color: inputMode === mode ? 'var(--ink-primary)' : 'var(--ink-muted)', boxShadow: inputMode === mode ? '0 1px 4px rgba(20,20,20,0.10)' : 'none', transition: 'all 180ms ease' }}>
                    {mode === 'tokens' ? 'Por tokens' : 'Por valor'}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
                  {inputMode === 'tokens' ? 'Quantidade de tokens' : 'Valor em BRL'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.55)', transition: 'border-color 150ms ease' }}>
                  <input
                    type="number" min="0" value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="0"
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}
                  />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-muted)', flexShrink: 0 }}>
                    {inputMode === 'tokens' ? 'TKN' : 'BRL'}
                  </span>
                </div>
              </div>

              {/* Quick % buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
                {[['25%', 0.25], ['50%', 0.50], ['75%', 0.75], ['Máx', 1.0]].map(([label, pct]) => (
                  <button key={label as string} onClick={() => setQuickPct(pct as number)} style={{ padding: '7px 0', borderRadius: 8, border: '1.5px solid var(--rule)', background: 'transparent', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--ink-secondary)', cursor: 'pointer', transition: 'border-color 150ms ease, color 150ms ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-primary)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-secondary)'; }}
                  >{label}</button>
                ))}
              </div>

              {/* Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', marginBottom: 16 }}>
                <SummaryRow label="Preço unit." value={project ? formatCurrency(project.currentPrice) : '—'} />
                <SummaryRow label="Quantidade"  value={qty > 0 ? `${formatNumber(qty)} tokens` : '—'} />
                <SummaryRow label="Taxa de rede" value="R$ 0,12" />
                <div style={{ paddingTop: 6, marginTop: 2, borderTop: '1px solid rgba(20,20,20,0.06)' }}>
                  <SummaryRow label="Total" value={total > 0 ? formatCurrency(total + 0.12) : '—'} bold />
                </div>
              </div>

              {/* Insufficient funds warning */}
              {qty > 0 && total > availableBalance && (
                <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(229,37,26,0.06)', border: '1px solid rgba(229,37,26,0.14)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--red)' }}>Saldo insuficiente</span>
                </div>
              )}

              {/* Confirm button */}
              <button
                disabled={!canBuy || !project}
                onClick={() => setModalOpen(true)}
                style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: canBuy && project ? 'var(--ink-primary)' : 'rgba(20,20,20,0.12)', color: canBuy && project ? 'var(--bg-form)' : 'var(--ink-disabled)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', cursor: canBuy && project ? 'pointer' : 'not-allowed', transition: 'all 200ms ease', marginBottom: 12 }}
              >
                Confirmar compra
              </button>

              {/* Available balance */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Saldo disponível</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(availableBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      {project && (
        <section className="page-s4" style={{ marginBottom: 64 }}>
          {/* Tab nav */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--rule)', marginBottom: 32 }}>
            {TABS.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: tab === id ? 'var(--ink-primary)' : 'var(--ink-muted)', borderBottom: tab === id ? '1.5px solid var(--red)' : '1.5px solid transparent', marginBottom: -1, transition: 'color 150ms ease' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Sobre ── */}
          {tab === 'sobre' && (
            <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 20 }}>Sobre o projeto</h2>
                {(project.descriptionLong ?? project.description).split('\n\n').map((para, i) => (
                  <p key={i} style={{ fontFamily: "'Geist', 'Inter', sans-serif", fontSize: 15, lineHeight: 1.75, color: 'var(--ink-secondary)', marginBottom: 20 }}>{para}</p>
                ))}
              </div>
              <div style={{ ...GLASS, padding: '24px 20px', height: 'fit-content' }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 16 }}>Detalhes</h3>
                {[
                  { label: 'Universidade',   value: project.university },
                  { label: 'Área',           value: project.area },
                  { label: 'Status',         value: project.status === 'approved' ? 'Aprovado' : 'Pendente' },
                  { label: 'Supply total',   value: formatNumber(project.totalSupply) + ' tokens' },
                  { label: 'Em circulação',  value: formatNumber(project.totalSupply - project.availableTokens) + ' tokens' },
                  { label: 'Captação',       value: `${soldPct}%` },
                  { label: 'Fundador',       value: project.founderName },
                  { label: 'Submetido em',   value: formatDateTime(project.submittedAt) },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{row.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', textAlign: 'right', maxWidth: 160 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tokenomics ── */}
          {tab === 'tokenomics' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 32, marginBottom: 32 }}>
                {/* Donut visual */}
                <div style={{ ...GLASS, padding: 32 }}>
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 24 }}>Distribuição de tokens</h3>
                  <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Manual donut representation */}
                    <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
                      <svg viewBox="0 0 160 160" style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}>
                        {[
                          { pct: project.tokenomics.community,  color: '#1a1a1a', label: 'Comunidade'  },
                          { pct: project.tokenomics.founders,   color: '#3a3a40', label: 'Fundadores'  },
                          { pct: project.tokenomics.liquidity,  color: '#6a6a72', label: 'Liquidez'    },
                          { pct: project.tokenomics.reserve,    color: '#9a9aa2', label: 'Reserva'     },
                        ].reduce<{ segments: ReactElement[], offset: number }>((acc, seg) => {
                          const circ = 2 * Math.PI * 54;
                          const dash = (seg.pct / 100) * circ;
                          const el = (
                            <circle key={seg.label} cx="80" cy="80" r="54"
                              fill="none" stroke={seg.color} strokeWidth="24"
                              strokeDasharray={`${dash} ${circ - dash}`}
                              strokeDashoffset={-acc.offset}
                              style={{ transition: 'stroke-dasharray 600ms ease' }}
                            />
                          );
                          return { segments: [...acc.segments, el], offset: acc.offset + dash };
                        }, { segments: [] as ReactElement[], offset: 0 }).segments}
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatNumber(project.totalSupply).replace(/\./g, '').length > 5 ? `${(project.totalSupply / 1000).toFixed(0)}K` : formatNumber(project.totalSupply)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>total</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { label: 'Comunidade', pct: project.tokenomics.community,  color: '#1a1a1a' },
                        { label: 'Fundadores', pct: project.tokenomics.founders,   color: '#3a3a40' },
                        { label: 'Liquidez',   pct: project.tokenomics.liquidity,  color: '#6a6a72' },
                        { label: 'Reserva',    pct: project.tokenomics.reserve,    color: '#9a9aa2' },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0, display: 'block' }} />
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-secondary)' }}>{s.label}</span>
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.pct}%</span>
                          </div>
                          <div style={{ height: 4, background: 'rgba(20,20,20,0.08)', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Supply total',    value: formatNumber(project.totalSupply) + ' TKN' },
                    { label: 'Em circulação',   value: formatNumber(project.totalSupply - project.availableTokens) + ' TKN' },
                    { label: 'Disponíveis',     value: formatNumber(project.availableTokens) + ' TKN' },
                    { label: 'Cap. de mercado', value: `R$ ${((project.totalSupply - project.availableTokens) * project.currentPrice / 1000).toFixed(0)}K` },
                  ].map(s => (
                    <div key={s.label} style={{ ...GLASS, padding: '18px 20px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Equipe ── */}
          {tab === 'equipe' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {project.team.map((member, i) => (
                <div key={i} style={{ ...GLASS, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `hsl(${(member.name.charCodeAt(0) * 37) % 360}, 30%, 35%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                      {member.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 2 }}>{member.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>{member.role}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-secondary)' }}>{project.university}</div>
                    {member.link && (
                      <a href={member.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: 3, marginTop: 6, display: 'block', transition: 'color 150ms ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
                      >
                        Ver perfil →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Atividade ── */}
          {tab === 'atividade' && (
            <div style={{ ...GLASS, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 56px 1fr auto auto', gap: 16, padding: '10px 24px', borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
                {['Timestamp', 'Tipo', 'Hash', 'Tokens', 'Valor'].map(col => (
                  <span key={col} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: col === 'Tokens' || col === 'Valor' ? 'right' : 'left' }}>{col}</span>
                ))}
              </div>
              {activityTxs.map((tx, i) => {
                const isBuy = tx.type === 'BUY';
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 56px 1fr auto auto', gap: 16, padding: '10px 24px', borderBottom: i < activityTxs.length - 1 ? '1px solid rgba(20,20,20,0.04)' : 'none', alignItems: 'center', transition: 'background 150ms ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.40)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', fontVariantNumeric: 'tabular-nums' }}>{formatDateTime(tx.ts)}</span>
                    <div style={{ padding: '2px 6px', borderRadius: 4, background: isBuy ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)', border: `1px solid ${isBuy ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}`, textAlign: 'center' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: isBuy ? '#22c55e' : 'var(--red)' }}>{tx.type}</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-secondary)', letterSpacing: '0.04em' }}>{tx.hash}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{tx.tokens} TKN</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>R$ {tx.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Related projects ── */}
      {related.length > 0 && (
        <section className="page-s5" style={{ paddingTop: 32, borderTop: '1px solid var(--rule)', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--ink-primary)' }}>Projetos relacionados</h2>
            <Link to="/explorar" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
            >
              Ver todos →
            </Link>
          </div>
          <div className="dash-grid-3">
            {related.map(p => <RelatedCard key={p.ticker} project={p} />)}
          </div>
        </section>
      )}

      {/* ── Buy modal ── */}
      {project && (
        <BuyModal
          open={modalOpen} onClose={() => setModalOpen(false)}
          onConfirm={handleBuy} loading={buying}
          project={project} qty={qty} total={total}
        />
      )}
    </AppLayout>
  );
}
