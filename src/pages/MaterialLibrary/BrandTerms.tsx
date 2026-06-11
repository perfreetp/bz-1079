import { useState } from 'react';
import { Plus, Package, Megaphone, Ban, MessageSquare, Trash2, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BrandTerm, BrandTermCategory } from '@/types';
import { useMaterialStore } from '@/store/materialStore';
import { useArticleStore } from '@/store/articleStore';
import { useToast } from '@/components/ui/Toast';
import ArticleSelectorModal from '@/components/ui/ArticleSelectorModal';
import InsertSuccessModal from '@/components/ui/InsertSuccessModal';

interface BrandTermsProps {
  brandTerms: BrandTerm[];
}

const categories: { key: BrandTermCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', label: '全部', icon: Package },
  { key: 'product', label: '产品词', icon: Package },
  { key: 'slogan', label: 'Slogan', icon: Megaphone },
  { key: 'forbidden', label: '禁用词', icon: Ban },
  { key: 'preferred', label: '推荐话术', icon: MessageSquare },
];

export default function BrandTerms({ brandTerms }: BrandTermsProps) {
  const [activeCategory, setActiveCategory] = useState<BrandTermCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newCategory, setNewCategory] = useState<BrandTermCategory>('product');
  const [newReplacement, setNewReplacement] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [insertingTerm, setInsertingTerm] = useState<BrandTerm | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successArticleId, setSuccessArticleId] = useState('');

  const { addBrandTerm, deleteBrandTerm } = useMaterialStore();
  const { appendDraftContent, setLastEditedArticleId } = useArticleStore();
  const { showToast } = useToast();

  const filteredTerms =
    activeCategory === 'all'
      ? brandTerms
      : brandTerms.filter((t) => t.category === activeCategory);

  const categoryCounts = {
    all: brandTerms.length,
    product: brandTerms.filter((t) => t.category === 'product').length,
    slogan: brandTerms.filter((t) => t.category === 'slogan').length,
    forbidden: brandTerms.filter((t) => t.category === 'forbidden').length,
    preferred: brandTerms.filter((t) => t.category === 'preferred').length,
  };

  const handleAddTerm = () => {
    if (!newTerm.trim()) {
      showToast('请输入词汇内容', 'error');
      return;
    }

    const termData: BrandTerm = {
      id: `bt-${Date.now()}`,
      term: newTerm.trim(),
      category: newCategory,
      isForbidden: newCategory === 'forbidden',
      description: newDescription.trim() || undefined,
    };

    if (newCategory === 'forbidden' && newReplacement.trim()) {
      termData.replacement = newReplacement.trim();
    }

    addBrandTerm(termData);
    setNewTerm('');
    setNewCategory('product');
    setNewReplacement('');
    setNewDescription('');
    setShowAddModal(false);
    showToast('词汇添加成功', 'success');
  };

  const handleDelete = (id: string, term: string) => {
    deleteBrandTerm(id);
    setDeleteConfirmId(null);
    showToast(`已删除词汇：${term}`, 'success');
  };

  const handleInsert = (term: BrandTerm) => {
    setInsertingTerm(term);
    setShowInsertModal(true);
  };

  const handleConfirmInsert = (articleId: string) => {
    if (!insertingTerm) return;
    let text: string;
    if (insertingTerm.isForbidden) {
      text = `**【${insertingTerm.replacement || insertingTerm.term}】**`;
    } else {
      text = insertingTerm.term;
    }
    appendDraftContent(articleId, text);
    setLastEditedArticleId(articleId);
    setShowInsertModal(false);
    setInsertingTerm(null);
    setSuccessArticleId(articleId);
    setShowSuccessModal(true);
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
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
        >
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
                    {categoryCounts[cat.key]}
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
                  'rounded-xl border p-4 shadow-paper hover:shadow-paper-hover transition-all relative',
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
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleInsert(term)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        term.isForbidden
                          ? 'bg-vermilion-100 text-vermilion-600 hover:bg-vermilion-200'
                          : 'bg-moss-100 text-moss-600 hover:bg-moss-200'
                      )}
                      title="快捷插入"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(term.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-vermilion-600 hover:bg-vermilion-50 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {deleteConfirmId === term.id && (
                  <div className="absolute inset-0 bg-ink-900/80 rounded-xl flex flex-col items-center justify-center gap-3 z-10">
                    <p className="text-white text-sm font-medium px-4 text-center">
                      确认删除词汇"{term.term}"？
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 text-xs bg-paper/20 text-white rounded-lg hover:bg-paper/30 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleDelete(term.id, term.term)}
                        className="px-3 py-1.5 text-xs bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredTerms.length === 0 && (
              <div className="col-span-2 py-16 text-center text-ink-400 text-sm">
                暂无{activeCategory === 'all' ? '' : getCategoryLabel(activeCategory)}词汇，点击"添加词汇"创建
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-paper-200">
              <h3 className="text-lg font-bold text-ink-800 font-serif">添加词汇</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTerm('');
                  setNewCategory('product');
                  setNewReplacement('');
                  setNewDescription('');
                }}
                className="p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
              >
                <X className="w-5 h-5 text-ink-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">词汇 *</label>
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="请输入词汇内容"
                  className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">分类 *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(categories.slice(1) as { key: BrandTermCategory; label: string }[]).map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setNewCategory(cat.key)}
                      className={cn(
                        'px-3 py-2 text-xs font-medium rounded-lg transition-colors border',
                        newCategory === cat.key
                          ? cat.key === 'forbidden'
                            ? 'bg-vermilion-50 border-vermilion-300 text-vermilion-600'
                            : cat.key === 'preferred'
                            ? 'bg-moss-50 border-moss-300 text-moss-600'
                            : cat.key === 'slogan'
                            ? 'bg-gold-50 border-gold-300 text-gold-600'
                            : 'bg-vermilion-50 border-vermilion-300 text-vermilion-600'
                          : 'bg-paper border-paper-200 text-ink-500 hover:bg-paper-50'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              {newCategory === 'forbidden' && (
                <div>
                  <label className="block text-xs font-medium text-ink-500 mb-1.5">替换建议词</label>
                  <input
                    type="text"
                    value={newReplacement}
                    onChange={(e) => setNewReplacement(e.target.value)}
                    placeholder='例如：非常（替换"最"）'
                    className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">描述说明</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="使用场景、注意事项等"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTerm('');
                    setNewCategory('product');
                    setNewReplacement('');
                    setNewDescription('');
                  }}
                  className="px-4 py-2 text-sm bg-paper-100 text-ink-600 rounded-lg hover:bg-paper-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddTerm}
                  className="px-4 py-2 text-sm bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ArticleSelectorModal
        open={showInsertModal}
        onClose={() => {
          setShowInsertModal(false);
          setInsertingTerm(null);
        }}
        onSelect={handleConfirmInsert}
        title="插入品牌词"
        confirmText="确认插入"
      >
        <div>
          <h4 className="text-sm font-semibold text-ink-700 mb-3">即将插入的内容</h4>
          {insertingTerm && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    getCategoryBadgeClass(insertingTerm.category)
                  )}
                >
                  {getCategoryLabel(insertingTerm.category)}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    insertingTerm.isForbidden ? 'text-vermilion-600 line-through' : 'text-ink-800'
                  )}
                >
                  {insertingTerm.term}
                </span>
              </div>
              {insertingTerm.description && (
                <p className="text-xs text-ink-500">{insertingTerm.description}</p>
              )}
              {insertingTerm.replacement && (
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-ink-400 text-xs">替换建议：</span>
                  <ArrowRight className="w-3 h-3 text-moss-500" />
                  <span className="text-moss-600 font-medium text-sm">{insertingTerm.replacement}</span>
                </div>
              )}
              <div className="pt-2">
                <label className="block text-xs font-medium text-ink-500 mb-1.5">插入效果预览</label>
                <div className="p-3 bg-paper-100 rounded-lg text-sm text-ink-700">
                  {insertingTerm.isForbidden ? (
                    <span className="font-bold text-vermilion-600">
                      【{insertingTerm.replacement || insertingTerm.term}】
                    </span>
                  ) : (
                    <span>{insertingTerm.term}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </ArticleSelectorModal>

      <InsertSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        articleId={successArticleId}
        message="品牌词已成功插入到"
      />
    </div>
  );
}
