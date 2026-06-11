import type { AIOperation } from '@/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/date';
import {
  Type,
  Maximize2,
  Quote,
  Sparkles,
  Undo2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface AIOperationHistoryProps {
  operations: AIOperation[];
  onJumpTo: (position: number) => void;
  onUndo: (opId: string) => void;
  onUndoLatest: () => void;
}

const operationIcons: Record<AIOperation['type'], React.ReactNode> = {
  tone: <Type className="w-4 h-4" />,
  expand: <Maximize2 className="w-4 h-4" />,
  golden: <Quote className="w-4 h-4" />,
  polish: <Sparkles className="w-4 h-4" />,
};

const operationColors: Record<AIOperation['type'], string> = {
  tone: 'bg-ink-100 text-ink-600',
  expand: 'bg-moss-50 text-moss-600',
  golden: 'bg-gold-50 text-gold-600',
  polish: 'bg-vermilion-50 text-vermilion',
};

export default function AIOperationHistory({
  operations,
  onJumpTo,
  onUndo,
  onUndoLatest,
}: AIOperationHistoryProps) {
  const sortedOps = [...operations].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const latestOp = sortedOps[0];

  return (
    <div className="px-5 pb-5 border-t border-ink-100">
      <div className="flex items-center gap-2 py-4">
        <div className="w-8 h-8 bg-ink-100 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-ink-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-ink-800">最近 AI 操作</h2>
          <p className="text-xs text-ink-400">可快速定位与撤销</p>
        </div>
      </div>

      {sortedOps.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-12 h-12 bg-ink-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-ink-300" />
          </div>
          <p className="text-sm text-ink-400">暂无 AI 操作记录</p>
        </div>
      ) : (
        <>
          <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
            {sortedOps.map((op, index) => {
              const isLatest = index === 0;
              return (
                <div
                  key={op.id}
                  onClick={() => onJumpTo(op.position)}
                  className={cn(
                    'group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all',
                    isLatest
                      ? 'bg-vermilion-50/70 border border-vermilion-200/60'
                      : 'hover:bg-ink-50 border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isLatest ? operationColors[op.type] : 'bg-ink-100 text-ink-400'
                    )}
                  >
                    {operationIcons[op.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-sm font-medium truncate',
                        isLatest ? 'text-ink-800' : 'text-ink-500'
                      )}
                    >
                      {op.label}
                    </div>
                    <div className="text-[11px] text-ink-400 flex items-center gap-1">
                      {isLatest ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-vermilion rounded-full animate-pulse" />
                          <span className="text-vermilion">最新操作</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>已应用</span>
                        </>
                      )}
                      <span className="mx-1">·</span>
                      <span>{formatRelativeTime(op.timestamp)}</span>
                    </div>
                  </div>
                  {isLatest ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUndo(op.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-vermilion bg-white rounded-lg border border-vermilion-200 hover:bg-vermilion hover:text-white transition-colors opacity-100"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      撤销
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpTo(op.position);
                      }}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-ink-500 bg-white rounded border border-ink-200 hover:bg-ink-100 transition-all"
                    >
                      定位
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {latestOp && (
            <button
              onClick={onUndoLatest}
              className="w-full mt-3 py-2.5 text-sm font-medium text-white bg-vermilion rounded-xl hover:bg-vermilion-400 transition-colors flex items-center justify-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              撤销最近一次 AI 改动
            </button>
          )}
        </>
      )}
    </div>
  );
}
