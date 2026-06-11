import { useState } from 'react';
import { cn } from '@/lib/utils';
import ImageGallery from './ImageGallery';
import ReferenceList from './ReferenceList';
import BrandTerms from './BrandTerms';

type TabKey = 'images' | 'references' | 'brands';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'images', label: '图片素材' },
  { key: 'references', label: '引用来源' },
  { key: 'brands', label: '品牌词库' },
];

export default function MaterialLibrary() {
  const [activeTab, setActiveTab] = useState<TabKey>('images');

  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-800 font-serif">素材管理</h1>
          <p className="text-sm text-ink-400 mt-1">管理创作所需的图片、引用和品牌词汇</p>
        </div>

        <div className="bg-paper rounded-2xl shadow-paper overflow-hidden">
          <div className="border-b border-paper-200 px-6">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative py-4 text-sm font-medium transition-colors',
                    activeTab === tab.key
                      ? 'text-vermilion'
                      : 'text-ink-500 hover:text-ink-700'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-vermilion rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'images' && <ImageGallery />}
            {activeTab === 'references' && <ReferenceList />}
            {activeTab === 'brands' && <BrandTerms />}
          </div>
        </div>
      </div>
    </div>
  );
}
