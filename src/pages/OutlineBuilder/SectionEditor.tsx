import { useState, useEffect } from 'react';
import type { OutlineSection } from '@/types';
import { Save, FileText, Lightbulb, Hash, Image } from 'lucide-react';

interface SectionEditorProps {
  section: OutlineSection;
  onSave: (updates: Partial<OutlineSection>) => void;
}

export default function SectionEditor({ section, onSave }: SectionEditorProps) {
  const [title, setTitle] = useState(section.title);
  const [keyPoint, setKeyPoint] = useState(section.keyPoint);
  const [wordEstimate, setWordEstimate] = useState(section.wordEstimate);
  const [imageSuggestion, setImageSuggestion] = useState(section.imageSuggestion);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setTitle(section.title);
    setKeyPoint(section.keyPoint);
    setWordEstimate(section.wordEstimate);
    setImageSuggestion(section.imageSuggestion);
    setSaved(true);
  }, [section.id]);

  useEffect(() => {
    const isDirty =
      title !== section.title ||
      keyPoint !== section.keyPoint ||
      wordEstimate !== section.wordEstimate ||
      imageSuggestion !== section.imageSuggestion;
    setSaved(!isDirty);
  }, [title, keyPoint, wordEstimate, imageSuggestion, section]);

  const handleSave = () => {
    onSave({
      title,
      keyPoint,
      wordEstimate,
      imageSuggestion,
    });
    setSaved(true);
  };

  return (
    <div className="p-6 border-b border-ink-100 bg-white">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vermilion-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-vermilion" />
            </div>
            <h2 className="text-base font-semibold text-ink-800">段落编辑</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              saved
                ? 'bg-ink-100 text-ink-400 cursor-not-allowed'
                : 'bg-vermilion text-white hover:bg-vermilion-400'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? '已保存' : '保存修改'}
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink-600 mb-2">
              <Hash className="w-3.5 h-3.5 text-ink-400" />
              段落标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入段落标题..."
              className="w-full px-4 py-3 text-base border border-ink-200 rounded-xl bg-ink-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink-600 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-gold-500" />
              核心观点
              <span className="text-xs text-ink-400 font-normal ml-1">描述本段落想要传达的主要内容</span>
            </label>
            <textarea
              value={keyPoint}
              onChange={(e) => setKeyPoint(e.target.value)}
              placeholder="输入核心观点，帮助你在写作时保持聚焦..."
              rows={4}
              className="w-full px-4 py-3 text-sm leading-relaxed border border-ink-200 rounded-xl bg-ink-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-ink-600 mb-2">
                <Hash className="w-3.5 h-3.5 text-ink-400" />
                预估字数
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={wordEstimate}
                  onChange={(e) => setWordEstimate(Number(e.target.value))}
                  min={0}
                  step={50}
                  className="w-full px-4 py-3 text-base border border-ink-200 rounded-xl bg-ink-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">字</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-ink-600 mb-2">
                <Image className="w-3.5 h-3.5 text-moss-500" />
                配图建议
              </label>
              <input
                type="text"
                value={imageSuggestion}
                onChange={(e) => setImageSuggestion(e.target.value)}
                placeholder="如：数据图表、场景照片等"
                className="w-full px-4 py-3 text-sm border border-ink-200 rounded-xl bg-ink-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
