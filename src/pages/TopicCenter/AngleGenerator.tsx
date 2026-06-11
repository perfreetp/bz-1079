import { useState } from 'react';
import {
  Sparkles,
  ThumbsUp,
  Bookmark,
  RefreshCw,
  Wand2,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { angles as mockAngles } from '@/data/materials';

interface AngleCardProps {
  content: string;
  index: number;
}

function AngleCard({ content, index }: AngleCardProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className="bg-paper rounded-xl p-4 shadow-paper hover:shadow-paper-hover transition-all hover:-translate-y-0.5 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-gold-50 shrink-0">
          <Lightbulb className="w-4 h-4 text-gold-500" />
        </div>
        <p className="flex-1 text-sm text-ink-700 leading-relaxed font-serif">
          {content}
        </p>
      </div>
      <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-paper-100">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
            liked
              ? 'bg-vermilion-50 text-vermilion-600'
              : 'text-ink-400 hover:bg-paper-100 hover:text-ink-600'
          )}
        >
          <ThumbsUp className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
          {likeCount}
        </button>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={cn(
            'p-1.5 rounded-lg transition-all',
            bookmarked
              ? 'bg-gold-50 text-gold-500'
              : 'text-ink-400 hover:bg-paper-100 hover:text-ink-600'
          )}
        >
          <Bookmark className={cn('w-3.5 h-3.5', bookmarked && 'fill-current')} />
        </button>
        <button className="p-1.5 rounded-lg text-ink-400 hover:bg-paper-100 hover:text-moss-500 transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AngleGenerator() {
  const [theme, setTheme] = useState('');
  const [angles, setAngles] = useState<string[]>(mockAngles);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!theme.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newAngles = [
        `围绕"${theme}"，从用户痛点出发，深度剖析行业现状与破局点`,
        `以"${theme}"为核心，结合最新数据趋势，给出可落地的执行策略`,
        `从竞品对比角度切入，分析"${theme}"的差异化机会和增长空间`,
        `通过真实案例拆解，展示"${theme}"在实践中的应用方法论`,
        `面向未来视角，预测"${theme}"未来3年的发展趋势与机遇`,
        `从用户情感共鸣切入，讲述"${theme}"背后的故事与价值`,
      ];
      setAngles(newAngles);
      setIsGenerating(false);
    }, 1200);
  };

  const handleRegenerateOne = (index: number) => {
    const newAngle = `全新角度 ${index + 1}：从另一个维度重新审视这个话题，带来独特的洞察和思考`;
    setAngles((prev) => prev.map((a, i) => (i === index ? newAngle : a)));
  };

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-vermilion-500" />
          AI 角度生成器
        </h3>
        <button className="flex items-center gap-1 text-xs text-ink-400 hover:text-vermilion transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          换一批
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Wand2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="输入核心主题，如：品牌营销、AIGC创作..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-full pl-9 pr-4 py-2.5 bg-paper-50 border border-paper-200 rounded-lg text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-vermilion-200 focus:border-vermilion-300 transition-all"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!theme.trim() || isGenerating}
          className={cn(
            'px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5',
            'bg-vermilion-500 hover:bg-vermilion-600 shadow-sm hover:shadow',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Sparkles className={cn('w-4 h-4', isGenerating && 'animate-spin')} />
          {isGenerating ? '生成中...' : '生成角度'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3">
        {angles.map((angle, index) => (
          <div key={index} className="group relative">
            <AngleCard content={angle} index={index} />
            <button
              onClick={() => handleRegenerateOne(index)}
              className="absolute top-3 right-3 p-1 rounded-md bg-paper shadow-sm text-ink-300 hover:text-moss-500 opacity-0 group-hover:opacity-100 transition-all"
              title="单独重新生成"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-paper-200">
        <div className="flex items-center justify-between text-xs text-ink-400">
          <span>共 {angles.length} 个候选角度</span>
          <span>点击 ❤️ 点赞 · 💾 收藏 · 🔄 换一个</span>
        </div>
      </div>
    </div>
  );
}
