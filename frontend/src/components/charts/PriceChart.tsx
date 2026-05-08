import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PricePoint } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl shadow-lg px-4 py-3 border border-border">
      <p className="text-xs text-text-muted mb-1">{label ? formatDate(label) : ''}</p>
      <p className="font-mono font-semibold text-text-primary text-sm tabular-nums">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

interface PriceChartProps {
  data: PricePoint[];
  change24h: number;
}

export function PriceChart({ data, change24h }: PriceChartProps) {
  const positive = change24h >= 0;
  const color = positive ? 'rgb(76, 217, 100)' : 'rgb(255, 59, 48)';
  const gradientId = positive ? 'priceGradGreen' : 'priceGradRed';
  const chartData = data.map(p => ({ date: p.timestamp, price: p.price }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'rgb(130, 129, 138)' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tickFormatter={v => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'rgb(130, 129, 138)' }}
          tickLine={false}
          axisLine={false}
          width={60}
          tickFormatter={v => `R$${v.toFixed(2)}`}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.08)' }} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: 'rgb(30, 29, 34)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
