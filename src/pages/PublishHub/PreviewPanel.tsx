import { useState } from 'react';
import { ChevronLeft, Signal, Wifi, Battery, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

type ThemeKey = 'default' | 'simple' | 'business' | 'artistic';

const themeConfig: Record<ThemeKey, { label: string; titleClass: string; bodyClass: string; metaClass: string; bgClass: string }> = {
  default: {
    label: '默认',
    titleClass: 'text-ink-800 font-bold text-xl font-serif',
    bodyClass: 'text-ink-600 text-[15px] leading-7',
    metaClass: 'text-ink-400 text-xs',
    bgClass: 'bg-paper',
  },
  simple: {
    label: '简约',
    titleClass: 'text-ink-800 font-semibold text-lg',
    bodyClass: 'text-ink-500 text-[14px] leading-6',
    metaClass: 'text-ink-300 text-xs',
    bgClass: 'bg-white',
  },
  business: {
    label: '商务',
    titleClass: 'text-ink-800 font-bold text-lg tracking-wide',
    bodyClass: 'text-ink-700 text-[15px] leading-7',
    metaClass: 'text-ink-400 text-xs',
    bgClass: 'bg-paper-100',
  },
  artistic: {
    label: '文艺',
    titleClass: 'text-ink-700 font-bold text-xl font-serif italic',
    bodyClass: 'text-ink-600 text-[15px] leading-8',
    metaClass: 'text-ink-300 text-xs',
    bgClass: 'bg-paper-200',
  },
};

const mockArticle = {
  title: '2024年品牌营销趋势：用户注意力争夺战',
  author: '墨金小编',
  publishTime: '2026-06-10 18:30',
  content: `在信息爆炸的今天，用户的注意力成为最稀缺的资源。品牌营销正在经历一场深刻的变革——从广撒网的粗放式投放，转向精耕细作的注意力经营。

一、内容即入口：好内容自带流量
用户不再被动接受广告，而是主动选择内容。优质的原创内容，正在成为品牌与用户建立连接的第一触点。

二、场景即触达：在对的时间说对的话
移动互联网时代，用户的注意力碎片化分布在不同场景中。品牌需要深入理解用户行为路径，在恰当的场景下传递恰当的信息。

三、情感即连接：从交易到关系
冷冰冰的功能诉求已经无法打动用户。真正能够留下深刻印象的，是那些能够引发情感共鸣的品牌故事。`,
};

export default function PreviewPanel() {
  const [theme, setTheme] = useState<ThemeKey>('default');
  const config = themeConfig[theme];

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif">排版预览</h3>
        <div className="flex items-center gap-1 bg-paper-100 rounded-lg p-1">
          <Palette className="w-4 h-4 text-ink-400 ml-1.5" />
          {(Object.keys(themeConfig) as ThemeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                'px-2.5 py-1 text-xs rounded-md transition-all',
                theme === key
                  ? 'bg-white text-ink-700 shadow-sm font-medium'
                  : 'text-ink-400 hover:text-ink-600'
              )}
            >
              {themeConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start overflow-hidden">
        <div className="relative w-[340px] shrink-0">
          <div className="bg-ink-900 rounded-[42px] p-3 shadow-2xl">
            <div className="bg-white rounded-[32px] overflow-hidden border border-ink-100">
              <div className="bg-ink-50 px-5 pt-3 pb-1 flex items-center justify-between">
                <span className="text-[11px] text-ink-600 font-medium">9:41</span>
                <div className="w-24 h-6 bg-ink-900 rounded-full" />
                <div className="flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5 text-ink-600" />
                  <Wifi className="w-3.5 h-3.5 text-ink-600" />
                  <Battery className="w-4 h-4 text-ink-600" />
                </div>
              </div>

              <div className={cn('min-h-[480px] px-4 py-5', config.bgClass)}>
                <h1 className={cn(config.titleClass, 'mb-3')}>{mockArticle.title}</h1>
                <div className={cn(config.metaClass, 'flex items-center gap-2 mb-5')}>
                  <span>{mockArticle.author}</span>
                  <span>·</span>
                  <span>{mockArticle.publishTime}</span>
                </div>
                <div className={config.bodyClass}>
                  {mockArticle.content.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-4 indent-8 first:indent-0">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-ink-50 px-4 py-3 border-t border-ink-100">
                <button className="flex items-center gap-1 text-xs text-ink-500">
                  <ChevronLeft className="w-4 h-4" />
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
