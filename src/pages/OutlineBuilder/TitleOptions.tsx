import { useState } from 'react';
import type { TitleOption } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles, ThumbsUp, Star, Wand2 } from 'lucide-react';

interface TitleOptionsProps {
  titleOptions: TitleOption[];
  onSetPrimary: (id: string) => void;
}

export default function TitleOptions({ titleOptions, onSetPrimary }: TitleOptionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-6 bg-ink-50">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-gold-500" />
            </div>
            <h2 className="text-base font-semibold text-ink-800">标题备选</h2>
            <span className="text-xs text-ink-400">选择最佳标题吸引读者</span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold-400 to-gold-500 text-white text-sm font-medium rounded-lg hover:from-gold-500 hover:to-gold-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Wand2 className={cn('w-4 h-4', isGenerating && 'animate-spin')} />
            {isGenerating ? '生成中...' : 'AI生成标题'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {titleOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                'relative p-4 rounded-xl border-2 bg-white transition-all duration-200 cursor-pointer hover:shadow-paper-hover',
                option.isPrimary
                  ? 'border-vermilion bg-vermilion-50/30 shadow-paper'
                  : 'border-transparent hover:border-ink-200'
              )}
            >
              {option.isPrimary && (
                <div className="absolute -top-2.5 -left-2.5 w-7 h-7 bg-vermilion rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                  主
                </div>
              )}

              <p className="text-sm font-medium text-ink-800 leading-relaxed mb-3 pr-2">
                {option.title}
              </p>

              {option.aiSuggestion && (
                <div className="flex items-start gap-1.5 mb-3 px-2.5 py-1.5 bg-moss-50 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-moss-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-moss-700 leading-relaxed">
                    {option.aiSuggestion}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-ink-400">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{option.votes}</span>
                </div>

                {!option.isPrimary && (
                  <button
                    onClick={() => onSetPrimary(option.id)}
                    className="text-xs font-medium text-vermilion hover:text-vermilion-600 hover:bg-vermilion-50 px-2.5 py-1 rounded-md transition-colors"
                  >
                    设为主标题
                  </button>
                )}
                {option.isPrimary && (
                  <span className="text-xs font-medium text-vermilion flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-vermilion" />
                    当前主标题
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
