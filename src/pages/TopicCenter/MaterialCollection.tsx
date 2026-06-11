import { useState } from 'react';
import {
  Image,
  Quote,
  Link,
  StickyNote,
  Sparkles,
  Search,
  Plus,
  Bookmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { materials } from '@/data/materials';
import type { Material, MaterialType } from '@/types';

const TYPE_CONFIG: Record<
  MaterialType,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string; bg: string }
> = {
  image: { icon: Image, label: '图片', color: 'text-moss-500', bg: 'bg-moss-50' },
  quote: { icon: Quote, label: '引用', color: 'text-gold-500', bg: 'bg-gold-50' },
  link: { icon: Link, label: '链接', color: 'text-ink-500', bg: 'bg-ink-100' },
  note: { icon: StickyNote, label: '笔记', color: 'text-vermilion-500', bg: 'bg-vermilion-50' },
  golden: { icon: Sparkles, label: '金句', color: 'text-gold-600', bg: 'bg-gold-100' },
};

const FILTERS: Array<{ key: 'all' | MaterialType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'quote', label: '引用' },
  { key: 'link', label: '链接' },
  { key: 'note', label: '笔记' },
  { key: 'golden', label: '金句' },
];

function MaterialCard({ material }: { material: Material }) {
  const config = TYPE_CONFIG[material.type];
  const Icon = config.icon;

  return (
    <div className="bg-paper rounded-xl p-4 shadow-paper hover:shadow-paper-hover transition-all hover:-translate-y-0.5 cursor-pointer group">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'p-2 rounded-lg shrink-0',
            config.bg
          )}
        >
          <Icon className={cn('w-4 h-4', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-ink-800 text-sm line-clamp-1 group-hover:text-vermilion transition-colors">
              {material.title}
            </h4>
            <Bookmark className="w-3.5 h-3.5 text-ink-300 group-hover:text-vermilion-500 shrink-0 transition-colors" />
          </div>
          {material.type === 'image' ? (
            <div className="mt-2 rounded-lg overflow-hidden aspect-video bg-paper-100">
              <img
                src={material.imageUrl}
                alt={material.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : material.type === 'link' ? (
            <a
              href={material.content}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs text-moss-500 hover:underline line-clamp-1 block"
            >
              {material.content}
            </a>
          ) : (
            <p className="mt-2 text-xs text-ink-500 line-clamp-2 leading-relaxed">
              {material.content}
            </p>
          )}
          {material.source && (
            <p className="mt-2 text-xs text-ink-400">— {material.source}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-3">
            {material.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-paper-100 text-ink-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MaterialCollection() {
  const [activeFilter, setActiveFilter] = useState<'all' | MaterialType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = materials.filter((m) => {
    const matchType = activeFilter === 'all' || m.type === activeFilter;
    const matchSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-vermilion-500" />
          素材收藏
        </h3>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-vermilion-500 text-white text-xs font-medium rounded-lg hover:bg-vermilion-600 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          添加素材
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          placeholder="搜索素材..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-paper-50 border border-paper-200 rounded-lg text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-vermilion-200 focus:border-vermilion-300 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all',
              activeFilter === filter.key
                ? 'bg-ink-800 text-paper'
                : 'bg-paper-100 text-ink-500 hover:bg-paper-200'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-ink-400">
            <Search className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">暂无匹配的素材</p>
          </div>
        )}
      </div>
    </div>
  );
}
