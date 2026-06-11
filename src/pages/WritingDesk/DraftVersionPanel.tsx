import { useState } from 'react';
import { GitBranch, Eye, RotateCcw, X, Clock, FileText, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DraftVersion, DraftVersionSource } from '@/types';
import { formatRelativeTime } from '@/utils/date';

interface DraftVersionPanelProps {
  versions: DraftVersion[];
  currentContent: string;
  onView: (version: DraftVersion) => void;
  onRestore: (version: DraftVersion) => void;
  onClose: () => void;
}

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

export default function DraftVersionPanel({
  versions,
  currentContent,
  onView,
  onRestore,
  onClose,
}: DraftVersionPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const currentWordCount = currentContent.replace(/\s/g, '').length;

  const isCurrentVersion = (version: DraftVersion) => {
    return version.content === currentContent;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-vermilion" />
          <h3 className="text-base font-semibold text-ink-800">版本历史</h3>
          <span className="text-xs text-ink-400">({versions.length})</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400">
            <GitBranch className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无版本记录</p>
            <p className="text-xs mt-1">保存草稿时可创建版本</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => {
              const isCurrent = isCurrentVersion(version);
              const isHovered = hoveredId === version.id;
              const source = version.source || 'manual';

              return (
                <div
                  key={version.id}
                  className={cn(
                    'relative rounded-xl border transition-all cursor-pointer',
                    isCurrent
                      ? 'bg-vermilion-50 border-vermilion-200'
                      : 'bg-white border-ink-100 hover:border-ink-200 hover:shadow-sm'
                  )}
                  onMouseEnter={() => setHoveredId(version.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onView(version)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-sm font-semibold text-ink-800">
                            第 {version.versionNumber} 版
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-vermilion text-white font-medium">
                              当前
                            </span>
                          )}
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded font-medium',
                              sourceColors[source]
                            )}
                          >
                            {sourceLabels[source]}
                          </span>
                        </div>

                        <p className="text-sm text-ink-600 line-clamp-2 mb-2">
                          {version.note || '无备注'}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-ink-400">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {version.wordCount.toLocaleString()} 字
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(version.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div
                        className={cn(
                          'flex items-center gap-1 transition-all shrink-0',
                          isHovered && !isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-500 hover:text-ink-700 transition-colors"
                          title="查看对比"
                          onClick={() => onView(version)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!isCurrent && (
                          <button
                            className="p-1.5 rounded-lg hover:bg-vermilion-50 text-ink-500 hover:text-vermilion transition-colors"
                            title="恢复到此版本"
                            onClick={() => onRestore(version)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="absolute -top-1 -right-1">
                      <Tag className="w-4 h-4 text-vermilion fill-vermilion" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-ink-100 bg-ink-50">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>当前正文字数</span>
          <span className="font-medium text-ink-700">
            {currentWordCount.toLocaleString()} 字
          </span>
        </div>
      </div>
    </div>
  );
}
