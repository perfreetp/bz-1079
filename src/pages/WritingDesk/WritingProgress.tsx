import { Target, CheckCircle, Clock } from 'lucide-react';

interface WritingProgressProps {
  currentWords: number;
  targetWords: number;
  outlineCompleteRate: number;
  estimatedTime: string;
}

export default function WritingProgress({
  currentWords,
  targetWords,
  outlineCompleteRate,
  estimatedTime,
}: WritingProgressProps) {
  const wordProgress = Math.min((currentWords / targetWords) * 100, 100);

  return (
    <div className="bg-white border-t border-ink-100 px-6 py-3 flex items-center gap-8 flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="w-9 h-9 bg-vermilion-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Target className="w-4.5 h-4.5 text-vermilion" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-ink-600">字数目标</span>
            <span className="text-xs text-ink-500">
              <span className="font-semibold text-vermilion">{currentWords.toLocaleString()}</span>
              <span className="mx-1 text-ink-300">/</span>
              {targetWords.toLocaleString()} 字
            </span>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vermilion-400 to-vermilion rounded-full transition-all duration-500 ease-out"
              style={{ width: `${wordProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-56">
        <div className="w-9 h-9 bg-moss-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-4.5 h-4.5 text-moss-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-ink-600">大纲完成度</span>
            <span className="text-xs font-semibold text-moss-600">{outlineCompleteRate}%</span>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-moss-400 to-moss-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${outlineCompleteRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 px-4 py-2 bg-gold-50 rounded-lg">
        <Clock className="w-4.5 h-4.5 text-gold-500" />
        <div>
          <div className="text-[11px] text-gold-600 leading-none mb-0.5">预计完成时间</div>
          <div className="text-sm font-semibold text-gold-700 leading-none">{estimatedTime}</div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4 text-xs text-ink-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-vermilion" />
          <span>写作中</span>
        </div>
        <div>自动保存 · 刚刚</div>
      </div>
    </div>
  );
}
