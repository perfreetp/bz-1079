import { useState } from 'react';
import { Pencil, Trash2, Plus, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Material } from '@/types';
import { useMaterialStore } from '@/store/materialStore';
import { useArticleStore } from '@/store/articleStore';
import { useToast } from '@/components/ui/Toast';

interface ImageGalleryProps {
  materials: Material[];
}

const unsplashImages = [
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
];

export default function ImageGallery({ materials }: ImageGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<Material | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editSource, setEditSource] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { addMaterial, deleteMaterial, updateMaterial } = useMaterialStore();
  const { appendDraftContent } = useArticleStore();
  const { showToast } = useToast();

  const images = materials.filter((m) => m.type === 'image');

  const handleBatchUpload = () => {
    const now = Date.now();
    const newImages: Material[] = unsplashImages.slice(0, 2).map((url, idx) => ({
      id: `img-${now}-${idx}`,
      type: 'image' as const,
      title: `新上传图片 ${idx + 1}`,
      content: `批量上传的图片素材 ${idx + 1}`,
      imageUrl: url,
      tags: ['新上传'],
      caption: `图片说明 ${idx + 1}`,
      createdAt: new Date().toISOString(),
    }));
    newImages.forEach((img) => addMaterial(img));
    setShowUploadModal(false);
    showToast(`成功上传 ${newImages.length} 张图片`, 'success');
  };

  const handleEdit = (image: Material) => {
    setEditingImage(image);
    setEditCaption(image.caption || '');
    setEditSource(image.source || '');
  };

  const handleSaveEdit = () => {
    if (editingImage) {
      updateMaterial(editingImage.id, {
        caption: editCaption,
        source: editSource,
      });
      setEditingImage(null);
      showToast('图片信息已更新', 'success');
    }
  };

  const handleDelete = (id: string) => {
    deleteMaterial(id);
    setDeleteConfirmId(null);
    showToast('图片已删除', 'success');
  };

  const handleInsert = (image: Material) => {
    const title = image.caption || image.title;
    appendDraftContent('a001', `\n\n![${title}](${image.imageUrl})\n`);
    showToast(`已插入「${image.title}」图片到写作草稿`, 'success');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">图片素材库</h3>
          <p className="text-xs text-ink-400 mt-0.5">共 {images.length} 张图片</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
        >
          <Upload className="w-4 h-4" />
          批量上传
        </button>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid bg-paper rounded-xl overflow-hidden shadow-paper hover:shadow-paper-hover transition-all group relative"
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
                <button
                  onClick={() => handleEdit(image)}
                  className="w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center text-ink-700 hover:bg-paper transition-colors"
                  title="编辑"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(image.id)}
                  className="w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center text-vermilion-600 hover:bg-paper transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleInsert(image)}
                  className="w-9 h-9 rounded-full bg-vermilion flex items-center justify-center text-white hover:bg-vermilion-600 transition-colors"
                  title="插入"
                >
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

            {deleteConfirmId === image.id && (
              <div className="absolute inset-0 bg-ink-900/80 flex flex-col items-center justify-center gap-3 z-10">
                <p className="text-white text-sm font-medium px-4 text-center">确认删除此图片？</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-3 py-1.5 text-xs bg-paper/20 text-white rounded-lg hover:bg-paper/30 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="px-3 py-1.5 text-xs bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-paper-200">
              <h3 className="text-lg font-bold text-ink-800 font-serif">批量上传图片</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
              >
                <X className="w-5 h-5 text-ink-400" />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {unsplashImages.slice(0, 6).map((url, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
                      idx < 2
                        ? 'border-vermilion ring-2 ring-vermilion/30'
                        : 'border-paper-200 opacity-50'
                    )}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {idx < 2 && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-vermilion flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-400 mb-4">已自动选择前 2 张图片进行上传（模拟）</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm bg-paper-100 text-ink-600 rounded-lg hover:bg-paper-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBatchUpload}
                  className="px-4 py-2 text-sm bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors"
                >
                  确认上传
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingImage && (
        <div className="fixed inset-0 bg-ink-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-paper-200">
              <h3 className="text-lg font-bold text-ink-800 font-serif">编辑图片信息</h3>
              <button
                onClick={() => setEditingImage(null)}
                className="p-1.5 rounded-lg hover:bg-paper-100 transition-colors"
              >
                <X className="w-5 h-5 text-ink-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">图片说明 (Caption)</label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="请输入图片说明"
                  className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1.5">图片来源 (Source)</label>
                <input
                  type="text"
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  placeholder="请输入图片来源"
                  className="w-full px-3 py-2 text-sm border border-paper-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 text-sm bg-paper-100 text-ink-600 rounded-lg hover:bg-paper-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm bg-vermilion text-white rounded-lg hover:bg-vermilion-600 transition-colors"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
