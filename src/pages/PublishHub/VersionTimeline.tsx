import { useState, useRef, useEffect } from 'react';
import { GitBranch, Plus, GitCompare, RotateCcw, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Version, VersionSource } from '@/types';

type VersionType = 'draft' | 'review' | 'major' | 'minor';

interface VersionNode extends Version {
  type: VersionType;
  isCurrent?: boolean;
}

interface VersionTimelineProps {
  versions: Version[];
  onSaveVersion: (note: string) => void;
}

const typeConfig: Record<VersionType, { color: string; bg: string; label: string }> = {
  draft: { color: 'text-ink-400', bg: 'bg-ink-200', label: '草稿' },
  minor: { color: 'text-gold-500', bg: 'bg-gold-300', label: '修订' },
  review: { color: 'text-moss-500', bg: 'bg-moss-300', label: '审核' },
  major: { color: 'text-vermilion-500', bg: 'bg-vermilion-400', label: '主版本' },
};

const sourceConfig: Record<VersionSource, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  manual: { label: '手动保存', bg: 'bg-ink-100', text: 'text-ink-600', icon: CheckCircle2 },
  review_apply: { label: '审核应用', bg: 'bg-moss-100', text: 'text-moss-700', icon: ShieldCheck },
  auto_save: { label: '自动保存', bg: 'bg-gold-100', text: 'text-gold-700', icon: CheckCircle2 },
};

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

function getVersionType(versionNumber: number, total: number, index: number): VersionType {
  if (index === 0) return 'major';
  if (versionNumber <= 1) return 'draft';
  if (index < total / 2) return 'review';
  return 'minor';
}

export default function VersionTimeline({ versions, onSaveVersion }: VersionTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const timelineRef = useRef<HTMLDivElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const displayVersions: VersionNode[] = versions.map((v, index) => ({
    ...v,
    type: getVersionType(v.versionNumber, versions.length, index),
    isCurrent: index === 0,
  }));

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = 0;
    }
  }, [versions.length]);

  const handleSave = () => {
    if (!note.trim()) return;
    onSaveVersion(note.trim());
    setNote('');
    setShowModal(false);
  };

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-vermilion-500" />
          版本时间线
          <span className="text-xs font-normal text-ink-400">({versions.length} 个版本)</span>
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-vermilion-500 text-white text-xs font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          保存新版本
        </button>
      </div>

      <div ref={timelineRef} className="flex-1 overflow-y-auto -mx-1">
        {displayVersions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400 text-sm">
            <GitBranch className="w-12 h-12 mb-2 opacity-30" />
            <p>暂无版本记录</p>
            <p className="text-xs mt-1">点击右上角保存第一个版本</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-1">
            <div className="absolute left-[11px] top-1 bottom-1 w-px bg-paper-300" />

            {displayVersions.map((version) => {
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
                        <div className="flex items-center gap-2 flex-wrap">
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
                          {version.source && sourceConfig[version.source] && (
                            <span
                              className={cn(
                                'inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-medium',
                                sourceConfig[version.source].bg,
                                sourceConfig[version.source].text
                              )}
                            >
                              {(() => {
                                const SourceIcon = sourceConfig[version.source].icon;
                                return <SourceIcon className="w-3 h-3" />;
                              })()}
                              {sourceConfig[version.source].label}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-ink-600 mt-1 line-clamp-2">{version.note}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-ink-400">
                          <span>{version.author}</span>
                          <span>·</span>
                          <span>{formatDate(version.createdAt)}</span>
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
            <div ref={listEndRef} />
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[400px] p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-ink-800 font-serif">保存新版本</h4>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-paper-100 text-ink-400 hover:text-ink-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">版本备注</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="请描述本次修改的内容..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-paper-200 bg-paper-50 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-300 focus:outline-none focus:border-vermilion-300 focus:ring-2 focus:ring-vermilion-50 transition-all"
                  autoFocus
                />
              </div>

              <div className="text-xs text-ink-400 bg-paper-50 rounded-lg p-3">
                <p>将基于当前文章内容创建新版本快照</p>
                <p className="mt-1">版本号将自动递增</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-ink-600 rounded-lg hover:bg-paper-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!note.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-vermilion-500 rounded-lg hover:bg-vermilion-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
