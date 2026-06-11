import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, Sparkles, Check, X, AlertCircle, Info, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { useArticleStore } from '@/store/articleStore';
import type { ReviewIssue, IssueType } from '@/types';

const typeLabels: Record<IssueType, string> = {
  sensitive: '敏感词',
  typo: '错别字',
  duplicate: '重复表达',
  compliance: '广告合规',
};

interface DiffSegment {
  text: string;
  issue?: ReviewIssue;
  isIssue: boolean;
}

interface ModifiedSegment {
  text: string;
  isReplaced?: boolean;
  isIgnored?: boolean;
  issue?: ReviewIssue;
  replacement?: string;
}

interface DiffViewerProps {
  issues: ReviewIssue[];
  articleContent: string;
  articleId: string;
  onAcceptAll: () => void;
  onAcceptOne: (id: string) => void;
  onIgnoreOne: (id: string) => void;
  articleTitle?: string;
}

export default function DiffViewer({
  issues,
  articleContent,
  articleId,
  onAcceptAll,
  onAcceptOne,
  onIgnoreOne,
  articleTitle,
}: DiffViewerProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const saveDraftVersion = useArticleStore((state) => state.saveDraftVersion);
  const getDraftContent = useArticleStore((state) => state.getDraftContent);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);

  const unresolvedCount = issues.filter((i) => !i.resolved).length;
  const acceptedCount = issues.filter((i) => i.resolved && i.resolvedType === 'accepted').length;
  const ignoredCount = issues.filter((i) => i.resolved && i.resolvedType === 'ignored').length;

  const originalSegments = useMemo<DiffSegment[]>(() => {
    const sortedIssues = [...issues].sort((a, b) => a.position - b.position);
    const segments: DiffSegment[] = [];
    let cursor = 0;

    for (const issue of sortedIssues) {
      if (issue.position > cursor) {
        segments.push({
          text: articleContent.slice(cursor, issue.position),
          isIssue: false,
        });
      }
      segments.push({
        text: issue.originalText,
        isIssue: true,
        issue,
      });
      cursor = issue.position + issue.originalText.length;
    }

    if (cursor < articleContent.length) {
      segments.push({
        text: articleContent.slice(cursor),
        isIssue: false,
      });
    }

    return segments;
  }, [issues, articleContent]);

  const modifiedSegments = useMemo<ModifiedSegment[]>(() => {
    const acceptedIssues = issues
      .filter((i) => i.resolved && i.resolvedType === 'accepted')
      .sort((a, b) => b.position - a.position);

    const ignoredIssues = issues.filter((i) => i.resolved && i.resolvedType === 'ignored');

    let resultContent = articleContent;
    const appliedReplacements: Map<number, { issue: ReviewIssue; replacement: string }> = new Map();

    for (const issue of acceptedIssues) {
      const replacement = issue.suggestion || issue.originalText;
      appliedReplacements.set(issue.position, { issue, replacement });
      resultContent =
        resultContent.slice(0, issue.position) +
        replacement +
        resultContent.slice(issue.position + issue.originalText.length);
    }

    const segments: ModifiedSegment[] = [];
    const allProcessedPositions = [...appliedReplacements.keys(), ...ignoredIssues.map((i) => i.position)].sort(
      (a, b) => a - b
    );

    let cursor = 0;
    let offset = 0;

    for (const pos of allProcessedPositions) {
      const adjustedPos = pos + offset;
      const accepted = appliedReplacements.get(pos);
      const ignored = ignoredIssues.find((i) => i.position === pos);

      if (accepted) {
        if (adjustedPos > cursor) {
          segments.push({ text: resultContent.slice(cursor, adjustedPos) });
        }
        segments.push({
          text: accepted.issue.originalText,
          isReplaced: true,
          issue: accepted.issue,
          replacement: accepted.replacement,
        });
        offset += accepted.replacement.length - accepted.issue.originalText.length;
        cursor = adjustedPos + accepted.replacement.length;
      } else if (ignored) {
        if (adjustedPos > cursor) {
          segments.push({ text: resultContent.slice(cursor, adjustedPos) });
        }
        segments.push({
          text: ignored.originalText,
          isIgnored: true,
          issue: ignored,
        });
        cursor = adjustedPos + ignored.originalText.length;
      }
    }

    if (cursor < resultContent.length) {
      segments.push({ text: resultContent.slice(cursor) });
    }

    return segments;
  }, [issues, articleContent]);

  const displayTitle = articleTitle || '私域流量精细化运营实战指南';

  const handleConfirmAcceptAll = () => {
    onAcceptAll();
    setShowConfirm(false);
  };

  const handleApplyToDraft = () => {
    setShowApplyConfirm(true);
  };

  const handleConfirmApply = async () => {
    setIsApplying(true);

    try {
      const acceptedIssues = issues
        .filter((i) => i.resolved && i.resolvedType === 'accepted')
        .sort((a, b) => b.position - a.position);

      let originalContent = getDraftContent(articleId);
      if (!originalContent || originalContent.length === 0) {
        originalContent = articleContent;
      }

      let result = originalContent;
      for (const issue of acceptedIssues) {
        if (issue.position <= result.length) {
          result =
            result.slice(0, issue.position) +
            (issue.suggestion || issue.originalText) +
            result.slice(issue.position + issue.originalText.length);
        }
      }

      const note = `审核通过：已应用 ${acceptedCount} 处修改`;
      saveDraftVersion(articleId, result, note, 'review_apply');

      showToast('已应用审核修改，生成新草稿版本', 'success');
      setShowApplyConfirm(false);
    } catch (error) {
      showToast('应用失败，请重试', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleGoToWrite = () => {
    navigate(`/write/${articleId}`);
  };

  const getOriginalBadgeClass = (issue: ReviewIssue) => {
    if (issue.resolved && issue.resolvedType === 'accepted') {
      return 'bg-moss-100 text-moss-700 border-moss-200';
    }
    if (issue.resolved && issue.resolvedType === 'ignored') {
      return 'bg-ink-100 text-ink-500 border-ink-200';
    }
    return 'bg-vermilion-100 text-vermilion-700 border-vermilion-200';
  };

  const getOriginalBadgeText = (issue: ReviewIssue) => {
    if (issue.resolved && issue.resolvedType === 'accepted') return '已修正';
    if (issue.resolved && issue.resolvedType === 'ignored') return '已忽略';
    return '问题';
  };

  const getOriginalTextClass = (issue: ReviewIssue) => {
    if (issue.resolved && issue.resolvedType === 'accepted') {
      return 'bg-moss-50 text-moss-700 line-through decoration-moss-400/50 px-1 rounded';
    }
    if (issue.resolved && issue.resolvedType === 'ignored') {
      return 'bg-ink-50 text-ink-500 px-1 rounded border border-dashed border-ink-300';
    }
    return 'bg-vermilion-100 text-vermilion-700 line-through decoration-vermilion-400 px-1 rounded';
  };

  return (
    <div className="bg-paper rounded-2xl shadow-paper overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-vermilion-500" />
          <h3 className="text-base font-bold text-ink-800 font-serif">原文对照</h3>
        </div>
        <button
          onClick={() => unresolvedCount > 0 && setShowConfirm(true)}
          disabled={unresolvedCount === 0}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            unresolvedCount === 0
              ? 'bg-moss-100 text-moss-600 cursor-default'
              : 'bg-vermilion text-white hover:bg-vermilion-600'
          )}
        >
          <CheckSquare className="w-4 h-4" />
          {unresolvedCount === 0 ? '全部已处理完毕' : `一键接受 ${unresolvedCount} 处问题`}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 divide-x divide-paper-200 overflow-hidden">
        <div className="flex flex-col min-h-0">
          <div className="px-5 py-2.5 bg-paper-50 border-b border-paper-200 flex items-center gap-3 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-vermilion-400" />
            <span className="text-xs font-medium text-ink-500">原文</span>
            <div className="flex items-center gap-3 ml-auto text-xs">
              <span className="flex items-center gap-1 text-vermilion-600">
                <span className="w-2 h-2 rounded-full bg-vermilion-500" />
                待修正 {unresolvedCount}
              </span>
              <span className="flex items-center gap-1 text-moss-600">
                <span className="w-2 h-2 rounded-full bg-moss-500" />
                已接受 {acceptedCount}
              </span>
              <span className="flex items-center gap-1 text-ink-500">
                <span className="w-2 h-2 rounded-full bg-ink-400" />
                已忽略 {ignoredCount}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <article className="prose prose-sm max-w-none">
              <h1 className="text-lg font-bold text-ink-800 font-serif mb-4 text-center">
                {displayTitle}
              </h1>
              <div className="space-y-3 text-sm leading-relaxed text-ink-700">
                {originalSegments.map((segment, idx) =>
                  segment.isIssue && segment.issue ? (
                    <span
                      key={idx}
                      className="relative inline-block whitespace-pre-wrap"
                      onMouseEnter={() => setHoveredIssueId(segment.issue!.id)}
                      onMouseLeave={() => setHoveredIssueId(null)}
                    >
                      <span className={cn('relative inline-block', getOriginalTextClass(segment.issue))}>
                        {segment.text}
                        <span
                          className={cn(
                            'absolute -top-2 -right-1 text-[10px] px-1 py-0.5 rounded border transform scale-90 origin-top-right font-medium',
                            getOriginalBadgeClass(segment.issue)
                          )}
                        >
                          {getOriginalBadgeText(segment.issue)}
                        </span>
                      </span>
                      {hoveredIssueId === segment.issue.id && (
                        <div className="absolute z-20 top-full left-0 mt-2 w-72 bg-paper shadow-lg rounded-xl border border-paper-200 p-3 animate-in fade-in zoom-in-95 duration-100">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-3.5 h-3.5 text-vermilion-500" />
                            <span className="text-xs font-semibold text-ink-700">
                              {typeLabels[segment.issue.type]}
                            </span>
                            <span className="text-xs text-ink-400">· 位置 {segment.issue.position}</span>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div>
                              <p className="text-[11px] text-ink-400 mb-0.5">原文</p>
                              <p className="text-xs text-vermilion-700 line-through decoration-vermilion-400 bg-vermilion-50 px-2 py-1 rounded">
                                {segment.issue.originalText}
                              </p>
                            </div>
                            {segment.issue.suggestion && (
                              <div>
                                <p className="text-[11px] text-ink-400 mb-0.5">建议</p>
                                <p className="text-xs text-moss-700 font-medium bg-moss-50 px-2 py-1 rounded">
                                  {segment.issue.suggestion}
                                </p>
                              </div>
                            )}
                          </div>
                          {!segment.issue.resolved && (
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAcceptOne(segment.issue!.id);
                                }}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-vermilion text-white text-xs font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
                              >
                                <Check className="w-3 h-3" />
                                接受
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onIgnoreOne(segment.issue!.id);
                                }}
                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-paper-100 text-ink-500 text-xs font-medium rounded-lg hover:bg-paper-200 transition-colors"
                              >
                                <X className="w-3 h-3" />
                                忽略
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </span>
                  ) : (
                    <span key={idx} className="whitespace-pre-wrap">
                      {segment.text}
                    </span>
                  )
                )}
              </div>
            </article>
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <div className="px-5 py-2.5 bg-paper-50 border-b border-paper-200 flex items-center gap-3 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-moss-500" />
            <span className="text-xs font-medium text-ink-500">建议修改后</span>
            <div className="flex items-center gap-3 ml-auto text-xs">
              <span className="flex items-center gap-1 text-moss-600">
                <Check className="w-3 h-3" />
                已应用 {acceptedCount} 处修改
              </span>
              <span className="flex items-center gap-1 text-ink-500">
                <Info className="w-3 h-3" />
                保留 {ignoredCount} 处原文
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <article className="prose prose-sm max-w-none">
              <h1 className="text-lg font-bold text-ink-800 font-serif mb-4 text-center">
                {displayTitle}
              </h1>
              <div className="space-y-3 text-sm leading-relaxed text-ink-700">
                {modifiedSegments.map((segment, idx) => {
                  if (segment.isReplaced && segment.issue) {
                    return (
                      <span
                        key={idx}
                        className="relative inline-block whitespace-pre-wrap"
                        onMouseEnter={() => setHoveredIssueId(segment.issue!.id)}
                        onMouseLeave={() => setHoveredIssueId(null)}
                      >
                        <span className="bg-moss-100 text-moss-700 px-1 rounded font-medium relative inline-block">
                          {segment.replacement || segment.issue.suggestion || segment.text}
                          <span className="absolute -top-2 -right-1 text-[10px] px-1 py-0.5 rounded border bg-moss-100 text-moss-700 border-moss-200 transform scale-90 origin-top-right font-medium">
                            已接受
                          </span>
                        </span>
                        {hoveredIssueId === segment.issue.id && (
                          <div className="absolute z-20 top-full left-0 mt-2 w-72 bg-paper shadow-lg rounded-xl border border-paper-200 p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="w-3.5 h-3.5 text-moss-500" />
                              <span className="text-xs font-semibold text-moss-700">
                                已接受修正
                              </span>
                              <span className="text-xs text-ink-400">
                                · {typeLabels[segment.issue.type]}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-[11px] text-ink-400 mb-0.5">原词</p>
                                <p className="text-xs text-ink-500 line-through decoration-ink-300 bg-ink-50 px-2 py-1 rounded">
                                  {segment.issue.originalText}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-ink-400 mb-0.5">修正后</p>
                                <p className="text-xs text-moss-700 font-medium bg-moss-50 px-2 py-1 rounded">
                                  {segment.replacement || segment.issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </span>
                    );
                  }
                  if (segment.isIgnored && segment.issue) {
                    return (
                      <span
                        key={idx}
                        className="relative inline-block whitespace-pre-wrap"
                        onMouseEnter={() => setHoveredIssueId(segment.issue!.id)}
                        onMouseLeave={() => setHoveredIssueId(null)}
                      >
                        <span className="bg-ink-50 text-ink-500 px-0.5 rounded border border-dashed border-ink-300 italic relative inline-block">
                          {segment.text}
                          <span className="absolute -top-2 -right-1 text-[10px] px-1 py-0.5 rounded border bg-ink-100 text-ink-500 border-ink-200 transform scale-90 origin-top-right font-medium">
                            忽略保留
                          </span>
                        </span>
                        {hoveredIssueId === segment.issue.id && (
                          <div className="absolute z-20 top-full left-0 mt-2 w-72 bg-paper shadow-lg rounded-xl border border-paper-200 p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <X className="w-3.5 h-3.5 text-ink-400" />
                              <span className="text-xs font-semibold text-ink-500">
                                已忽略保留
                              </span>
                              <span className="text-xs text-ink-400">
                                · {typeLabels[segment.issue.type]}
                              </span>
                            </div>
                            <div>
                              <p className="text-[11px] text-ink-400 mb-0.5">保留原文</p>
                              <p className="text-xs text-ink-600 bg-ink-50 px-2 py-1 rounded italic">
                                {segment.text}
                              </p>
                            </div>
                          </div>
                        )}
                      </span>
                    );
                  }
                  return (
                    <span key={idx} className="whitespace-pre-wrap">
                      {segment.text}
                    </span>
                  );
                })}
              </div>
            </article>
          </div>
          <div className="px-5 py-4 border-t border-paper-200 bg-paper-50">
            <button
              onClick={handleApplyToDraft}
              disabled={acceptedCount === 0 || isApplying}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
                acceptedCount === 0 || isApplying
                  ? 'bg-ink-100 text-ink-400 cursor-not-allowed'
                  : 'bg-moss-600 text-white hover:bg-moss-700 shadow-moss-200 shadow-lg hover:shadow-xl'
              )}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  应用中...
                </>
              ) : acceptedCount === 0 ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  暂无已接受的修改
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" />
                  应用 {acceptedCount} 处修改到草稿
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-vermilion-100 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5 text-vermilion-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-ink-800">确认一键接受</h4>
                <p className="text-xs text-ink-500">将应用以下修改</p>
              </div>
            </div>
            <div className="bg-paper-50 rounded-xl p-4 mb-5 space-y-2">
              <p className="text-sm text-ink-600">
                即将接受 <span className="font-bold text-vermilion-600">{unresolvedCount}</span> 处未处理的问题。
              </p>
              <p className="text-xs text-ink-400">接受后将自动替换为建议内容，已忽略的问题保持不变。</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-ink-600 bg-paper-100 rounded-xl hover:bg-paper-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAcceptAll}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-vermilion rounded-xl hover:bg-vermilion-600 transition-colors"
              >
                确认接受
              </button>
            </div>
          </div>
        </div>
      )}

      {showApplyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-paper rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-moss-100 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5 text-moss-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-ink-800">应用到草稿</h4>
                <p className="text-xs text-ink-500">将生成新的草稿版本</p>
              </div>
            </div>
            <div className="bg-paper-50 rounded-xl p-4 mb-5 space-y-2">
              <p className="text-sm text-ink-600">
                即将把 <span className="font-bold text-moss-600">{acceptedCount}</span> 处已接受的修改应用到草稿。
              </p>
              <p className="text-xs text-ink-400">会生成一个新的草稿版本，你可以在写作页查看。</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyConfirm(false)}
                disabled={isApplying}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-ink-600 bg-paper-100 rounded-xl hover:bg-paper-200 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmApply}
                disabled={isApplying}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-moss-600 rounded-xl hover:bg-moss-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    应用中...
                  </>
                ) : (
                  <>
                    确认应用
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handleGoToWrite}
              className="w-full mt-3 text-xs text-moss-600 hover:text-moss-700 font-medium flex items-center justify-center gap-1 transition-colors"
            >
              前往写作页查看 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
