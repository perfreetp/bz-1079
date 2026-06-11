import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Quote, Tag, ArrowRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArticleStore } from '@/store/articleStore';
import type { InsertedMaterial } from '@/types';

export default function ArticleMaterialsPanel() {
  const { articles, getInsertedMaterials } = useArticleStore();
  const navigate = useNavigate();

  const draftArticles = articles.filter(
    (a) => a.status === 'writing' || a.status === 'outline' || a.status === 'topic'
  );

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    draftArticles.length > 0 ? draftArticles[0].id : null
  );
  const [materials, setMaterials] = useState<InsertedMaterial[]>([]);

  useEffect(() => {
    if (selectedArticleId) {
      setMaterials(getInsertedMaterials(selectedArticleId));
    } else {
      setMaterials([]);
    }
  }, [selectedArticleId, getInsertedMaterials]);

  const images = materials.filter((m) => m.materialType === 'image');
  const quotes = materials.filter((m) => m.materialType === 'quote');
  const brands = materials.filter((m) => m.materialType === 'brand');

  const handleJump = (articleId: string) => {
    navigate(`/write/${articleId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-ink-800 font-serif">文章素材</h3>
          <p className="text-xs text-ink-400 mt-0.5">按文章查看已插入的素材</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex flex-wrap gap-2">
          {draftArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                selectedArticleId === article.id
                  ? 'bg-vermilion text-white'
                  : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
              )}
            >
              {article.title}
            </button>
          ))}
          {draftArticles.length === 0 && (
            <p className="text-sm text-ink-400">暂无草稿文章</p>
          )}
        </div>
      </div>

      {!selectedArticleId ? (
        <div className="py-16 text-center text-ink-400 text-sm">
          请选择一篇文章查看已插入素材
        </div>
      ) : materials.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="w-12 h-12 text-ink-200 mx-auto mb-3" />
          <p className="text-sm text-ink-400">该文章暂无已插入的素材</p>
        </div>
      ) : (
        <div className="space-y-6">
          {images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4 text-vermilion" />
                <h4 className="text-sm font-semibold text-ink-700">已插入图片</h4>
                <span className="text-xs text-ink-400">{images.length} 张</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((item) => (
                  <div
                    key={item.id}
                    className="bg-paper border border-paper-200 rounded-xl p-3 shadow-paper hover:shadow-paper-hover transition-all"
                  >
                    <div className="w-full h-24 bg-paper-100 rounded-lg flex items-center justify-center mb-2">
                      <Image className="w-6 h-6 text-ink-300" />
                    </div>
                    <p className="text-xs text-ink-700 font-medium line-clamp-1">{item.title}</p>
                    <p className="text-xs text-ink-400 mt-1 line-clamp-1">{item.content.slice(0, 40)}</p>
                    <button
                      onClick={() => handleJump(item.articleId)}
                      className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 text-xs text-vermilion-600 bg-vermilion-50 rounded-lg hover:bg-vermilion-100 transition-colors"
                    >
                      跳转
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Quote className="w-4 h-4 text-gold-500" />
                <h4 className="text-sm font-semibold text-ink-700">已插入引用</h4>
                <span className="text-xs text-ink-400">{quotes.length} 条</span>
              </div>
              <div className="space-y-2">
                {quotes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-paper border border-paper-200 rounded-xl p-4 shadow-paper hover:shadow-paper-hover transition-all flex items-start gap-3"
                  >
                    <Quote className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-700 font-medium">{item.title}</p>
                      <p className="text-xs text-ink-400 mt-1 line-clamp-2">{item.content}</p>
                    </div>
                    <button
                      onClick={() => handleJump(item.articleId)}
                      className="shrink-0 flex items-center gap-1 px-2 py-1 text-xs text-vermilion-600 bg-vermilion-50 rounded-lg hover:bg-vermilion-100 transition-colors"
                    >
                      跳转
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {brands.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-moss-500" />
                <h4 className="text-sm font-semibold text-ink-700">已插入品牌词</h4>
                <span className="text-xs text-ink-400">{brands.length} 个</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {brands.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleJump(item.articleId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-moss-50 text-moss-600 rounded-lg hover:bg-moss-100 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {item.title}
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
