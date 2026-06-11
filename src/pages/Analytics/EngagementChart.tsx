import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Heart, Bookmark, Share2, ChevronUp, ChevronDown, Minus, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrendDirection } from '@/types';

const engagementData = [
  { name: '06/05', 收藏率: 13.5, 转发率: 3.4, 在看率: 5.2 },
  { name: '06/06', 收藏率: 12.0, 转发率: 3.1, 在看率: 4.8 },
  { name: '06/07', 收藏率: 12.8, 转发率: 3.3, 在看率: 5.0 },
  { name: '06/08', 收藏率: 14.2, 转发率: 3.6, 在看率: 5.5 },
  { name: '06/09', 收藏率: 15.1, 转发率: 3.8, 在看率: 5.8 },
  { name: '06/10', 收藏率: 13.9, 转发率: 3.5, 在看率: 5.3 },
  { name: '06/11', 收藏率: 12.6, 转发率: 3.3, 在看率: 5.1 },
];

interface TopArticle {
  id: string;
  title: string;
  favoriteRate: number;
  shareRate: number;
  likeRate: number;
  commentRate: number;
  trend: TrendDirection;
}

const topArticles: TopArticle[] = [
  {
    id: '1',
    title: '直播电商人货场方法论',
    favoriteRate: 13.5,
    shareRate: 3.4,
    likeRate: 8.4,
    commentRate: 1.0,
    trend: 'up',
  },
  {
    id: '2',
    title: '小红书爆款笔记的底层逻辑',
    favoriteRate: 12.0,
    shareRate: 3.1,
    likeRate: 7.8,
    commentRate: 0.9,
    trend: 'up',
  },
  {
    id: '3',
    title: '私域流量精细化运营实战手册',
    favoriteRate: 11.2,
    shareRate: 2.8,
    likeRate: 6.5,
    commentRate: 0.7,
    trend: 'stable',
  },
  {
    id: '4',
    title: '短视频平台算法深度解析',
    favoriteRate: 9.8,
    shareRate: 2.5,
    likeRate: 5.9,
    commentRate: 0.6,
    trend: 'down',
  },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
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
            <span className="font-medium text-ink-700">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function TrendIcon({ trend }: { trend: TrendDirection }) {
  if (trend === 'up') return <ChevronUp className="w-3.5 h-3.5 text-moss-500" />;
  if (trend === 'down') return <ChevronDown className="w-3.5 h-3.5 text-vermilion-500" />;
  return <Minus className="w-3.5 h-3.5 text-ink-400" />;
}

export default function EngagementChart() {
  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <Heart className="w-4 h-4 text-vermilion-500" />
          互动分析
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-4">
        <div className="flex items-center gap-2 bg-moss-50 rounded-lg p-2.5">
          <Bookmark className="w-4 h-4 text-moss-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-moss-400">平均收藏率</div>
            <div className="text-sm font-bold text-moss-600">13.4%</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-vermilion-50 rounded-lg p-2.5">
          <Share2 className="w-4 h-4 text-vermilion-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-vermilion-400">平均转发率</div>
            <div className="text-sm font-bold text-vermilion-600">3.4%</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gold-50 rounded-lg p-2.5">
          <Heart className="w-4 h-4 text-gold-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-gold-400">平均在看率</div>
            <div className="text-sm font-bold text-gold-600">5.2%</div>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-2 bg-ink-50 rounded-lg p-2.5">
          <MessageCircle className="w-4 h-4 text-ink-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-ink-400">平均评论率</div>
            <div className="text-sm font-bold text-ink-600">0.8%</div>
          </div>
        </div>
      </div>

      <div className="h-[200px] mb-4 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={engagementData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DFCF" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#9A9AAC', fontSize: 10 }}
              axisLine={{ stroke: '#E8DFCF' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9A9AAC', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3EDE3', opacity: 0.5 }} />
            <Legend
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ paddingTop: 8, fontSize: 10 }}
              formatter={(value) => <span className="text-ink-500 text-[10px]">{value}</span>}
            />
            <Bar dataKey="收藏率" fill="#2D4A3E" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="转发率" fill="#C84B31" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="在看率" fill="#B8860B" radius={[4, 4, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="text-xs font-medium text-ink-500 mb-2">TOP 文章互动排行</div>
        <div className="flex-1 overflow-y-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-ink-400 border-b border-paper-200">
                <th className="text-left py-2 font-normal px-1">文章</th>
                <th className="text-right py-2 font-normal px-1">收藏</th>
                <th className="text-right py-2 font-normal px-1">转发</th>
                <th className="text-right py-2 font-normal px-1">在看</th>
                <th className="text-center py-2 font-normal px-1">趋势</th>
              </tr>
            </thead>
            <tbody>
              {topArticles.map((article, idx) => (
                <tr key={article.id} className="border-b border-paper-100 last:border-0 hover:bg-paper-50">
                  <td className="py-2 px-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0',
                          idx === 0
                            ? 'bg-gold-400 text-white'
                            : idx === 1
                            ? 'bg-ink-300 text-white'
                            : idx === 2
                            ? 'bg-vermilion-300 text-white'
                            : 'bg-paper-200 text-ink-500'
                        )}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-ink-700 line-clamp-1">{article.title}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 px-1 text-moss-600 font-medium">
                    {article.favoriteRate}%
                  </td>
                  <td className="text-right py-2 px-1 text-vermilion-600 font-medium">
                    {article.shareRate}%
                  </td>
                  <td className="text-right py-2 px-1 text-gold-600 font-medium">
                    {article.likeRate}%
                  </td>
                  <td className="text-center py-2 px-1">
                    <div className="flex justify-center">
                      <TrendIcon trend={article.trend} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
