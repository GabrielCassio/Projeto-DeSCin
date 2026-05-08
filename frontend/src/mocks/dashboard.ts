// ─── Dashboard-specific mock data ─────────────────────────────────────────

export interface DashAsset {
  ticker: string;
  code: string;
  name: string;
  university: string;
  area: string;
  tokens: number;
  price: number;
  change24h: number;
  total: number;
  color: string;
}

export interface LiveTransaction {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  ticker: string;
  code: string;
  tokens: number;
  value: number;
  wallet: string;
}

export interface TopMover {
  rank: number;
  code: string;
  university: string;
  area: string;
  change: number;
  price: number;
  volume: string;
}

export interface FeaturedProject {
  ticker: string;
  code: string;
  name: string;
  description: string;
  university: string;
  area: string;
  change7d: number;
  price: number;
  soldPercent: number;
  volume: string;
  buyCount: number;
  viewCount: number;
  gradient: string;
  accentColor: string;
}

// ─── 6 dashboard assets ────────────────────────────────────────────────────
export const MOCK_DASH_ASSETS: DashAsset[] = [
  { ticker: 'PROJ:HIDRO24', code: 'HIDRO24', name: 'Hidrelétrica Amazônica',      university: 'UFPA',   area: 'Energia',      tokens: 250, price: 18.40, change24h:  4.2,  total: 4600.00, color: '#1a6b47' },
  { ticker: 'PROJ:NEURO25', code: 'NEURO25', name: 'Interface Neural UFPE',        university: 'UFPE',   area: 'Saúde',        tokens: 180, price: 12.80, change24h:  1.8,  total: 2304.00, color: '#1a4a6b' },
  { ticker: 'PROJ:SOLAR24', code: 'SOLAR24', name: 'Painéis Bifaciais USP',        university: 'USP',    area: 'Sustent.',     tokens: 120, price:  8.15, change24h: -2.1,  total:  978.00, color: '#5c4a1a' },
  { ticker: 'PROJ:ROBO25',  code: 'ROBO25',  name: 'Cirurgia Robótica UNICAMP',    university: 'UNICAMP',area: 'Tecnologia',   tokens:  80, price: 14.30, change24h:  0.4,  total: 1144.00, color: '#3a1a6b' },
  { ticker: 'PROJ:GENO24',  code: 'GENO24',  name: 'Bioengenharia Genômica UFRJ',  university: 'UFRJ',   area: 'Ciências',     tokens:  45, price:  6.90, change24h: 12.3,  total:  310.50, color: '#6b1a3a' },
  { ticker: 'PROJ:VERDE25', code: 'VERDE25', name: 'Hortas Verticais Urbanas',     university: 'UNESP',  area: 'Sustent.',     tokens:  30, price:  3.05, change24h: -5.7,  total:   91.50, color: '#2a5c1a' },
];

// ─── Chart history generator ───────────────────────────────────────────────
export function generateChartData(
  points: number,
  startVal: number,
  endVal: number,
): { date: string; value: number }[] {
  const result: { date: string; value: number }[] = [];
  const today = new Date('2026-05-08');
  let val = startVal;
  const totalDrift = endVal - startVal;

  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const progress = (points - 1 - i) / (points - 1);
    const trend = totalDrift * progress;
    const noise = (Math.sin(i * 2.7 + 1.3) * 180) + (Math.cos(i * 1.4) * 120);
    val = startVal + trend + noise;
    result.push({
      date: d.toISOString().slice(0, 10),
      value: Math.max(val, startVal * 0.85),
    });
  }
  return result;
}

// ─── Chart presets per period ──────────────────────────────────────────────
export function getPortfolioChartData(period: string) {
  const configs: Record<string, { points: number; start: number; end: number }> = {
    '1D':  { points: 24,  start: 12614, end: 12847 },
    '7D':  { points: 14,  start: 12200, end: 12847 },
    '1M':  { points: 30,  start: 11600, end: 12847 },
    '3M':  { points: 45,  start: 10800, end: 12847 },
    '1A':  { points: 52,  start:  9200, end: 12847 },
    'Tudo':{ points: 60,  start:  7400, end: 12847 },
  };
  const c = configs[period] ?? configs['1M'];
  return generateChartData(c.points, c.start, c.end);
}

// ─── Live transactions seed ────────────────────────────────────────────────
function makeTime(minutesAgo: number): string {
  const d = new Date('2026-05-08T14:32:00');
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toTimeString().slice(0, 8);
}

function wallet(): string {
  const chars = '0123456789abcdef';
  return '0x' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('') + '...';
}

