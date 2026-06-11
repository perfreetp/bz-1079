import { RefreshCw, AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import ProgressBar from '@/components/ui/ProgressBar';
import type { IssueType, IssueSeverity } from '@/types';

const typeLabels: Record<IssueType, string> = {
  sensitive: '敏感词',
  typo: '错别字',
  duplicate: '重复表达',
  compliance: '广告合规',
};

const typeColors: Record<IssueType, 'vermilion' | 'moss' | 'gold' | 'ink'> = {
  sensitive: 'vermilion',
  typo: 'gold',
  duplicate: 'ink',
  compliance: 'vermilion',
};

const severityConfig: Record<IssueSeverity, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  high: { label: '高风险', icon: AlertOctagon, className: 'bg-vermilion-100 text-vermilion-600 border-vermilion-200' },
  medium: { label: '中风险', icon: AlertTriangle, className: 'bg-gold-100 text-gold-600 border-gold-200' },
  low: { label: '低风险', icon: ShieldCheck, className: 'bg-moss-100 text-moss-600 border-moss-200' },
};

interface ReviewSummaryProps {
  totalIssues: number;
  resolvedCount: number;
  unresolvedCount: number;
  typeStats: Record<IssueType, number>;
  overallRisk: IssueSeverity;
}

export default function ReviewSummary({
  totalIssues,
  resolvedCount,
  unresolvedCount,
  typeStats,
  overallRisk,
}: ReviewSummaryProps) {
  const { showToast } = useToast();

  const maxTypeCount = Math.max(...Object.values(typeStats), 1);
  const riskInfo = severityConfig[overallRisk];
  const RiskIcon = riskInfo.icon;

  const handleRetest = () => {
    showToast('已重新检测，内容扫描中...', 'info');
  };

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">检测概览</h3>
          <p className="text-xs text-ink-400 mt-0.5">基于 AI 智能检测</p>
        </div>
        <button
          onClick={handleRetest}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ink-600 bg-paper-100 rounded-lg hover:bg-paper-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重新检测
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1">
          <div className="text-4xl font-bold text-ink-800 font-serif leading-none">
            {unresolvedCount}
          </div>
          <div className="text-xs text-ink-400 mt-1">待处理问题</div>
          <div className="text-xs text-ink-300 mt-0.5">
            共 {totalIssues} 处，已处理 {resolvedCount} 处
          </div>
        </div>
        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium', riskInfo.className)}>
          <RiskIcon className="w-4 h-4" />
          {riskInfo.label}
        </div>
      </div>

      <div className="space-y-3.5">
        {(Object.keys(typeLabels) as IssueType[]).map((type) => (
          <div key={type}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-ink-600 font-medium">{typeLabels[type]}</span>
              <span className="text-ink-400">{typeStats[type]} 处</span>
            </div>
            <ProgressBar
              value={typeStats[type]}
              max={maxTypeCount}
              color={typeColors[type]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
