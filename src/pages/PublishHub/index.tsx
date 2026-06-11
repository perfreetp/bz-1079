import PreviewPanel from './PreviewPanel';
import ExportCenter from './ExportCenter';
import VersionTimeline from './VersionTimeline';
import CommentPanel from './CommentPanel';
import { Rocket } from 'lucide-react';

export default function PublishHub() {
  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-800 font-serif flex items-center gap-2">
            <Rocket className="w-6 h-6 text-vermilion-500" />
            发布协作
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            预览排版、管理版本、协作评论，一站式完成发布准备
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-160px)]">
          <div className="col-span-7 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <PreviewPanel />
            </div>
            <div className="h-[300px] shrink-0">
              <ExportCenter />
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <VersionTimeline />
            </div>
            <div className="flex-1 min-h-0">
              <CommentPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