const TX_POOL: Array<{ type: 'BUY' | 'SELL'; code: string; tokRange: [number, number]; priceRange: [number, number] }> = [
  { type: 'BUY',  code: 'HIDRO24', tokRange: [20, 80],  priceRange: [18.0, 18.9] },
  { type: 'SELL', code: 'SOLAR24', tokRange: [10, 40],  priceRange: [7.9,  8.4]  },
  { type: 'BUY',  code: 'NEURO25', tokRange: [15, 60],  priceRange: [12.5, 13.1] },
  { type: 'BUY',  code: 'ROBO25',  tokRange: [5,  30],  priceRange: [14.0, 14.7] },
  { type: 'SELL', code: 'GENO24',  tokRange: [8,  25],  priceRange: [6.7,  7.2]  },
  { type: 'BUY',  code: 'VERDE25', tokRange: [30, 100], priceRange: [2.9,  3.2]  },
  { type: 'BUY',  code: 'HIDRO24', tokRange: [5,  20],  priceRange: [18.2, 18.6] },
  { type: 'SELL', code: 'NEURO25', tokRange: [12, 35],  priceRange: [12.6, 12.9] },
];

export function generateTransaction(idOffset = 0): LiveTransaction {
  const t = TX_POOL[idOffset % TX_POOL.length];
  const tok = Math.round(t.tokRange[0] + Math.random() * (t.tokRange[1] - t.tokRange[0]));
  const price = +(t.priceRange[0] + Math.random() * (t.priceRange[1] - t.priceRange[0])).toFixed(2);
  const now = new Date();
  return {
    id: `tx_${Date.now()}_${idOffset}`,
    time: now.toTimeString().slice(0, 8),
    type: t.type,
    ticker: `PROJ:${t.code}`,
    code: t.code,
    tokens: tok,
    value: +(tok * price),
    wallet: wallet(),
  };
}

export function getInitialTransactions(): LiveTransaction[] {
  return Array.from({ length: 8 }, (_, i) => {
    const t = TX_POOL[i % TX_POOL.length];
    const tok = Math.round(t.tokRange[0] + (t.tokRange[1] - t.tokRange[0]) * 0.4);
    const price = +(t.priceRange[0] + (t.priceRange[1] - t.priceRange[0]) * 0.5).toFixed(2);
    return {
      id: `tx_init_${i}`,
      time: makeTime(i * 2),
      type: t.type,
      ticker: `PROJ:${t.code}`,
      code: t.code,
      tokens: tok,
      value: +(tok * price),
      wallet: `0x${(0x3a7f + i * 0x113).toString(16)}...`,
    };
  });
}

// ─── Top movers ────────────────────────────────────────────────────────────
export const MOCK_TOP_ALTA: TopMover[] = [
  { rank: 1, code: 'GENO24',  university: 'UFRJ',    area: 'Ciências',   change:  12.3, price:  6.90, volume: 'R$ 42K'  },
  { rank: 2, code: 'HIDRO24', university: 'UFPA',    area: 'Energia',    change:   4.2, price: 18.40, volume: 'R$ 142K' },
  { rank: 3, code: 'ROBO25',  university: 'UNICAMP', area: 'Tecnologia', change:   2.8, price: 14.30, volume: 'R$ 88K'  },
  { rank: 4, code: 'NEURO25', university: 'UFPE',    area: 'Saúde',      change:   1.8, price: 12.80, volume: 'R$ 76K'  },
  { rank: 5, code: 'ROBO25',  university: 'UNESP',   area: 'Engenharia', change:   0.4, volume: 'R$ 31K', price:  9.70 },
];

export const MOCK_TOP_BAIXA: TopMover[] = [
  { rank: 1, code: 'VERDE25', university: 'UNESP',   area: 'Sustent.',   change:  -5.7, price:  3.05, volume: 'R$ 8K'   },
  { rank: 2, code: 'SOLAR24', university: 'USP',     area: 'Sustent.',   change:  -2.1, price:  8.15, volume: 'R$ 29K'  },
  { rank: 3, code: 'QUIM24',  university: 'UFSCAR',  area: 'Ciências',   change:  -1.4, price:  5.30, volume: 'R$ 14K'  },
  { rank: 4, code: 'AGRO25',  university: 'ESALQ',   area: 'Engenharia', change:  -0.9, price:  7.80, volume: 'R$ 22K'  },
  { rank: 5, code: 'NANO24',  university: 'UNIFEI',  area: 'Tecnologia', change:  -0.3, price: 11.20, volume: 'R$ 17K'  },
];

