import { useState } from 'react';
import { MessageSquare, Send, Reply, CheckCircle, User, Square, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Comment } from '@/types';

interface CommentItem extends Comment {
  replies?: CommentItem[];
}

interface CommentPanelProps {
  comments: Comment[];
  articleId: string;
  onAddComment: (content: string, author: string) => void;
  onAddReply: (parentId: string, content: string, author: string) => void;
  onResolve: (id: string) => void;
  onToggleTodo?: (id: string) => void;
}

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

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

interface CommentCardProps {
  comment: CommentItem;
  isReply?: boolean;
  onResolve: (id: string) => void;
  onReply: (id: string) => void;
  onToggleTodo?: (id: string) => void;
}

function CommentCard({ comment, isReply, onResolve, onReply, onToggleTodo }: CommentCardProps) {
  const isResolved = comment.status === 'resolved';
  const isTodoItem = comment.type === 'todo';

  return (
    <div className={cn(isReply && 'ml-10 mt-2')}>
      <div
        className={cn(
          'rounded-xl p-3 transition-all',
          isResolved ? 'opacity-50' : 'bg-paper-50'
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              getAvatarColor(comment.author)
            )}
          >
            <User className="w-4 h-4" />
            <span className="sr-only">{getInitial(comment.author)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('text-sm font-medium', isResolved ? 'text-ink-400' : 'text-ink-700')}>
                {comment.author}
              </span>
              <span className="text-xs text-ink-300">{formatDate(comment.createdAt)}</span>
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
              <div className="mt-1.5 px-2.5 py-1.5 bg-paper-100 border-l-2 border-ink-200 rounded-r text-xs text-ink-500 line-clamp-2 italic">
                「{comment.paragraphRef}」
              </div>
            )}

            <div className="flex items-start gap-2 mt-1">
              {isTodoItem && onToggleTodo && (
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
                isResolved ? 'text-ink-400' : 'text-ink-600',
                isTodoItem && comment.completed && 'line-through text-ink-400'
              )}>
                {comment.content}
              </p>
            </div>

            {!isReply && !isResolved && (
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center gap-1 text-xs text-ink-400 hover:text-vermilion-500 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  回复
                </button>
                <button
                  onClick={() => onResolve(comment.id)}
                  className="flex items-center gap-1 text-xs text-ink-400 hover:text-moss-500 transition-colors"
                >
                  <CheckCircle className="w-3 h-3" />
                  标记已解决
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              isReply
              onResolve={onResolve}
              onReply={onReply}
              onToggleTodo={onToggleTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentPanel({
  comments,
  articleId,
  onAddComment,
  onAddReply,
  onResolve,
  onToggleTodo,
}: CommentPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const displayComments: CommentItem[] = [...comments].sort((a, b) => {
    const aOpen = a.status === 'open' ? 0 : 1;
    const bOpen = b.status === 'open' ? 0 : 1;
    if (aOpen !== bOpen) return aOpen - bOpen;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (replyingTo) {
      onAddReply(replyingTo, inputValue.trim(), '我');
      setReplyingTo(null);
    } else {
      onAddComment(inputValue.trim(), '我');
    }
    setInputValue('');
  };

  const openCount = comments.filter((c) => c.status === 'open').length;

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-vermilion-500" />
          协作评论
          <span className="text-xs font-normal text-ink-400">({openCount} 待处理)</span>
        </h3>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto -mx-1 mb-4">
        {displayComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400 text-sm">
            <MessageSquare className="w-12 h-12 mb-2 opacity-30" />
            <p>暂无评论</p>
            <p className="text-xs mt-1">在下方输入框添加第一条评论</p>
          </div>
        ) : (
          displayComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onResolve={onResolve}
              onReply={(id) => setReplyingTo(id)}
              onToggleTodo={onToggleTodo}
            />
          ))
        )}
      </div>

      <div className="border-t border-paper-200 pt-3">
        {replyingTo && (
          <div className="flex items-center justify-between mb-2 text-xs text-ink-500 bg-paper-100 px-3 py-1.5 rounded-lg">
            <span>正在回复评论...</span>
            <button onClick={() => setReplyingTo(null)} className="hover:text-vermilion-500">
              取消
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
            }}
            placeholder="输入评论，Ctrl+Enter 发送..."
            className="flex-1 resize-none rounded-xl border border-paper-200 bg-paper-50 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:outline-none focus:border-vermilion-300 focus:ring-2 focus:ring-vermilion-50 transition-all"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex items-center justify-center gap-1.5 px-4 bg-vermilion-500 text-white text-sm font-medium rounded-xl hover:bg-vermilion-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end h-[42px]"
          >
            <Send className="w-4 h-4" />
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
