import { useEffect, useState } from 'react';
import { X, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArticleStore } from '@/store/articleStore';
import StatusBadge from './StatusBadge';

interface ArticleSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (articleId: string) => void;
  defaultSelectedId?: string | null;
  title?: string;
  confirmText?: string;
  children?: React.ReactNode;
}

export default function ArticleSelectorModal({
  open,
  onClose,
  onSelect,
  defaultSelectedId,
  title = '选择目标文章',
  confirmText = '确认插入',
  children,
}: ArticleSelectorModalProps) {
  const { articles, lastEditedArticleId } = useArticleStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const availableArticles = articles.filter(
    (a) => a.status === 'writing' || a.status === 'outline' || a.status === 'topic'
  );

  useEffect(() => {
    if (open) {
      const fallbackId = defaultSelectedId || lastEditedArticleId;
      if (fallbackId && availableArticles.some((a) => a.id === fallbackId)) {
        setSelectedId(fallbackId);
      } else if (availableArticles.length > 0) {
        setSelectedId(availableArticles[0].id);
      } else {
        setSelectedId(null);
      }
    }
  }, [open, defaultSelectedId, lastEditedArticleId, availableArticles]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-paper rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-paper-200 shrink-0">
          <h3 className="text-lg font-bold text-ink-800 font-serif">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
          >
            <X className="w-5 h-5 text-ink-400" />
          </button>
        </div>

        {children && (
          <div className="p-5 border-b border-paper-200 shrink-0">
            {children}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-xs text-ink-500 mb-3">
            可选文章（写作中/大纲中/选题中）
          </p>
          <div className="space-y-2">
            {availableArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedId(article.id)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all',
                  selectedId === article.id
                    ? 'border-vermilion bg-vermilion-50/50'
                    : 'border-paper-200 bg-paper hover:border-paper-300 hover:bg-paper-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                      selectedId === article.id
                        ? 'border-vermilion bg-vermilion'
                        : 'border-paper-300'
                    )}
                  >
                    {selectedId === article.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-ink-800 line-clamp-1">
                        {article.title}
                      </h4>
                      {article.id === lastEditedArticleId && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">
                          <Clock className="w-3 h-3" />
                          最近编辑
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusBadge status={article.status} className="text-xs" />
                      <span className="text-xs text-ink-400">·</span>
                      <span className="text-xs text-ink-500">{article.topic}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {availableArticles.length === 0 && (
              <div className="py-12 text-center text-ink-400 text-sm">
                暂无可选文章
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-paper-200 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-paper-100 text-ink-600 rounded-lg hover:bg-paper-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={cn(
              'px-4 py-2 text-sm rounded-lg transition-colors',
              selectedId
                ? 'bg-vermilion text-white hover:bg-vermilion-600'
                : 'bg-paper-200 text-ink-400 cursor-not-allowed'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
