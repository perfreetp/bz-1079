import { useState } from 'react';
import { MessageSquare, Send, CheckCircle, User, Square, CheckSquare, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Comment } from '@/types';

interface DraftCommentsProps {
  comments: Comment[];
  articleId: string;
  selectedText: string;
  onAddComment: (comment: Comment) => void;
  onResolveComment: (id: string) => void;
  onToggleTodo: (id: string) => void;
}

type FilterType = 'all' | 'open' | 'resolved';

function getInitial(name: string) {
  return name.charAt(0);
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-vermilion-100 text-vermilion-600',
    'bg-gold-100 text-gold-600',
    'bg-moss-100 text-moss-600',
    'bg-ink-100 text-ink-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d} ${h}:${min}`;
}

export default function DraftComments({
  comments,
  articleId,
  selectedText,
  onAddComment,
  onResolveComment,
  onToggleTodo,
}: DraftCommentsProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTodo, setIsTodo] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showInput, setShowInput] = useState(false);
  const [quoteText, setQuoteText] = useState('');

  const filteredComments = comments.filter((c) => {
    if (filter === 'open') return c.status === 'open';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const openCount = comments.filter((c) => c.status === 'open').length;
  const resolvedCount = comments.filter((c) => c.status === 'resolved').length;

  const handleOpenComment = () => {
    const quote = selectedText || '';
    setQuoteText(quote);
    setShowInput(true);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      articleId,
      paragraphRef: quoteText || undefined,
      content: inputValue.trim(),
      author: '我',
      avatar: '我',
      status: 'open',
      type: isTodo ? 'todo' : 'comment',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddComment(newComment);
    setInputValue('');
    setIsTodo(false);
    setQuoteText('');
    setShowInput(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-vermilion" />
            <h3 className="text-sm font-semibold text-ink-800">协作评论</h3>
            <span className="text-[10px] px-1.5 py-0.5 bg-ink-100 text-ink-500 rounded-full">
              {openCount} 待处理
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-ink-400" />
          {([
            { key: 'all' as FilterType, label: '全部' },
            { key: 'open' as FilterType, label: `待处理` },
            { key: 'resolved' as FilterType, label: `已解决` },
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'text-xs px-2 py-1 rounded-md transition-colors',
                filter === f.key
                  ? 'bg-vermilion-50 text-vermilion font-medium'
                  : 'text-ink-400 hover:text-ink-600 hover:bg-ink-50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400">
            <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">暂无评论</p>
            <p className="text-xs mt-1">选中文字后点击评论按钮</p>
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isResolved = comment.status === 'resolved';
            const isTodoItem = comment.type === 'todo';

            return (
              <div
                key={comment.id}
                className={cn(
                  'rounded-xl border p-3 transition-all',
                  isResolved
                    ? 'opacity-50 border-ink-100 bg-ink-50'
                    : 'border-ink-100 bg-white'
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium',
                    getAvatarColor(comment.author)
                  )}>
                    {getInitial(comment.author)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs font-medium', isResolved ? 'text-ink-400' : 'text-ink-700')}>
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-ink-300">{formatTime(comment.createdAt)}</span>
                      {isResolved && (
                        <span className="flex items-center gap-0.5 text-[10px] text-moss-500 bg-moss-50 px-1.5 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" />
                          已解决
                        </span>
                      )}
                      {isTodoItem && !isResolved && (
                        <span className="text-[10px] text-gold-600 bg-gold-50 px-1.5 py-0.5 rounded">待办</span>
                      )}
                    </div>

                    {comment.paragraphRef && (
                      <div className="mb-1.5 px-2.5 py-1.5 bg-ink-50 border-l-2 border-ink-200 rounded-r text-xs text-ink-500 line-clamp-2 italic">
                        「{comment.paragraphRef}」
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      {isTodoItem && (
                        <button
                          onClick={() => onToggleTodo(comment.id)}
                          className="mt-0.5 shrink-0"
                        >
                          {comment.completed ? (
                            <CheckSquare className="w-4 h-4 text-moss-500" />
                          ) : (
                            <Square className="w-4 h-4 text-ink-300" />
                          )}
                        </button>
                      )}
                      <p className={cn(
                        'text-sm leading-relaxed',
                        isResolved ? 'text-ink-400 line-through' : 'text-ink-600',
                        isTodoItem && comment.completed && 'line-through text-ink-400'
                      )}>
                        {comment.content}
                      </p>
                    </div>

                    {!isResolved && (
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => onResolveComment(comment.id)}
                          className="flex items-center gap-1 text-[11px] text-ink-400 hover:text-moss-500 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          标记已解决
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-ink-100 p-3">
        {showInput ? (
          <div className="space-y-2">
            {quoteText && (
              <div className="px-2.5 py-1.5 bg-vermilion-50 border-l-2 border-vermilion-200 rounded-r text-xs text-vermilion-600 line-clamp-2 italic">
                「{quoteText}」
              </div>
            )}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
              }}
              placeholder="输入评论，Ctrl+Enter 发送..."
              className="w-full resize-none rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:outline-none focus:border-vermilion-300 focus:ring-1 focus:ring-vermilion-50 transition-all"
              rows={2}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTodo}
                  onChange={(e) => setIsTodo(e.target.checked)}
                  className="w-3.5 h-3.5 text-vermilion rounded border-ink-300"
                />
                <span className="text-xs text-ink-500">标记为待办</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowInput(false);
                    setInputValue('');
                    setQuoteText('');
                    setIsTodo(false);
                  }}
                  className="text-xs text-ink-400 hover:text-ink-600"
                >
                  取消
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-vermilion text-white text-xs font-medium rounded-lg hover:bg-vermilion-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3 h-3" />
                  发送
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleOpenComment}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-lg transition-colors',
              selectedText
                ? 'bg-vermilion text-white hover:bg-vermilion-600'
                : 'bg-ink-50 text-ink-400 hover:bg-ink-100 hover:text-ink-600'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            {selectedText ? '评论选中文字' : '添加评论'}
          </button>
        )}
      </div>
    </div>
  );
}
