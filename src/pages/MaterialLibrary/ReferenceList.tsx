import { useState } from 'react';
import { Plus, Link2, Quote, ExternalLink, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { materials } from '@/data/materials';
import TagPill from '@/components/ui/TagPill';

interface ReferenceItem {
  id: string;
  type: 'quote' | 'link';
  title: string;
  content: string;
  source?: string;
  tags: string[];
  quoteCount: number;
}

const references: ReferenceItem[] = [
  ...materials
    .filter((m) => m.type === 'quote' || m.type === 'link')
    .map((m, idx) => ({
      id: m.id,
      type: m.type as 'quote' | 'link',
      title: m.title,
      content: m.content,
      source: m.source,
      tags: m.tags,
      quoteCount: (idx + 1) * 3,
    })),
  {
    id: 'ref-extra-1',
    type: 'quote',
    title: '乔布斯关于设计的名言',
    content: '设计不仅仅是它看起来怎么样，感觉怎么样，设计是它怎么运作的。',
    source: '史蒂夫·乔布斯',
    tags: ['设计思维', '行业大咖'],
    quoteCount: 15,
  },
  {
    id: 'ref-extra-2',
    type: 'link',
    title: '中国内容营销白皮书2026',
    content: 'https://example.com/report/china-content-marketing-2026',
    source: '中国广告协会',
    tags: ['行业报告', '白皮书'],
    quoteCount: 8,
  },
  {
    id: 'ref-extra-3',
    type: 'quote',
    title: '关于长期主义',
    content: '真正的护城河，是你愿意花十年去做一件事情，而别人不愿意。',
    source: '贝佐斯',
    tags: ['商业思维', '长期主义'],
    quoteCount: 12,
  },
];

export default function ReferenceList() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">引用来源列表</h3>
          <p className="text-xs text-ink-400 mt-0.5">共 {references.length} 条引用</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors">
          <Plus className="w-4 h-4" />
          添加引用
        </button>
      </div>

      <div className="border border-paper-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-paper-100 border-b border-paper-200">
              <th className="text-left text-xs font-medium text-ink-500 px-4 py-3 w-12"></th>
              <th className="text-left text-xs font-medium text-ink-500 px-4 py-3">标题</th>
              <th className="text-left text-xs font-medium text-ink-500 px-4 py-3 w-48">来源链接</th>
              <th className="text-left text-xs font-medium text-ink-500 px-4 py-3 w-24">引用次数</th>
              <th className="text-left text-xs font-medium text-ink-500 px-4 py-3 w-32">操作</th>
            </tr>
          </thead>
          <tbody>
            {references.map((item, index) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-paper-100 hover:bg-paper-50 transition-colors',
                  index === references.length - 1 && 'border-b-0'
                )}
              >
                <td className="px-4 py-3">
                  {item.type === 'quote' ? (
                    <Quote className="w-4 h-4 text-gold-500" />
                  ) : (
                    <Link2 className="w-4 h-4 text-moss-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-sm text-ink-800 line-clamp-1">
                    {item.title}
                  </div>
                  {item.type === 'quote' && (
                    <p className="text-xs text-ink-500 mt-1 line-clamp-1 italic">
                      "{item.content}"
                    </p>
                  )}
                  <div className="flex gap-1.5 mt-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <TagPill key={tag} label={tag} variant="default" />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.source ? (
                    <div className="text-sm text-ink-600 flex items-center gap-1">
                      <span className="line-clamp-1">{item.source}</span>
                      {item.type === 'link' && (
                        <ExternalLink className="w-3 h-3 shrink-0 text-ink-400" />
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-ink-300">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-ink-700 font-medium">
                    {item.quoteCount} 次
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.id, item.content)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1',
                        copiedId === item.id
                          ? 'bg-moss-50 text-moss-600'
                          : 'bg-vermilion-50 text-vermilion-600 hover:bg-vermilion-100'
                      )}
                    >
                      {copiedId === item.id ? (
                        <>已复制</>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          插入引用
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
