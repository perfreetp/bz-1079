import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { weeklyMetrics } from '@/data/articles';

const chartData = weeklyMetrics.map((m) => ({
  date: m.date,
  阅读数: m.reads,
  完读数: Math.round(m.reads * (0.65 + Math.random() * 0.15)),
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper border border-paper-200 rounded-xl shadow-paper-hover p-3">
        <p className="text-sm font-medium text-ink-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-ink-500">{entry.name}</span>
            </div>
            <span className="font-medium text-ink-700">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ReadingTrend() {
  const totalReads = chartData.reduce((sum, d) => sum + d.阅读数, 0);
  const avgCompleteRate = Math.round(
    (chartData.reduce((sum, d) => sum + d.完读数 / d.阅读数, 0) / chartData.length) * 100
  );

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-vermilion-500" />
            阅读趋势
          </h3>
          <p className="text-xs text-ink-400 mt-1">阅读数与完读率变化</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-lg font-bold text-ink-800 font-serif">
              {totalReads.toLocaleString()}
            </div>
            <div className="text-[10px] text-ink-400">累计阅读</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-moss-500 font-serif">{avgCompleteRate}%</div>
            <div className="text-[10px] text-ink-400">平均完读率</div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B8860B" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DFCF" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#9A9AAC', fontSize: 11 }}
              axisLine={{ stroke: '#E8DFCF' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9A9AAC', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#D9CCB4', strokeDasharray: '4 4' }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
              formatter={(value) => <span className="text-ink-500 text-xs">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="阅读数"
              stroke="#B8860B"
              strokeWidth={2.5}
              dot={{ fill: '#B8860B', r: 4, strokeWidth: 2, stroke: '#FAF7F2' }}
              activeDot={{ r: 6, stroke: '#B8860B', strokeWidth: 2, fill: '#FAF7F2' }}
            />
            <Line
              type="monotone"
              dataKey="完读数"
              stroke="#2D4A3E"
              strokeWidth={2.5}
              dot={{ fill: '#2D4A3E', r: 4, strokeWidth: 2, stroke: '#FAF7F2' }}
              activeDot={{ r: 6, stroke: '#2D4A3E', strokeWidth: 2, fill: '#FAF7F2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
