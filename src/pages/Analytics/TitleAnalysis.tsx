import { Trophy, Sparkles, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TitleComparison } from '@/types';

interface AbTest {
  id: string;
  title: string;
  views: number;
  clicks: number;
  ctr: number;
  isWinner: boolean;
}

const abTests: AbTest[][] = [
  [
    {
      id: 't1-a',
      title: '2024年品牌营销趋势：用户注意力争夺战',
      views: 52300,
      clicks: 18305,
      ctr: 35.0,
      isWinner: true,
    },
    {
      id: 't1-b',
      title: '品牌营销正在发生变化，你注意到了吗？',
      views: 48900,
      clicks: 13692,
      ctr: 28.0,
      isWinner: false,
    },
  ],
  [
    {
      id: 't2-a',
      title: 'AIGC时代内容创作的破局之道',
      views: 41200,
      clicks: 11536,
      ctr: 28.0,
      isWinner: false,
    },
    {
      id: 't2-b',
      title: 'AI来了，内容创作者如何不被淘汰？',
      views: 45800,
      clicks: 16030,
      ctr: 35.0,
      isWinner: true,
    },
  ],
  [
    {
      id: 't3-a',
      title: '私域流量精细化运营实战手册',
      views: 38500,
      clicks: 9625,
      ctr: 25.0,
      isWinner: false,
    },
    {
      id: 't3-b',
      title: '私域运营不是拉群，3个方法让复购翻倍',
      views: 42100,
      clicks: 15156,
      ctr: 36.0,
      isWinner: true,
    },
  ],
];

interface Keyword {
  word: string;
  weight: number;
}

const keywords: Keyword[] = [
  { word: '爆款', weight: 95 },
  { word: '实战', weight: 88 },
  { word: '方法论', weight: 82 },
  { word: 'AI', weight: 90 },
  { word: '趋势', weight: 75 },
  { word: '底层逻辑', weight: 85 },
  { word: '用户', weight: 70 },
  { word: '流量', weight: 78 },
  { word: '运营', weight: 72 },
  { word: '内容', weight: 80 },
  { word: '增长', weight: 68 },
  { word: '私域', weight: 86 },
  { word: '营销', weight: 74 },
  { word: '精细化', weight: 65 },
  { word: '红利', weight: 79 },
];

function getKeywordStyle(weight: number) {
  if (weight >= 90) return { size: 'text-lg', color: 'text-vermilion-500', weight: 'font-bold' };
  if (weight >= 80) return { size: 'text-base', color: 'text-gold-500', weight: 'font-semibold' };
  if (weight >= 70) return { size: 'text-sm', color: 'text-moss-500', weight: 'font-medium' };
  return { size: 'text-xs', color: 'text-ink-400', weight: 'font-normal' };
}

export default function TitleAnalysis() {
  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-vermilion-500" />
          标题分析
        </h3>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-4">
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="text-xs font-medium text-ink-500 mb-2 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-gold-500" />
            A/B 标题效果对比
          </div>
          <div className="flex-1 overflow-y-auto -mx-1 space-y-3">
            {abTests.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1.5">
                <div className="text-[10px] text-ink-300 px-1">测试组 {groupIdx + 1}</div>
                <div className="space-y-1.5">
                  {group.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'rounded-xl p-3 border transition-all',
                        item.isWinner
                          ? 'bg-moss-50 border-moss-200'
                          : 'bg-white border-paper-200'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          {item.isWinner && (
                            <div className="mt-0.5 shrink-0">
                              <div className="w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center">
                                <Trophy className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                'text-sm leading-relaxed',
                                item.isWinner ? 'text-moss-700 font-medium' : 'text-ink-600'
                              )}
                            >
                              {item.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className="text-[10px] text-ink-400">曝光</div>
                            <div className="text-xs font-medium text-ink-600">
                              {item.views.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-ink-400">点击</div>
                            <div className="text-xs font-medium text-ink-600">
                              {item.clicks.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right min-w-[48px]">
                            <div className="text-[10px] text-ink-400">CTR</div>
                            <div
                              className={cn(
                                'text-xs font-bold',
                                item.isWinner ? 'text-moss-600' : 'text-ink-600'
                              )}
                            >
                              {item.ctr}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <div className="text-xs font-medium text-ink-500 mb-2 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-gold-500" />
            关键词表现分析
          </div>
          <div className="bg-paper-50 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-center min-h-[80px]">
            {keywords.map((kw) => {
              const style = getKeywordStyle(kw.weight);
              return (
                <span
                  key={kw.word}
                  className={cn(
                    'px-2.5 py-1 rounded-full bg-white border border-paper-200 cursor-pointer hover:shadow-sm transition-all hover:-translate-y-0.5',
                    style.size,
                    style.color,
                    style.weight
                  )}
                  title={`热度: ${kw.weight}`}
                >
                  {kw.word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