export const MOCK_TOP_VOL: TopMover[] = [
  { rank: 1, code: 'HIDRO24', university: 'UFPA',    area: 'Energia',    change:   4.2, price: 18.40, volume: 'R$ 142K' },
  { rank: 2, code: 'NEURO25', university: 'UFPE',    area: 'Saúde',      change:   1.8, price: 12.80, volume: 'R$ 76K'  },
  { rank: 3, code: 'ROBO25',  university: 'UNICAMP', area: 'Tecnologia', change:   2.8, price: 14.30, volume: 'R$ 63K'  },
  { rank: 4, code: 'SOLAR24', university: 'USP',     area: 'Sustent.',   change:  -2.1, price:  8.15, volume: 'R$ 29K'  },
  { rank: 5, code: 'GENO24',  university: 'UFRJ',    area: 'Ciências',   change:  12.3, price:  6.90, volume: 'R$ 22K'  },
];

// ─── Featured projects ─────────────────────────────────────────────────────
export const MOCK_FEATURED: FeaturedProject[] = [
  {
    ticker: 'PROJ:HIDRO24', code: 'HIDRO24',
    name: 'Hidrelétrica Amazônica',
    description: 'Microturbinas modulares para comunidades isoladas no Pará. 4 unidades operacionais em campo.',
    university: 'UFPA', area: 'Energia',
    change7d: 18.4, price: 18.40, soldPercent: 68, volume: 'R$ 142K',
    buyCount: 342, viewCount: 5840,
    gradient: 'linear-gradient(135deg, #0f2619 0%, #1a4a2a 60%, #0a1f12 100%)',
    accentColor: '#22c55e',
  },
  {
    ticker: 'PROJ:NEURO25', code: 'NEURO25',
    name: 'Interface Neural UFPE',
    description: 'Eletrodos flexíveis biocompatíveis para interface cérebro-máquina. Fase I clínica aprovada.',
    university: 'UFPE', area: 'Saúde',
    change7d: 6.4, price: 12.80, soldPercent: 44, volume: 'R$ 76K',
    buyCount: 187, viewCount: 3210,
    gradient: 'linear-gradient(135deg, #0f1a2e 0%, #1a2a4a 60%, #0a1020 100%)',
    accentColor: '#60a5fa',
  },
  {
    ticker: 'PROJ:ROBO25', code: 'ROBO25',
    name: 'Cirurgia Robótica UNICAMP',
    description: 'Braço robótico submilimétrico para cirurgias minimamente invasivas. Custo 80% menor que similares importados.',
    university: 'UNICAMP', area: 'Tecnologia',
    change7d: 24.8, price: 14.30, soldPercent: 82, volume: 'R$ 88K',
    buyCount: 428, viewCount: 7620,
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #3a1010 60%, #1a0808 100%)',
    accentColor: 'var(--red)',
  },
  {
    ticker: 'PROJ:AGRO25', code: 'AGRO25',
    name: 'Agricultura de Precisão',
    description: 'Drones autônomos com IA para detecção de pragas em tempo real. Cobertura de 400 ha/dia por unidade.',
    university: 'ESALQ', area: 'Agro',
    change7d: 3.1, price: 7.80, soldPercent: 31, volume: 'R$ 38K',
    buyCount: 156, viewCount: 2890,
    gradient: 'linear-gradient(135deg, #1a2a0f 0%, #2a4a1a 60%, #0f1f08 100%)',
    accentColor: '#84cc16',
  },
  {
    ticker: 'PROJ:QUIM24', code: 'QUIM24',
    name: 'Catálise Verde USFSCar',
    description: 'Catalisadores enzimáticos para substituição de solventes tóxicos na indústria química nacional.',
    university: 'UFSCar', area: 'Química',
    change7d: -1.4, price: 5.30, soldPercent: 22, volume: 'R$ 21K',
    buyCount: 89, viewCount: 1450,
    gradient: 'linear-gradient(135deg, #1a1a0f 0%, #2a280f 60%, #141408 100%)',
    accentColor: '#f59e0b',
  },
  {
    ticker: 'PROJ:NANO24', code: 'NANO24',
    name: 'Nanomedicina UNIFEI',
    description: 'Nanopartículas lipídicas para entrega dirigida de quimioterápicos. Redução de 60% em efeitos colaterais.',
    university: 'UNIFEI', area: 'Saúde',
    change7d: 9.7, price: 11.20, soldPercent: 55, volume: 'R$ 62K',
    buyCount: 234, viewCount: 4120,
    gradient: 'linear-gradient(135deg, #0f0f2a 0%, #1a1a4a 60%, #080814 100%)',
    accentColor: '#a78bfa',
  },
];

// ─── DSC Index sparkline data ──────────────────────────────────────────────
export const DSC_INDEX_DATA = generateChartData(24, 1228, 1247);
