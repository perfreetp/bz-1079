import { useState } from 'react';
import { GitBranch, Plus, GitCompare, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Version } from '@/types';

type VersionType = 'draft' | 'review' | 'major' | 'minor';

interface VersionNode extends Version {
  type: VersionType;
  isCurrent?: boolean;
}

const mockVersions: VersionNode[] = [
  {
    id: 'v001',
    articleId: 'a001',
    versionNumber: 1,
    content: '',
    note: '创建初始版本',
    author: '张三',
    createdAt: '2026-06-08 10:00',
    type: 'draft',
  },
  {
    id: 'v002',
    articleId: 'a001',
    versionNumber: 2,
    content: '',
    note: '补充第二章节内容',
    author: '张三',
    createdAt: '2026-06-09 14:30',
    type: 'minor',
  },
  {
    id: 'v003',
    articleId: 'a001',
    versionNumber: 3,
    content: '',
    note: '提交审核版本',
    author: '张三',
    createdAt: '2026-06-10 09:15',
    type: 'review',
  },
  {
    id: 'v004',
    articleId: 'a001',
    versionNumber: 4,
    content: '',
    note: '根据审核意见修改，调整结构',
    author: '李四',
    createdAt: '2026-06-10 16:45',
    type: 'major',
    isCurrent: true,
  },
];

const typeConfig: Record<VersionType, { color: string; bg: string; label: string }> = {
  draft: { color: 'text-ink-400', bg: 'bg-ink-200', label: '草稿' },
  minor: { color: 'text-gold-500', bg: 'bg-gold-300', label: '修订' },
  review: { color: 'text-moss-500', bg: 'bg-moss-300', label: '审核' },
  major: { color: 'text-vermilion-500', bg: 'bg-vermilion-400', label: '主版本' },
};

export default function VersionTimeline() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-vermilion-500" />
          版本时间线
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-vermilion-500 text-white text-xs font-medium rounded-lg hover:bg-vermilion-600 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          保存新版本
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-1">
        <div className="relative pl-6 space-y-1">
          <div className="absolute left-[11px] top-1 bottom-1 w-px bg-paper-300" />

          {mockVersions.map((version) => {
            const config = typeConfig[version.type];
            const isHovered = hoveredId === version.id;

            return (
              <div
                key={version.id}
                className="relative py-2 group"
                onMouseEnter={() => setHoveredId(version.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={cn(
                    'absolute -left-[19px] top-3.5 w-5 h-5 rounded-full border-2 border-paper flex items-center justify-center transition-all',
                    config.bg,
                    version.isCurrent && 'ring-2 ring-vermilion-200 ring-offset-2 ring-offset-paper scale-110'
                  )}
                >
                  {version.isCurrent && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>

                <div
                  className={cn(
                    'rounded-xl p-3 transition-all',
                    version.isCurrent ? 'bg-vermilion-50 border border-vermilion-100' : 'hover:bg-paper-100',
                    isHovered && !version.isCurrent && 'bg-paper-100'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-800">
                          v{version.versionNumber.toFixed(1)}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded font-medium',
                            config.bg,
                            'text-white'
                          )}
                        >
                          {config.label}
                        </span>
                        {version.isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-vermilion-500 text-white font-medium">
                            当前
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink-600 mt-1 line-clamp-1">{version.note}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-ink-400">
                        <span>{version.author}</span>
                        <span>·</span>
                        <span>{version.createdAt}</span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'flex items-center gap-1 transition-all shrink-0',
                        isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      )}
                    >
                      <button
                        className="p-1.5 rounded-lg hover:bg-paper-200 text-ink-500 hover:text-ink-700 transition-colors"
                        title="对比"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </button>
                      {!version.isCurrent && (
                        <button
                          className="p-1.5 rounded-lg hover:bg-paper-200 text-ink-500 hover:text-vermilion-500 transition-colors"
                          title="回退到此版本"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
