import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({
  data,
  positive = true,
  width = 80,
  height = 32,
}: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? 'rgb(76, 217, 100)' : 'rgb(255, 59, 48)';

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
