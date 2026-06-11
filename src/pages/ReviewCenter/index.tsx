import ReviewSummary from './ReviewSummary';
import IssueList from './IssueList';
import DiffViewer from './DiffViewer';

export default function ReviewCenter() {
  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-800 font-serif">内容审核</h1>
          <p className="text-sm text-ink-400 mt-1">智能检测敏感词、错别字、重复表达与广告合规问题</p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5 space-y-4">
            <ReviewSummary />
            <IssueList />
          </div>
          <div className="col-span-7">
            <DiffViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
