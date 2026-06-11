import { useState } from 'react';
import { Plus, Package, Megaphone, Ban, MessageSquare, Copy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { brandTerms as mockBrandTerms } from '@/data/materials';
import type { BrandTerm, BrandTermCategory } from '@/types';

const categories: { key: BrandTermCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', label: '全部', icon: Package },
  { key: 'product', label: '产品词', icon: Package },
  { key: 'slogan', label: 'Slogan', icon: Megaphone },
  { key: 'forbidden', label: '禁用词', icon: Ban },
  { key: 'preferred', label: '推荐话术', icon: MessageSquare },
];

const allTerms: BrandTerm[] = [
  ...mockBrandTerms,
  {
    id: 'bt-extra-1',
    term: '墨笔AI写作助手',
    category: 'product',
    isForbidden: false,
    description: '产品全称，首次出现使用',
  },
  {
    id: 'bt-extra-2',
    term: '极致',
    category: 'forbidden',
    replacement: '出色',
    isForbidden: true,
    description: '广告法禁用绝对化用语',
  },
  {
    id: 'bt-extra-3',
    term: '全球领先',
    category: 'forbidden',
    replacement: '行业前列',
    isForbidden: true,
    description: '广告法禁用夸大宣传用语',
  },
  {
    id: 'bt-extra-4',
    term: '让文字有力量',
    category: 'slogan',
    isForbidden: false,
    description: '副Slogan，可用于产品内页',
  },
  {
    id: 'bt-extra-5',
    term: '降本增效',
    category: 'preferred',
    isForbidden: false,
    description: '推荐话术：突出效率价值',
  },
  {
    id: 'bt-extra-6',
    term: '智能创作',
    category: 'preferred',
    isForbidden: false,
    description: '推荐话术：体现AI能力',
  },
];

export default function BrandTerms() {
  const [activeCategory, setActiveCategory] = useState<BrandTermCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTerms =
    activeCategory === 'all' ? allTerms : allTerms.filter((t) => t.category === activeCategory);

  const handleCopy = (id: string, term: string) => {
    navigator.clipboard?.writeText(term);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getCardBorderClass = (term: BrandTerm) => {
    if (term.isForbidden) return 'border-vermilion-300 bg-vermilion-50/30';
    if (term.category === 'preferred') return 'border-moss-300 bg-moss-50/30';
    return 'border-paper-200 bg-paper';
  };

  const getCategoryLabel = (category: BrandTermCategory) => {
    const map: Record<BrandTermCategory, string> = {
      product: '产品词',
      slogan: 'Slogan',
      forbidden: '禁用词',
      preferred: '推荐话术',
    };
    return map[category];
  };

  const getCategoryBadgeClass = (category: BrandTermCategory) => {
    if (category === 'forbidden') return 'bg-vermilion-100 text-vermilion-600';
    if (category === 'preferred') return 'bg-moss-100 text-moss-600';
    if (category === 'slogan') return 'bg-gold-100 text-gold-600';
    return 'bg-ink-100 text-ink-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">品牌词库</h3>
          <p className="text-xs text-ink-400 mt-0.5">共 {filteredTerms.length} 个词汇</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors">
          <Plus className="w-4 h-4" />
          添加词汇
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-40 shrink-0">
          <div className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                    isActive
                      ? 'bg-vermilion-50 text-vermilion-600'
                      : 'text-ink-500 hover:bg-paper-100 hover:text-ink-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  <span
                    className={cn(
                      'ml-auto text-xs px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-vermilion-100 text-vermilion-600' : 'bg-paper-200 text-ink-400'
                    )}
                  >
                    {cat.key === 'all'
                      ? allTerms.length
                      : allTerms.filter((t) => t.category === cat.key).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-3">
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                className={cn(
                  'rounded-xl border p-4 shadow-paper hover:shadow-paper-hover transition-all',
                  getCardBorderClass(term)
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={cn(
                          'text-base font-bold',
                          term.isForbidden ? 'text-vermilion-600 line-through' : 'text-ink-800'
                        )}
                      >
                        {term.term}
                      </h4>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                          getCategoryBadgeClass(term.category)
                        )}
                      >
                        {getCategoryLabel(term.category)}
                      </span>
                    </div>
                    {term.replacement && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm">
                        <span className="text-ink-400">替换建议：</span>
                        <ArrowRight className="w-3 h-3 text-moss-500" />
                        <span className="text-moss-600 font-medium">{term.replacement}</span>
                      </div>
                    )}
                    {term.description && (
                      <p className="text-xs text-ink-400 mt-2">{term.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(term.id, term.term)}
                    className={cn(
                      'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      copiedId === term.id
                        ? 'bg-moss-100 text-moss-600'
                        : term.isForbidden
                        ? 'bg-vermilion-100 text-vermilion-600 hover:bg-vermilion-200'
                        : 'bg-moss-100 text-moss-600 hover:bg-moss-200'
                    )}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
