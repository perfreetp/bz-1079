import { useState } from 'react';
import { Plus, Link2, Quote, ExternalLink, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Material } from '@/types';
import { useMaterialStore } from '@/store/materialStore';
import { useArticleStore } from '@/store/articleStore';
import { useToast } from '@/components/ui/Toast';
import TagPill from '@/components/ui/TagPill';

interface ReferenceListProps {
  materials: Material[];
}

interface ReferenceItem {
  id: string;
  type: 'quote' | 'link';
  title: string;
  content: string;
  source?: string;
  tags: string[];
  quoteCount: number;
}

export default function ReferenceList({ materials }: ReferenceListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { addReference, deleteMaterial } = useMaterialStore();
  const { appendDraftContent } = useArticleStore();
  const { showToast } = useToast();

  const references: ReferenceItem[] = materials
    .filter((m) => m.type === 'quote' || m.type === 'link')
    .map((m, idx) => ({
      id: m.id,
      type: m.type as 'quote' | 'link',
      title: m.title,
      content: m.content,
      source: m.source,
      tags: m.tags,
      quoteCount: (idx + 1) * 3,
    }));

  const handleAddReference = () => {
    if (!newTitle.trim() || !newSource.trim()) {
      showToast('请填写完整的标题和来源链接', 'error');
      return;
    }
    addReference({ title: newTitle.trim(), source: newSource.trim() });
    setNewTitle('');
    setNewSource('');
    setShowAddModal(false);
    showToast('引用添加成功', 'success');
  };

  const handleDelete = (id: string, title: string) => {
    deleteMaterial(id);
    setDeleteConfirmId(null);
    showToast(`已删除引用：${title}`, 'success');
  };

  const handleInsert = (item: ReferenceItem) => {
    appendDraftContent('a001', `\n\n> ${item.title}\n> —— ${item.source || '来自网络'}\n`);
    showToast(`已插入引用「${item.title}」`, 'success');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">引用来源列表</h3>
          <p className="text-xs text-ink-400 mt-0.5">共 {references.length} 条引用</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
        >
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
              <th className="text-left text-xs font-medium text-ink-500 px-4 py-3 w-40">操作</th>
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
                      onClick={() => handleInsert(item)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-vermilion-50 text-vermilion-600 hover:bg-vermilion-100"
                    >
                      插入引用
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-ink-400 hover:text-vermilion-600 hover:bg-vermilion-50 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {deleteConfirmId === item.id && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-vermilion-50 rounded-lg">
                      <span className="text-xs text-vermilion-700">确认删除？</span>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 text-xs bg-paper text-ink-600 rounded hover:bg-paper-100"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="px-2 py-0.5 text-xs bg-vermilion text-white rounded hover:bg-vermilion-600"
                      >
                        确认
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {references.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-400 text-sm">
                  暂无引用数据，点击"添加引用"创建第一条
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-paper-200">
              <h3 className="text-lg font-bold text-ink-800 font-serif">添加引用</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTitle('');
                  setNewSource('');
                }}
                className="p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
              >
                <X className="w-5 h-5 text-ink-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">引用标题</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：中国内容营销白皮书2026"
                  className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">来源链接 / 作者</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="例如：https://example.com/report 或 作者名"
                  className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTitle('');
                    setNewSource('');
                  }}
                  className="px-4 py-2 text-sm bg-paper-100 text-ink-600 rounded-lg hover:bg-paper-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddReference}
                  className="px-4 py-2 text-sm bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
