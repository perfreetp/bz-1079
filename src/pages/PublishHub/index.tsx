import { useState } from 'react';
import PreviewPanel from './PreviewPanel';
import ExportCenter from './ExportCenter';
import VersionTimeline from './VersionTimeline';
import CommentPanel from './CommentPanel';
import { Rocket, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArticleStore } from '@/store/articleStore';
import type { Comment } from '@/types';

const DEFAULT_ARTICLE_ID = 'a003';

const DEMO_CONTENT = `在信息爆炸的今天，用户的注意力成为最稀缺的资源。品牌营销正在经历一场深刻的变革——从广撒网的粗放式投放，转向精耕细作的注意力经营。

"注意力是最稀缺的资源，谁能赢得用户的注意力，谁就能赢得未来。" ——凯文·凯利

一、内容即入口：好内容自带流量
用户不再被动接受广告，而是主动选择内容。优质的原创内容，正在成为品牌与用户建立连接的第一触点。

二、场景即触达：在对的时间说对的话
移动互联网时代，用户的注意力碎片化分布在不同场景中。品牌需要深入理解用户行为路径，在恰当的场景下传递恰当的信息。

三、情感即连接：从交易到关系
冷冰冰的功能诉求已经无法打动用户。真正能够留下深刻印象的，是那些能够引发情感共鸣的品牌故事。

四、私域即复利：经营长期关系
私域运营的核心不是收割存量，而是经营关系。通过持续的价值输出，与用户建立信任，才能获得长期的复利回报。

结语
在注意力经济时代，赢得用户的注意力只是起点。真正的考验在于，能否将这份注意力转化为持久的信任和共鸣。`;

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className =
    'fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-ink-800 text-white px-5 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function buildWechatFormattedText(title: string, content: string): string {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const lines: string[] = [`【${title}】`, ''];

  paragraphs.forEach((para) => {
    const trimmed = para.trim();
    const headingMatch = trimmed.match(/^([一二三四五六七八九十]+、|\d+\.\s)/);
    if (headingMatch && trimmed.length < 50) {
      lines.push('');
      lines.push(`◆ ${trimmed}`);
      lines.push('');
    } else if (trimmed.startsWith('"') || trimmed.startsWith('"')) {
      lines.push('');
      lines.push(`" ${trimmed.slice(1, -1)} "`);
      lines.push('');
    } else if (trimmed.startsWith('结语')) {
      lines.push('');
      lines.push(`— ${trimmed} —`);
    } else {
      lines.push(`  ${trimmed}`);
    }
  });

  lines.push('');
  lines.push('——————————————');
  lines.push('内容由墨金内容协作平台生成');
  return lines.join('\n');
}

function buildWechatFormattedHtml(title: string, content: string): string {
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  const bodyParts: string[] = [];

  bodyParts.push(`<h1 style="font-size:22px;font-weight:bold;color:#1a1a1a;margin-bottom:20px;line-height:1.4;">${title}</h1>`);

  paragraphs.forEach((para) => {
    const trimmed = para.trim();
    const headingMatch = trimmed.match(/^([一二三四五六七八九十]+、|\d+\.\s)/);
    if (headingMatch && trimmed.length < 50) {
      bodyParts.push(`<h2 style="font-size:18px;font-weight:bold;color:#333;margin:24px 0 12px;padding-left:10px;border-left:4px solid #eb5757;">${trimmed}</h2>`);
    } else if (trimmed.startsWith('"') || trimmed.startsWith('"')) {
      bodyParts.push(`<blockquote style="margin:16px 0;padding:12px 16px;background:#fef7f0;border-radius:6px;border-left:3px solid #f59e0b;color:#78716c;font-style:italic;">${trimmed}</blockquote>`);
    } else {
      bodyParts.push(`<p style="font-size:15px;color:#374151;line-height:1.8;margin:12px 0;text-indent:2em;">${trimmed}</p>`);
    }
  });

  bodyParts.push(`<p style="margin-top:24px;padding-top:12px;border-top:1px dashed #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;">内容由墨金内容协作平台生成</p>`);

  return bodyParts.join('');
}

export default function PublishHub() {
  const [copied, setCopied] = useState(false);

  const {
    saveVersion,
    getVersionsByArticleId,
    getArticleById,
    addComment,
    resolveComment,
    addReply,
    getCommentsByArticleId,
  } = useArticleStore();

  const article = getArticleById(DEFAULT_ARTICLE_ID);
  const versions = getVersionsByArticleId(DEFAULT_ARTICLE_ID);
  const comments = getCommentsByArticleId(DEFAULT_ARTICLE_ID);

  const articleTitle = article?.title || '未命名文章';
  const articleContent = DEMO_CONTENT;

  const handleSaveVersion = (note: string) => {
    saveVersion(DEFAULT_ARTICLE_ID, note, '当前用户', articleContent);
    showToast('版本保存成功');
  };

  const handleCopyWechat = async () => {
    const plainText = buildWechatFormattedText(articleTitle, articleContent);
    const htmlText = buildWechatFormattedHtml(articleTitle, articleContent);

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const clipboardItem = new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([htmlText], { type: 'text/html' }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = plainText;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showToast('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('复制失败，请手动复制');
    }
  };

  const handleAddComment = (content: string, author: string) => {
    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      articleId: DEFAULT_ARTICLE_ID,
      content,
      author,
      avatar: author.charAt(0),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    addComment(newComment);
    showToast('评论已发送');
  };

  const handleAddReply = (parentId: string, content: string, author: string) => {
    const reply: Comment = {
      id: `cm-${Date.now()}`,
      articleId: DEFAULT_ARTICLE_ID,
      content,
      author,
      avatar: author.charAt(0),
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    addReply(parentId, reply);
    showToast('回复已发送');
  };

  const handleResolveComment = (id: string) => {
    resolveComment(id);
    showToast('已标记为已解决');
  };

  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-800 font-serif flex items-center gap-2">
              <Rocket className="w-6 h-6 text-vermilion-500" />
              发布协作
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              预览排版、管理版本、协作评论，一站式完成发布准备
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-paper rounded-xl px-4 py-2 border border-paper-200">
              <div className="text-xs text-ink-400">当前文章</div>
              <div className="text-sm font-medium text-ink-700 truncate max-w-[280px]">
                {articleTitle}
              </div>
            </div>
            <button
              onClick={handleCopyWechat}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all',
                copied
                  ? 'bg-moss-500 text-white hover:bg-moss-600'
                  : 'bg-vermilion-500 text-white hover:bg-vermilion-600 shadow-lg shadow-vermilion-200 hover:shadow-xl hover:shadow-vermilion-300 hover:-translate-y-0.5'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  一键复制公众号格式
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
          <div className="col-span-7 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <PreviewPanel />
            </div>
            <div className="h-[320px] shrink-0">
              <ExportCenter
                articleTitle={articleTitle}
                articleContent={articleContent}
                onCopyWechat={handleCopyWechat}
                copied={copied}
              />
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <VersionTimeline versions={versions} onSaveVersion={handleSaveVersion} />
            </div>
            <div className="flex-1 min-h-0">
              <CommentPanel
                comments={comments}
                articleId={DEFAULT_ARTICLE_ID}
                onAddComment={handleAddComment}
                onAddReply={handleAddReply}
                onResolve={handleResolveComment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
