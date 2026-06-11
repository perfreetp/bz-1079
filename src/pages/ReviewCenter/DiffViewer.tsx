import { CheckSquare, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewIssue } from '@/types';

interface DiffSegment {
  text: string;
  isHighlight?: boolean;
  issue?: ReviewIssue;
}

const originalContent = `在2026年这个注意力稀缺的时代，品牌营销正在经历前所未有的变革。

一、私域运营的核心方法论

私域运营的核心是用户运营，用户运营的核心是私域运营。我们发现，最有效的私域运营方法，是建立与用户之间的长期信任关系。墨笔作为一款国家级权威认证的AI写作工具，正在帮助越来越多的内容创作者实现降本增效。

二、用户洞察与内容策略

根据我们对用户的年年龄分布分析发现，25-35岁的年轻群体是内容消费的主力军。他们追求高品质内容，同时也希望内容能够带来情感共鸣。

做号准备，我们需要从以下几个维度入手：
1. 明确内容定位和目标受众
2. 建立稳定的内容更新机制
3. 积极与用户互动，建立情感连接

三、结语

在这个内容为王的时代，只有真正关注用户需求，才能在激烈的竞争中脱颖而出。`;

function buildSegments(content: string, issues: ReviewIssue[]): DiffSegment[] {
  const sortedIssues = [...issues].sort((a, b) => a.position - b.position);
  const segments: DiffSegment[] = [];
  let cursor = 0;

  for (const issue of sortedIssues) {
    if (issue.position > cursor) {
      segments.push({ text: content.slice(cursor, issue.position) });
    }
    segments.push({ text: issue.originalText, isHighlight: true, issue });
    cursor = issue.position + issue.originalText.length;
  }

  if (cursor < content.length) {
    segments.push({ text: content.slice(cursor) });
  }

  return segments;
}

function buildModifiedContent(content: string, issues: ReviewIssue[], useAllAccepted: boolean): string {
  const issuesToApply = useAllAccepted
    ? issues
    : issues.filter((i) => i.resolved && i.resolvedType === 'accepted');
  const sortedIssues = [...issuesToApply].sort((a, b) => b.position - a.position);
  let result = content;

  for (const issue of sortedIssues) {
    if (issue.suggestion) {
      result =
        result.slice(0, issue.position) +
        issue.suggestion +
        result.slice(issue.position + issue.originalText.length);
    }
  }

  return result;
}

interface DiffViewerProps {
  issues: ReviewIssue[];
  onAcceptAll: () => void;
  articleTitle?: string;
}

export default function DiffViewer({ issues, onAcceptAll, articleTitle }: DiffViewerProps) {
  const unresolvedIssues = issues.filter((i) => !i.resolved);
  const allAccepted = unresolvedIssues.length === 0 && issues.length > 0;
  const segments = buildSegments(originalContent, unresolvedIssues);
  const modifiedContent = buildModifiedContent(originalContent, issues, allAccepted);

  const displayTitle = articleTitle || '2026品牌营销趋势：谁能赢得用户注意力，谁就赢得未来';

  return (
    <div className="bg-paper rounded-2xl shadow-paper overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-vermilion-500" />
          <h3 className="text-base font-bold text-ink-800 font-serif">原文对照</h3>
        </div>
        <button
          onClick={onAcceptAll}
          disabled={allAccepted || unresolvedIssues.length === 0}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            allAccepted || unresolvedIssues.length === 0
              ? 'bg-moss-100 text-moss-600 cursor-default'
              : 'bg-vermilion text-white hover:bg-vermilion-600'
          )}
        >
          <CheckSquare className="w-4 h-4" />
          {allAccepted ? '已全部接受' : '一键接受所有修改'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 divide-x divide-paper-200 overflow-hidden">
        <div className="flex flex-col min-h-0">
          <div className="px-5 py-2.5 bg-paper-50 border-b border-paper-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vermilion-400" />
            <span className="text-xs font-medium text-ink-500">原文</span>
            <span className="text-xs text-ink-300 ml-auto">共 {unresolvedIssues.length} 处问题</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <article className="prose prose-sm max-w-none">
              <h1 className="text-lg font-bold text-ink-800 font-serif mb-4 text-center">
                {displayTitle}
              </h1>
              <div className="space-y-3 text-sm leading-relaxed text-ink-700">
                {segments.map((segment, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'whitespace-pre-wrap',
                      segment.isHighlight &&
                        'bg-vermilion-100 text-vermilion-700 line-through decoration-vermilion-400 px-0.5 rounded'
                    )}
                  >
                    {segment.text}
                  </span>
                ))}
              </div>
              {unresolvedIssues.length > 0 && (
                <div className="mt-5 pt-4 border-t border-paper-200 space-y-2">
                  <p className="text-xs font-medium text-ink-500 mb-2">待处理建议：</p>
                  {unresolvedIssues.map((issue) => (
                    <div key={issue.id} className="flex items-start gap-2 p-2 rounded-lg bg-moss-50/70 border border-moss-100">
                      <span className="text-xs text-vermilion-600 shrink-0 mt-0.5 font-medium bg-vermilion-50 px-1.5 py-0.5 rounded">
                        原文
                      </span>
                      <span className="text-xs text-vermilion-700 line-through decoration-vermilion-400 flex-1">
                        {issue.originalText}
                      </span>
                      <span className="text-xs text-moss-600 shrink-0 mt-0.5 font-medium bg-moss-100 px-1.5 py-0.5 rounded">
                        建议
                      </span>
                      <span className="text-xs text-moss-700 font-medium flex-1 bg-moss-100/50 px-1.5 py-0.5 rounded">
                        {issue.suggestion || issue.originalText}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <div className="px-5 py-2.5 bg-paper-50 border-b border-paper-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-moss-500" />
            <span className="text-xs font-medium text-ink-500">修改建议</span>
            {allAccepted && (
              <span className="text-xs text-moss-500 ml-auto flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                已应用
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <article className="prose prose-sm max-w-none">
              <h1 className="text-lg font-bold text-ink-800 font-serif mb-4 text-center">
                {displayTitle}
              </h1>
              <div className={cn(
                'space-y-3 text-sm leading-relaxed whitespace-pre-wrap',
                allAccepted ? 'text-moss-700 bg-moss-50/30 p-3 rounded-lg' : 'text-ink-700'
              )}>
                {modifiedContent}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
