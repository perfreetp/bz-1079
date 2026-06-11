import { useState } from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, AlertCircle, SpellCheck, Copy, FileCheck, Check, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewIssue, IssueType, IssueSeverity } from '@/types';

const typeConfig: Record<IssueType, { label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string }> = {
  sensitive: { label: '敏感词', icon: AlertCircle, colorClass: 'text-vermilion-500 bg-vermilion-50' },
  typo: { label: '错别字', icon: SpellCheck, colorClass: 'text-gold-600 bg-gold-50' },
  duplicate: { label: '重复表达', icon: Copy, colorClass: 'text-ink-500 bg-ink-50' },
  compliance: { label: '广告合规', icon: FileCheck, colorClass: 'text-vermilion-600 bg-vermilion-50' },
};

const severityConfig: Record<IssueSeverity, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  high: { label: '高', icon: AlertOctagon, className: 'bg-vermilion-100 text-vermilion-600' },
  medium: { label: '中', icon: AlertTriangle, className: 'bg-gold-100 text-gold-600' },
  low: { label: '低', icon: ShieldCheck, className: 'bg-moss-100 text-moss-600' },
};

const severityOrder: Record<IssueSeverity, number> = { high: 0, medium: 1, low: 2 };

const allTypes: (IssueType | 'all')[] = ['all', 'sensitive', 'typo', 'duplicate', 'compliance'];
const allSeverities: (IssueSeverity | 'all')[] = ['all', 'high', 'medium', 'low'];

type FilterMode = 'unresolved' | 'all';

interface IssueListProps {
  issues: ReviewIssue[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
}

export default function IssueList({ issues, onAccept, onIgnore }: IssueListProps) {
  const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');
  const [filterMode, setFilterMode] = useState<FilterMode>('unresolved');

  const filteredIssues = issues
    .filter((issue) => {
      if (filterMode === 'unresolved' && issue.resolved) return false;
      if (typeFilter !== 'all' && issue.type !== typeFilter) return false;
      if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const aOrder = a.resolved ? 1 : 0;
      const bOrder = b.resolved ? 1 : 0;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  const unresolvedCount = issues.filter((i) => !i.resolved).length;

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif">问题列表</h3>
        <span className="text-xs text-ink-400">共 {unresolvedCount} 条待处理</span>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative">
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-paper-100 text-ink-600 rounded-lg border-0 focus:ring-2 focus:ring-vermilion/20 focus:outline-none cursor-pointer"
          >
            <option value="unresolved">仅未处理</option>
            <option value="all">全部问题</option>
          </select>
          <ChevronDown className="w-3 h-3 text-ink-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as IssueType | 'all')}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-paper-100 text-ink-600 rounded-lg border-0 focus:ring-2 focus:ring-vermilion/20 focus:outline-none cursor-pointer"
          >
            <option value="all">全部类型</option>
            {allTypes.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t}>{typeConfig[t as IssueType].label}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-ink-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as IssueSeverity | 'all')}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-paper-100 text-ink-600 rounded-lg border-0 focus:ring-2 focus:ring-vermilion/20 focus:outline-none cursor-pointer"
          >
            <option value="all">全部程度</option>
            {allSeverities.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s}>{severityConfig[s as IssueSeverity].label}风险</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-ink-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {filteredIssues.map((issue) => {
          const typeInfo = typeConfig[issue.type];
          const severityInfo = severityConfig[issue.severity];
          const TypeIcon = typeInfo.icon;
          const SeverityIcon = severityInfo.icon;
          const isAccepted = issue.resolved && issue.resolvedType === 'accepted';
          const isIgnored = issue.resolved && issue.resolvedType === 'ignored';

          return (
            <div
              key={issue.id}
              className={cn(
                'rounded-xl border p-4 transition-all',
                isAccepted && 'bg-moss-50/50 border-moss-200 opacity-60',
                isIgnored && 'bg-paper-100 border-paper-200 opacity-50',
                !issue.resolved && 'bg-paper border-paper-200 hover:border-vermilion-200 hover:shadow-paper-hover'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', typeInfo.colorClass)}>
                  <TypeIcon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-ink-600">{typeInfo.label}</span>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', severityInfo.className)}>
                      <SeverityIcon className="w-3 h-3" />
                      {severityInfo.label}
                    </span>
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-moss-100 text-moss-600">
                        <Check className="w-3 h-3" />
                        已接受
                      </span>
                    )}
                    {isIgnored && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-ink-100 text-ink-500">
                        <X className="w-3 h-3" />
                        已忽略
                      </span>
                    )}
                  </div>

                  <div className={cn(
                    'px-3 py-2 rounded-lg mb-2',
                    isAccepted && 'bg-moss-50 line-through decoration-moss-400',
                    isIgnored && 'bg-paper-50 line-through decoration-ink-300',
                    !issue.resolved && 'bg-vermilion-50'
                  )}>
                    <p className={cn(
                      'text-sm',
                      !issue.resolved && 'text-vermilion-700 line-through decoration-vermilion-400',
                      isAccepted && 'text-moss-700',
                      isIgnored && 'text-ink-500'
                    )}>
                      {issue.originalText}
                    </p>
                  </div>

                  {issue.suggestion && (
                    <div className={cn(
                      'flex items-start gap-2',
                      isIgnored && 'opacity-50'
                    )}>
                      <span className="text-xs text-moss-500 shrink-0 mt-0.5">建议：</span>
                      <p className={cn(
                        'text-sm',
                        isAccepted ? 'text-moss-700 font-medium bg-moss-50 px-2 py-1 rounded' : 'text-moss-600 font-medium'
                      )}>{issue.suggestion}</p>
                    </div>
                  )}

                  {!issue.resolved && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onAccept(issue.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-vermilion text-white text-xs font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        接受
                      </button>
                      <button
                        onClick={() => onIgnore(issue.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-paper-100 text-ink-500 text-xs font-medium rounded-lg hover:bg-paper-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        忽略
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <FileCheck className="w-12 h-12 text-moss-400 mx-auto mb-3" />
            <p className="text-sm text-ink-500">暂无待处理问题</p>
          </div>
        )}
      </div>
    </div>
  );
}
