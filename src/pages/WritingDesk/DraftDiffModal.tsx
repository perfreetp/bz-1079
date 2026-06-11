import { useMemo } from 'react';
import { X, RotateCcw, FileText, Sparkles, ArrowLeftRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DraftVersion, DraftVersionSource } from '@/types';
import { formatDate } from '@/utils/date';

const sourceLabels: Record<DraftVersionSource, string> = {
  manual: '手动保存',
  ai_tone: 'AI 改写',
  ai_expand: 'AI 扩写',
  ai_golden: '金句插入',
  material_insert: '素材插入',
  review_apply: '审核应用',
  restore_backup: '恢复前备份',
  restore: '已恢复',
  ai_undo: 'AI 撤销',
  auto_save: '自动保存',
};

const sourceColors: Record<DraftVersionSource, string> = {
  manual: 'bg-ink-100 text-ink-600',
  ai_tone: 'bg-vermilion-50 text-vermilion-700',
  ai_expand: 'bg-moss-50 text-moss-600',
  ai_golden: 'bg-gold-50 text-gold-600',
  material_insert: 'bg-blue-50 text-blue-600',
  review_apply: 'bg-moss-50 text-moss-600',
  restore_backup: 'bg-ink-100 text-ink-500',
  restore: 'bg-moss-50 text-moss-600',
  ai_undo: 'bg-orange-50 text-orange-600',
  auto_save: 'bg-ink-100 text-ink-500',
};

interface DraftDiffModalProps {
  version: DraftVersion;
  currentContent: string;
  onClose: () => void;
  onRestore: () => void;
}

interface DiffSegment {
  text: string;
  type: 'same' | 'added' | 'removed';
}

function computeDiff(oldText: string, newText: string): DiffSegment[] {
  const oldChars = oldText.split('');
  const newChars = newText.split('');
  
  const dp: number[][] = [];
  for (let i = 0; i <= oldChars.length; i++) {
    dp[i] = [];
    for (let j = 0; j <= newChars.length; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else if (oldChars[i - 1] === newChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const segments: DiffSegment[] = [];
  let i = oldChars.length;
  let j = newChars.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldChars[i - 1] === newChars[j - 1]) {
      segments.unshift({ text: oldChars[i - 1], type: 'same' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      if (segments.length > 0 && segments[0].type === 'added') {
        segments[0].text = newChars[j - 1] + segments[0].text;
      } else {
        segments.unshift({ text: newChars[j - 1], type: 'added' });
      }
      j--;
    } else {
      if (segments.length > 0 && segments[0].type === 'removed') {
        segments[0].text = oldChars[i - 1] + segments[0].text;
      } else {
        segments.unshift({ text: oldChars[i - 1], type: 'removed' });
      }
      i--;
    }
  }

  return segments;
}

export default function DraftDiffModal({
  version,
  currentContent,
  onClose,
  onRestore,
}: DraftDiffModalProps) {
  const diffResult = useMemo(() => {
    return computeDiff(version.content, currentContent);
  }, [version.content, currentContent]);

  const oldSegments = useMemo(() => {
    return diffResult.filter((s) => s.type !== 'added');
  }, [diffResult]);

  const newSegments = useMemo(() => {
    return diffResult.filter((s) => s.type !== 'removed');
  }, [diffResult]);

  const renderSegments = (segments: DiffSegment[], isOld: boolean) => {
    return segments.map((segment, idx) => {
      let className = '';
      if (segment.type === 'same') {
        className = '';
      } else if (segment.type === 'removed') {
        className = isOld
          ? 'bg-vermilion-100 text-vermilion-700 line-through decoration-vermilion-400/50'
          : '';
      } else if (segment.type === 'added') {
        className = !isOld
          ? 'bg-moss-100 text-moss-700'
          : '';
      }

      return (
        <span key={idx} className={cn(className)}>
          {segment.text}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-vermilion-50 rounded-xl flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-vermilion" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink-800">版本对比</h3>
              <p className="text-xs text-ink-400">
                第 {version.versionNumber} 版 vs 当前正文
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 divide-x divide-ink-100 overflow-hidden">
          <div className="flex flex-col min-h-0">
            <div className="px-5 py-3 bg-ink-50 border-b border-ink-100 flex items-center gap-2 flex-shrink-0">
              <FileText className="w-4 h-4 text-ink-400" />
              <span className="text-sm font-medium text-ink-600">历史版本</span>
              {version.source && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', sourceColors[version.source])}>
                  {sourceLabels[version.source]}
                </span>
              )}
              <span className="text-xs text-ink-400 ml-auto">
                {formatDate(version.createdAt, 'full')}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="text-sm leading-relaxed text-ink-700 whitespace-pre-wrap">
                {renderSegments(oldSegments, true)}
              </div>
            </div>
            <div className="px-5 py-2 bg-ink-50 border-t border-ink-100 text-xs text-ink-500 flex items-center justify-between flex-shrink-0">
              <span>第 {version.versionNumber} 版</span>
              <span>{version.wordCount.toLocaleString()} 字</span>
            </div>
          </div>

          <div className="flex flex-col min-h-0">
            <div className="px-5 py-3 bg-moss-50 border-b border-moss-100 flex items-center gap-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-moss-500" />
              <span className="text-sm font-medium text-moss-700">当前正文</span>
              <span className="text-xs text-moss-500 ml-auto">最新</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="text-sm leading-relaxed text-ink-700 whitespace-pre-wrap">
                {renderSegments(newSegments, false)}
              </div>
            </div>
            <div className="px-5 py-2 bg-moss-50 border-t border-moss-100 text-xs text-moss-600 flex items-center justify-between flex-shrink-0">
              <span>当前版本</span>
              <span>{currentContent.replace(/\s/g, '').length.toLocaleString()} 字</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-ink-100 bg-ink-50 flex-shrink-0">
          <div className="flex items-center gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-vermilion-100 border border-vermilion-200" />
              已删除
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-moss-100 border border-moss-200" />
              新增
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-xl hover:bg-ink-50 transition-colors"
            >
              关闭
            </button>
            <button
              onClick={onRestore}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-vermilion rounded-xl hover:bg-vermilion-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              恢复到此版本
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
