import { useState } from 'react';
import { BarChart3, CalendarDays, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReadingTrend from './ReadingTrend';
import EngagementChart from './EngagementChart';
import TitleAnalysis from './TitleAnalysis';

type TimeRange = '7d' | '30d' | 'custom';

const timeRangeOptions: { key: TimeRange; label: string }[] = [
  { key: '7d', label: '近7天' },
  { key: '30d', label: '近30天' },
  { key: 'custom', label: '自定义' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-800 font-serif flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-vermilion-500" />
              数据复盘
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              深入分析内容表现，用数据驱动创作决策
            </p>
          </div>

          <div className="flex items-center gap-2 bg-paper rounded-xl p-1 shadow-paper">
            <CalendarDays className="w-4 h-4 text-ink-400 ml-2" />
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTimeRange(opt.key)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1',
                  timeRange === opt.key
                    ? 'bg-vermilion-500 text-white shadow-sm'
                    : 'text-ink-500 hover:text-ink-700'
                )}
              >
                {opt.label}
                {opt.key === 'custom' && timeRange === opt.key && (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
          <div className="col-span-7 min-h-0">
            <ReadingTrend />
          </div>

          <div className="col-span-5 min-h-0">
            <EngagementChart />
          </div>

          <div className="col-span-12 min-h-0" style={{ height: '400px' }}>
            <TitleAnalysis />
          </div>
        </div>
      </div>
    </div>
  );
}
