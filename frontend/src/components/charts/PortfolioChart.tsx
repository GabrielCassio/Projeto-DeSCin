import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { PortfolioPoint } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(20,20,20,0.10)',
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 24px rgba(20,20,20,0.10)',
    }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.10em',
        color: '#7A7A82', marginBottom: 4, textTransform: 'uppercase',
      }}>
        {label ? formatDate(label) : ''}
      </p>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 16, fontWeight: 600,
        color: '#0A0A0A', fontVariantNumeric: 'tabular-nums',
      }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

interface PortfolioChartProps {
  data: PortfolioPoint[];
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const chartData = data.map((p) => ({ date: p.timestamp, value: p.value }));

  const firstValue = chartData[0]?.value ?? 0;
  const lastValue = chartData[chartData.length - 1]?.value ?? 0;
  const isPositive = lastValue >= firstValue;

  const color = isPositive ? '#22c55e' : '#E5251A';
  const gradId = isPositive ? 'portGradPos' : 'portGradNeg';

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="portGradPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.18} />
            <stop offset="60%"  stopColor="#22c55e" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="portGradNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#E5251A" stopOpacity={0.14} />
            <stop offset="60%"  stopColor="#E5251A" stopOpacity={0.04} />
            <stop offset="100%" stopColor="#E5251A" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="none"
          vertical={false}
          stroke="rgba(20,20,20,0.05)"
          strokeWidth={1}
        />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#7A7A82', fontFamily: "'JetBrains Mono', monospace" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#7A7A82', fontFamily: "'JetBrains Mono', monospace" }}
          tickLine={false}
          axisLine={false}
          width={68}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(20,20,20,0.12)', strokeWidth: 1, strokeDasharray: '4 4' }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{
            r: 5,
            fill: color,
            strokeWidth: 2,
            stroke: '#FAFAF7',
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
