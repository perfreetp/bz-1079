import { useEffect } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArticleStore } from '@/store/articleStore';

interface InsertSuccessModalProps {
  open: boolean;
  onClose: () => void;
  articleId: string;
  message?: string;
}

export default function InsertSuccessModal({
  open,
  onClose,
  articleId,
  message = '已成功插入',
}: InsertSuccessModalProps) {
  const { getArticleById } = useArticleStore();
  const navigate = useNavigate();
  const article = getArticleById(articleId);

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

  const handleGoToWrite = () => {
    navigate(`/write/${articleId}`);
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
      <div className="bg-paper rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-paper-200">
          <h3 className="text-lg font-bold text-ink-800 font-serif">插入成功</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
          >
            <X className="w-5 h-5 text-ink-400" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-moss-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-moss-600" />
          </div>
          <p className="text-sm text-ink-600 mb-2">{message}</p>
          {article && (
            <p className="text-base font-semibold text-ink-800">
              《{article.title}》
            </p>
          )}
        </div>

        <div className="p-5 border-t border-paper-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-paper-100 text-ink-600 rounded-lg hover:bg-paper-200 transition-colors"
          >
            留在素材页
          </button>
          <button
            onClick={handleGoToWrite}
            className="px-4 py-2 text-sm bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors inline-flex items-center gap-1.5"
          >
            前往写作页
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
