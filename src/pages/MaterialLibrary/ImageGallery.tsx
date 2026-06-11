import { useState } from 'react';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { materials } from '@/data/materials';
import type { Material } from '@/types';

const mockImages: Material[] = [
  ...materials.filter((m) => m.type === 'image'),
  {
    id: 'img-extra-1',
    type: 'image',
    title: '内容创作流程图',
    content: '从选题到发布的完整创作流程',
    source: '内部设计团队',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    tags: ['流程图', '创作流程'],
    caption: '内容创作全流程示意图',
    createdAt: '2026-06-09T10:00:00Z',
  },
  {
    id: 'img-extra-2',
    type: 'image',
    title: '品牌色板示意图',
    content: '品牌主色调与辅助色展示',
    source: '品牌手册',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    tags: ['品牌', '设计规范'],
    caption: '墨笔品牌色彩体系',
    createdAt: '2026-06-08T15:00:00Z',
  },
  {
    id: 'img-extra-3',
    type: 'image',
    title: '用户增长趋势图',
    content: '近6个月用户增长数据可视化',
    source: '数据后台',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    tags: ['数据图表', '用户增长'],
    caption: '2026年H1用户增长趋势',
    createdAt: '2026-06-07T09:00:00Z',
  },
  {
    id: 'img-extra-4',
    type: 'image',
    title: '办公场景摄影',
    content: '团队协作办公场景',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    tags: ['场景图', '团队'],
    caption: '墨笔团队协作场景',
    createdAt: '2026-06-06T14:00:00Z',
  },
  {
    id: 'img-extra-5',
    type: 'image',
    title: '产品功能截图',
    content: '编辑器核心功能界面',
    source: '产品截图',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    tags: ['产品截图', '编辑器'],
    caption: '墨笔编辑器主界面',
    createdAt: '2026-06-05T11:00:00Z',
  },
];

export default function ImageGallery() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">图片素材库</h3>
          <p className="text-xs text-ink-400 mt-0.5">共 {mockImages.length} 张图片</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors">
          <Upload className="w-4 h-4" />
          批量上传
        </button>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {mockImages.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid bg-paper rounded-xl overflow-hidden shadow-paper hover:shadow-paper-hover transition-all group"
            onMouseEnter={() => setHoveredId(image.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className={cn(
                  'absolute inset-0 bg-ink-900/60 flex items-center justify-center gap-3 transition-opacity duration-200',
                  hoveredId === image.id ? 'opacity-100' : 'opacity-0'
                )}
              >
                <button className="w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center text-ink-700 hover:bg-paper transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center text-vermilion-600 hover:bg-paper transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full bg-vermilion flex items-center justify-center text-white hover:bg-vermilion-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium text-ink-800 line-clamp-1">
                {image.caption || image.title}
              </h4>
              {image.source && (
                <p className="text-xs text-ink-400 mt-1 line-clamp-1">来源：{image.source}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
