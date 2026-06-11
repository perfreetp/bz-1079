import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReviewSummary from './ReviewSummary';
import IssueList from './IssueList';
import DiffViewer from './DiffViewer';
import { useArticleStore } from '@/store/articleStore';
import type { IssueType } from '@/types';

const DEFAULT_ARTICLE_ID = 'a003';

const SIMULATED_ARTICLE_CONTENT = `在私域流量精细化运营的大背景下，我们深入研究了品牌与用户之间建立长期信任关系的方法论体系。经过大量案例实践和数据验证，我们发现，最有效的私域运营方法，往往是从最基础的用户画像分析开始，逐步构建起完整的用户生命周期管理体系。这不仅仅是技术层面的升级，更是运营思维的深刻转变。

在用户洞察的深度挖掘环节，我们通过多维度数据交叉分析发现，用户的年年龄分布特征对于内容策略的制定具有至关重要的指导意义。不同年龄段的用户群体在内容偏好、消费习惯、互动方式等方面呈现出显著的差异化特征。这要求运营团队必须具备精准的人群分层能力，为不同群体量身定制专属的内容方案和沟通策略。

同时，在品牌背书建设方面，我们需要保持理性审慎的态度。很多团队热衷于宣称拥有国家级权威认证，却忽略了这些认证背后真正需要支撑的产品实力和服务品质。真正可持续的品牌信任，来源于日复一日的品质坚守和用户价值创造，而非华而不实的头衔和光环。这一点，值得每一位运营从业者深入思考。

关于运营方法论的底层逻辑，私域运营的核心是用户运营，用户运营的核心是私域运营，这种循环定义式的表述在业内颇为流行，但往往容易让团队陷入思维误区。我们需要跳出这种文字游戏，回归运营的本质：以用户价值为中心，通过持续优质的内容和真诚的服务，建立起超越交易关系的情感连接。

在团队执行层面，做号准备工作同样不容忽视。从内容定位、人设打造、发布节奏规划，到互动机制设计、数据监测体系搭建，每一个环节都需要精心策划、周密部署。只有前期准备工作做足做透，后续的运营执行才能游刃有余、事半功倍。希望每一位从业者都能沉下心来，在这些基础工作上下足功夫，为私域运营的长期成功奠定坚实基础。`;

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

  const { totalIssues, acceptedCount, ignoredCount, unresolvedCount, unresolvedHighCount } = useMemo(() => {
    const total = articleIssues.length;
    const accepted = articleIssues.filter((i) => i.resolved && i.resolvedType === 'accepted').length;
    const ignored = articleIssues.filter((i) => i.resolved && i.resolvedType === 'ignored').length;
    const unresolved = articleIssues.filter((i) => !i.resolved).length;
    const unresolvedHigh = articleIssues.filter((i) => !i.resolved && i.severity === 'high').length;
    return {
      totalIssues: total,
      acceptedCount: accepted,
      ignoredCount: ignored,
      unresolvedCount: unresolved,
      unresolvedHighCount: unresolvedHigh,
    };
  }, [articleIssues]);

  const typeStats = useMemo(() => {
    const stats: Record<IssueType, { total: number; unresolved: number }> = {
      sensitive: { total: 0, unresolved: 0 },
      typo: { total: 0, unresolved: 0 },
      duplicate: { total: 0, unresolved: 0 },
      compliance: { total: 0, unresolved: 0 },
    };
    articleIssues.forEach((issue) => {
      stats[issue.type].total++;
      if (!issue.resolved) {
        stats[issue.type].unresolved++;
      }
    });
    return stats;
  }, [articleIssues]);

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
              acceptedCount={acceptedCount}
              ignoredCount={ignoredCount}
              unresolvedCount={unresolvedCount}
              typeStats={typeStats}
              unresolvedHighCount={unresolvedHighCount}
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
              articleContent={SIMULATED_ARTICLE_CONTENT}
              articleId={articleId}
              onAcceptAll={handleAcceptAll}
              onAcceptOne={handleAccept}
              onIgnoreOne={handleIgnore}
              articleTitle={article?.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
