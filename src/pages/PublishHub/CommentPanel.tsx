import { useState } from 'react';
import { MessageSquare, Send, Reply, CheckCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Comment } from '@/types';

interface CommentItem extends Comment {
  replies?: CommentItem[];
}

const mockComments: CommentItem[] = [
  {
    id: 'c001',
    articleId: 'a001',
    content: '第二部分的案例数据需要更新一下，最新的行业报告已经出来了。',
    author: '李编辑',
    status: 'resolved',
    createdAt: '2026-06-09 11:20',
    replies: [
      {
        id: 'c001-r1',
        articleId: 'a001',
        content: '好的，我已经替换成了2026年Q1的数据。',
        author: '张三',
        status: 'resolved',
        createdAt: '2026-06-09 14:30',
      },
    ],
  },
  {
    id: 'c002',
    articleId: 'a001',
    content: '开头的引言部分可以再凝练一些，现在有点长了，建议控制在300字以内。',
    author: '王主编',
    status: 'open',
    createdAt: '2026-06-10 09:15',
  },
  {
    id: 'c003',
    articleId: 'a001',
    paragraphRef: 'p3',
    content: '这里提到的"注意力经济"概念，是否需要加个注释说明一下来源？',
    author: '李编辑',
    status: 'open',
    createdAt: '2026-06-10 10:45',
    replies: [
      {
        id: 'c003-r1',
        articleId: 'a001',
        content: '同意，建议引用 Davenport 的那篇经典论文。',
        author: '王主编',
        status: 'open',
        createdAt: '2026-06-10 11:00',
      },
    ],
  },
];

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

interface CommentCardProps {
  comment: CommentItem;
  isReply?: boolean;
  onResolve: (id: string) => void;
  onReply: (id: string) => void;
}

function CommentCard({ comment, isReply, onResolve, onReply }: CommentCardProps) {
  const isResolved = comment.status === 'resolved';

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
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-medium', isResolved ? 'text-ink-400' : 'text-ink-700')}>
                {comment.author}
              </span>
              <span className="text-xs text-ink-300">{comment.createdAt}</span>
              {isResolved && (
                <span className="flex items-center gap-0.5 text-[10px] text-moss-500 bg-moss-50 px-1.5 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3" />
                  已解决
                </span>
              )}
            </div>
            <p className={cn('text-sm mt-1 leading-relaxed', isResolved ? 'text-ink-400' : 'text-ink-600')}>
              {comment.content}
            </p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentPanel() {
  const [comments, setComments] = useState<CommentItem[]>(mockComments);
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newComment: CommentItem = {
      id: `c-new-${Date.now()}`,
      articleId: 'a001',
      content: inputValue,
      author: '我',
      status: 'open',
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\//g, '-'),
    };

    if (replyingTo) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      );
      setReplyingTo(null);
    } else {
      setComments((prev) => [newComment, ...prev]);
    }
    setInputValue('');
  };

  const handleResolve = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) return { ...c, status: 'resolved' as const };
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === id ? { ...r, status: 'resolved' as const } : r
            ),
          };
        }
        return c;
      })
    );
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
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onResolve={handleResolve}
            onReply={(id) => setReplyingTo(id)}
          />
        ))}
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
