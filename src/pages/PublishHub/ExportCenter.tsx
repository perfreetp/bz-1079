import { FileText, FileCode, FileSpreadsheet, FileType, Check, Download } from 'lucide-react';
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

interface ExportCenterProps {
  articleTitle: string;
  articleContent: string;
  onCopyWechat?: () => void;
  copied?: boolean;
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

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className =
    'fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-ink-800 text-white px-5 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim() || '未命名文章';
}

function contentToMarkdown(title: string, content: string): string {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const mdParts: string[] = [`# ${title}\n`];

  paragraphs.forEach((para) => {
    const trimmed = para.trim();
    const headingMatch = trimmed.match(/^([一二三四五六七八九十]+、|\d+\.\s)/);
    if (headingMatch && trimmed.length < 50) {
      mdParts.push(`\n## ${trimmed}\n`);
    } else {
      mdParts.push(trimmed);
    }
  });

  return mdParts.join('\n\n') + '\n';
}

function contentToWechatHtml(title: string, content: string): string {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const bodyParts: string[] = [];

  paragraphs.forEach((para) => {
    const trimmed = para.trim();
    const headingMatch = trimmed.match(/^([一二三四五六七八九十]+、|\d+\.\s)/);
    if (headingMatch && trimmed.length < 50) {
      bodyParts.push(`<h2 style="font-size: 20px; font-weight: bold; color: #1a1a1a; margin: 28px 0 16px; padding-left: 12px; border-left: 4px solid #eb5757; line-height: 1.5;">${trimmed}</h2>`);
    } else if (trimmed.startsWith('"') || trimmed.startsWith('"')) {
      bodyParts.push(`<blockquote style="margin: 20px 0; padding: 16px 20px; background: #fef7f0; border-radius: 8px; border-left: 3px solid #f59e0b; color: #78716c; font-style: italic; line-height: 1.8;">${trimmed}</blockquote>`);
    } else {
      bodyParts.push(`<p style="font-size: 16px; color: #374151; line-height: 1.9; margin: 16px 0; text-indent: 2em; letter-spacing: 0.5px;">${trimmed}</p>`);
    }
  });

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
      background: linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .wechat-container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    }
    .wechat-header {
      padding: 32px 28px 24px;
      border-bottom: 1px solid #f5f5f4;
      background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%);
    }
    .wechat-title {
      font-size: 24px;
      font-weight: bold;
      color: #1c1917;
      line-height: 1.4;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .wechat-meta {
      font-size: 13px;
      color: #a8a29e;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .wechat-body {
      padding: 28px;
    }
    .wechat-footer {
      padding: 20px 28px;
      border-top: 1px solid #f5f5f4;
      text-align: center;
      font-size: 12px;
      color: #a8a29e;
      background: #fafaf9;
    }
  </style>
</head>
<body>
  <div class="wechat-container">
    <div class="wechat-header">
      <h1 class="wechat-title">${title}</h1>
      <div class="wechat-meta">
        <span>墨金内容平台</span>
        <span>·</span>
        <span>${new Date().toLocaleDateString('zh-CN')}</span>
      </div>
    </div>
    <div class="wechat-body">
      ${bodyParts.join('\n      ')}
    </div>
    <div class="wechat-footer">
      内容由墨金内容协作平台生成 · 仅供预览使用
    </div>
  </div>
</body>
</html>`;
}

function contentToPdfDemo(title: string, content: string): string {
  const date = new Date().toLocaleDateString('zh-CN');
  return `========================================
           ${title}
========================================

生成时间: ${date}
文档格式: PDF (演示版)
字数统计: ${content.length} 字

----------------------------------------

${content.split(/\n\n+/).filter(p => p.trim()).join('\n\n')}

----------------------------------------

【声明】这是一个演示版PDF文件，使用文本格式模拟。
如需生成正式PDF，请接入专业PDF渲染库。

========================================
                    © 墨金内容平台
========================================
`;
}

function contentToWordDemo(title: string, content: string): string {
  const date = new Date().toLocaleDateString('zh-CN');
  return `${title}\r\n\r\n` +
    `生成时间：${date}\r\n` +
    `文档格式：Microsoft Word (演示版)\r\n` +
    `字数统计：${content.length} 字\r\n` +
    `\r\n---\r\n\r\n` +
    content.split(/\n\n+/).filter(p => p.trim()).join('\r\n\r\n') +
    `\r\n\r\n---\r\n\r\n` +
    `【声明】这是一个演示版Word文件，使用纯文本格式模拟。\r\n` +
    `如需生成正式.docx，请接入专业Office文档库。\r\n\r\n` +
    `© 墨金内容平台`;
}

export default function ExportCenter({ articleTitle, articleContent, onCopyWechat, copied }: ExportCenterProps) {
  const [internalCopied, setInternalCopied] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const isCopied = copied !== undefined ? copied : internalCopied;

  const handleCopyWechat = () => {
    if (onCopyWechat) {
      onCopyWechat();
    } else {
      setInternalCopied(true);
      setTimeout(() => setInternalCopied(false), 2000);
    }
  };

  const handleExport = (format: ExportFormat) => {
    const safeTitle = sanitizeFilename(articleTitle);
    setExporting(format);

    switch (format) {
      case 'markdown': {
        const mdContent = contentToMarkdown(articleTitle, articleContent);
        downloadBlob(mdContent, `${safeTitle}.md`, 'text/markdown;charset=utf-8');
        setTimeout(() => setExporting(null), 500);
        showToast('Markdown 导出成功');
        break;
      }

      case 'html': {
        const htmlContent = contentToWechatHtml(articleTitle, articleContent);
        downloadBlob(htmlContent, `${safeTitle}.html`, 'text/html;charset=utf-8');
        setTimeout(() => setExporting(null), 500);
        showToast('HTML 导出成功');
        break;
      }

      case 'pdf': {
        showToast('正在生成 PDF...');
        setTimeout(() => {
          const pdfContent = contentToPdfDemo(articleTitle, articleContent);
          downloadBlob(pdfContent, `${safeTitle}.txt`, 'text/plain;charset=utf-8');
          setExporting(null);
          showToast('PDF 已下载（演示版）');
        }, 2000);
        break;
      }

      case 'word': {
        showToast('正在生成 Word...');
        setTimeout(() => {
          const wordContent = contentToWordDemo(articleTitle, articleContent);
          downloadBlob(wordContent, `${safeTitle}.txt`, 'text/plain;charset=utf-8');
          setExporting(null);
          showToast('Word 已下载（演示版）');
        }, 2000);
        break;
      }
    }
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
          isCopied
            ? 'bg-moss-500 hover:bg-moss-600'
            : 'bg-vermilion-500 hover:bg-vermilion-600 shadow-lg shadow-vermilion-200 hover:shadow-xl hover:shadow-vermilion-300 hover:-translate-y-0.5'
        )}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4" />
            已复制到剪贴板
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            一键复制公众号格式
          </>
        )}
      </button>
    </div>
  );
}
