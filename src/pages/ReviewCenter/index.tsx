import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSummary from './ReviewSummary';
import IssueList from './IssueList';
import DiffViewer from './DiffViewer';
import { useArticleStore } from '@/store/articleStore';
import type { IssueType, IssueSeverity } from '@/types';

const DEFAULT_ARTICLE_ID = 'a003';

export default function ReviewCenter() {
  const { id } = useParams<{ id: string }>();
  const articleId = id || DEFAULT_ARTICLE_ID;

  const reviewIssues = useArticleStore((state) => state.reviewIssues);
  const resolveIssue = useArticleStore((state) => state.resolveIssue);
  const ignoreIssue = useArticleStore((state) => state.ignoreIssue);
  const acceptAllIssues = useArticleStore((state) => state.acceptAllIssues);
  const loadIssuesForArticle = useArticleStore((state) => state.loadIssuesForArticle);
  const getArticleById = useArticleStore((state) => state.getArticleById);

  useEffect(() => {
    loadIssuesForArticle(articleId);
  }, [articleId, loadIssuesForArticle]);

  const articleIssues = useMemo(
    () => reviewIssues.filter((i) => i.articleId === articleId),
    [reviewIssues, articleId]
  );

  const article = getArticleById(articleId);

  const totalIssues = articleIssues.length;
  const resolvedIssues = articleIssues.filter((i) => i.resolved);
  const unresolvedIssues = articleIssues.filter((i) => !i.resolved);
  const resolvedCount = resolvedIssues.length;
  const unresolvedCount = unresolvedIssues.length;

  const typeStats: Record<IssueType, number> = {
    sensitive: 0,
    typo: 0,
    duplicate: 0,
    compliance: 0,
  };
  unresolvedIssues.forEach((issue) => {
    typeStats[issue.type]++;
  });

  const hasHigh = unresolvedIssues.some((i) => i.severity === 'high');
  const hasMedium = unresolvedIssues.some((i) => i.severity === 'medium');
  const overallRisk: IssueSeverity = unresolvedIssues.length === 0
    ? 'low'
    : hasHigh
      ? 'high'
      : hasMedium
        ? 'medium'
        : 'low';

  const handleAccept = (issueId: string) => {
    resolveIssue(issueId);
  };

  const handleIgnore = (issueId: string) => {
    ignoreIssue(issueId);
  };

  const handleAcceptAll = () => {
    acceptAllIssues(articleId);
  };

  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-800 font-serif">内容审核</h1>
          <p className="text-sm text-ink-400 mt-1">
            智能检测敏感词、错别字、重复表达与广告合规问题
            {article && (
              <span className="ml-2 text-vermilion-500 font-medium">
                · {article.title}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5 space-y-4">
            <ReviewSummary
              totalIssues={totalIssues}
              resolvedCount={resolvedCount}
              unresolvedCount={unresolvedCount}
              typeStats={typeStats}
              overallRisk={overallRisk}
            />
            <IssueList
              issues={articleIssues}
              onAccept={handleAccept}
              onIgnore={handleIgnore}
            />
          </div>
          <div className="col-span-7">
            <DiffViewer
              issues={articleIssues}
              onAcceptAll={handleAcceptAll}
              articleTitle={article?.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
