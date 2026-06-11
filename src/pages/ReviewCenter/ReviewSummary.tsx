import { RefreshCw, AlertTriangle, ShieldCheck, AlertOctagon, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import ProgressBar from '@/components/ui/ProgressBar';
import type { IssueType } from '@/types';

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

interface TypeStat {
  total: number;
  unresolved: number;
}

interface ReviewSummaryProps {
  totalIssues: number;
  acceptedCount: number;
  ignoredCount: number;
  unresolvedCount: number;
  typeStats: Record<IssueType, TypeStat>;
  unresolvedHighCount: number;
}

export default function ReviewSummary({
  totalIssues,
  acceptedCount,
  ignoredCount,
  unresolvedCount,
  typeStats,
  unresolvedHighCount,
}: ReviewSummaryProps) {
  const { showToast } = useToast();

  let riskLabel: string;
  let RiskIcon: React.ComponentType<{ className?: string }>;
  let riskClassName: string;

  if (unresolvedCount === 0) {
    riskLabel = '无风险';
    RiskIcon = Shield;
    riskClassName = 'bg-moss-100 text-moss-600 border-moss-200';
  } else if (unresolvedHighCount > 0) {
    riskLabel = '高风险';
    RiskIcon = AlertOctagon;
    riskClassName = 'bg-vermilion-100 text-vermilion-600 border-vermilion-200';
  } else if (unresolvedCount > 3) {
    riskLabel = '中风险';
    RiskIcon = AlertTriangle;
    riskClassName = 'bg-gold-100 text-gold-600 border-gold-200';
  } else {
    riskLabel = '低风险';
    RiskIcon = ShieldCheck;
    riskClassName = 'bg-moss-100 text-moss-600 border-moss-200';
  }

  const handleRetest = () => {
    showToast('已重新检测，按已处理状态保留结果，内容扫描中...', 'info');
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

      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-paper-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-ink-800 font-serif leading-none">
            {totalIssues}
          </div>
          <div className="text-xs text-ink-400 mt-1 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            问题总数
          </div>
        </div>
        <div className="bg-moss-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-moss-700 font-serif leading-none">
            {acceptedCount}
          </div>
          <div className="text-xs text-moss-500 mt-1 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" />
            已接受
          </div>
        </div>
        <div className="bg-ink-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-ink-600 font-serif leading-none">
            {ignoredCount}
          </div>
          <div className="text-xs text-ink-400 mt-1 flex items-center justify-center gap-1">
            <XCircle className="w-3 h-3" />
            已忽略
          </div>
        </div>
        <div className="bg-vermilion-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-vermilion-700 font-serif leading-none">
            {unresolvedCount}
          </div>
          <div className="text-xs text-vermilion-500 mt-1 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            待处理
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="text-xs text-ink-400">综合风险评估</div>
        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium', riskClassName)}>
          <RiskIcon className="w-4 h-4" />
          {riskLabel}
        </div>
      </div>

      <div className="space-y-3.5">
        {(Object.keys(typeLabels) as IssueType[]).map((type) => {
          const stat = typeStats[type];
          const progress = stat.total > 0 ? (stat.unresolved / stat.total) * 100 : 0;
          return (
            <div key={type}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-ink-600 font-medium">{typeLabels[type]}</span>
                <span className="text-ink-400">
                  待处理 {stat.unresolved} / 共 {stat.total} 处
                </span>
              </div>
              <ProgressBar
                value={progress}
                max={100}
                color={typeColors[type]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
