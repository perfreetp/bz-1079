import { FileText, FileCode, FileSpreadsheet, FileType, Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ExportFormat = 'markdown' | 'html' | 'pdf' | 'word';

interface ExportCard {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const exportCards: ExportCard[] = [
  {
    format: 'markdown',
    label: 'Markdown',
    description: '通用轻量格式，适合技术博客与文档',
    icon: FileText,
    iconBg: 'bg-moss-50',
    iconColor: 'text-moss-500',
  },
  {
    format: 'html',
    label: 'HTML',
    description: '完整网页源码，可直接嵌入网站',
    icon: FileCode,
    iconBg: 'bg-gold-50',
    iconColor: 'text-gold-500',
  },
  {
    format: 'pdf',
    label: 'PDF',
    description: '打印友好，适合归档与分发',
    icon: FileSpreadsheet,
    iconBg: 'bg-vermilion-50',
    iconColor: 'text-vermilion-500',
  },
  {
    format: 'word',
    label: 'Word',
    description: 'Office 文档格式，便于二次编辑',
    icon: FileType,
    iconBg: 'bg-ink-50',
    iconColor: 'text-ink-500',
  },
];

export default function ExportCenter() {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleCopyWechat = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: ExportFormat) => {
    setExporting(format);
    setTimeout(() => setExporting(null), 1000);
  };

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif">导出中心</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {exportCards.map((card) => {
          const Icon = card.icon;
          const isExporting = exporting === card.format;

          return (
            <div
              key={card.format}
              className="rounded-xl border border-paper-200 bg-white p-3 hover:border-vermilion-200 hover:shadow-paper-hover transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={cn('p-2 rounded-lg', card.iconBg)}>
                  <Icon className={cn('w-5 h-5', card.iconColor)} />
                </div>
              </div>
              <div className="font-medium text-sm text-ink-800">{card.label}</div>
              <p className="text-[11px] text-ink-400 mt-0.5 leading-relaxed h-8">
                {card.description}
              </p>
              <button
                onClick={() => handleExport(card.format)}
                disabled={isExporting}
                className={cn(
                  'mt-3 w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-lg transition-all',
                  isExporting
                    ? 'bg-paper-100 text-ink-400'
                    : 'bg-paper-100 text-ink-600 hover:bg-vermilion-500 hover:text-white group-hover:bg-vermilion-500 group-hover:text-white'
                )}
              >
                <Download className="w-3 h-3" />
                {isExporting ? '导出中...' : '导出'}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleCopyWechat}
        className={cn(
          'mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium text-sm transition-all',
          copied
            ? 'bg-moss-500 hover:bg-moss-600'
            : 'bg-vermilion-500 hover:bg-vermilion-600 shadow-lg shadow-vermilion-200 hover:shadow-xl hover:shadow-vermilion-300 hover:-translate-y-0.5'
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            已复制到剪贴板
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            一键复制公众号格式
          </>
        )}
      </button>
    </div>
  );
}
