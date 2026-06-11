import { useState } from 'react';
import type { AITone } from '@/types';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Briefcase,
  Coffee,
  GraduationCap,
  Feather,
  BookMarked,
  Quote,
  Wand2,
  X,
  ChevronRight,
} from 'lucide-react';

const toneOptions: { id: AITone; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'formal',
    label: '正式',
    description: '适用于报告、公文等正式场合',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-ink-100 text-ink-700 border-ink-200',
  },
  {
    id: 'casual',
    label: '轻松',
    description: '适用于社交媒体、日常分享',
    icon: <Coffee className="w-5 h-5" />,
    color: 'bg-gold-50 text-gold-600 border-gold-200',
  },
  {
    id: 'professional',
    label: '专业',
    description: '适用于行业分析、专业文章',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'bg-moss-50 text-moss-600 border-moss-200',
  },
  {
    id: 'literary',
    label: '文艺',
    description: '适用于散文、随笔、情感表达',
    icon: <Feather className="w-5 h-5" />,
    color: 'bg-vermilion-50 text-vermilion border-vermilion-200',
  },
];

const toolCards = [
  {
    id: 'expand',
    title: '案例扩写',
    description: '补充细节，丰富案例内容',
    icon: <BookMarked className="w-5 h-5" />,
    bgColor: 'bg-moss-50',
    iconColor: 'text-moss-500',
  },
  {
    id: 'golden',
    title: '金句插入',
    description: '生成契合主题的精彩金句',
    icon: <Quote className="w-5 h-5" />,
    bgColor: 'bg-gold-50',
    iconColor: 'text-gold-500',
  },
  {
    id: 'polish',
    title: '段落润色',
    description: '优化表达，提升文采',
    icon: <Wand2 className="w-5 h-5" />,
    bgColor: 'bg-vermilion-50',
    iconColor: 'text-vermilion',
  },
];

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-paper-hover w-[420px] max-h-[80vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <h3 className="text-base font-semibold text-ink-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AIToolbox() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<AITone>('casual');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveModal(null);
    }, 1500);
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-gradient-to-br from-vermilion to-gold-400 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink-800">AI工具箱</h2>
          <p className="text-xs text-ink-400">智能辅助，提升写作效率</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1 h-1 bg-vermilion rounded-full" />
            语气改写
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {toneOptions.map((tone) => (
              <button
                key={tone.id}
                onClick={() => {
                  setSelectedTone(tone.id);
                  setActiveModal('tone');
                }}
                className={cn(
                  'flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left hover:shadow-paper',
                  selectedTone === tone.id && activeModal === null
                    ? 'border-vermilion bg-vermilion-50/50'
                    : 'border-ink-100 bg-white hover:border-ink-200'
                )}
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', tone.color)}>
                  {tone.icon}
                </div>
                <span className="text-sm font-medium text-ink-800 mb-0.5">{tone.label}</span>
                <span className="text-[11px] text-ink-400 leading-tight">{tone.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1 h-1 bg-gold-500 rounded-full" />
            快捷工具
          </h3>
          <div className="space-y-2">
            {toolCards.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveModal(tool.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white border border-ink-100 hover:border-ink-200 hover:shadow-paper transition-all text-left group"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', tool.bgColor, tool.iconColor)}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink-800 mb-0.5">{tool.title}</div>
                  <div className="text-xs text-ink-400">{tool.description}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-vermilion group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeModal === 'tone' && (
        <Modal title="语气改写" onClose={() => setActiveModal(null)}>
          <div className="p-5">
            <p className="text-sm text-ink-500 mb-4">选择目标语气，AI将对选中内容进行改写</p>
            <div className="space-y-2 mb-5">
              {toneOptions.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                    selectedTone === tone.id
                      ? 'border-vermilion bg-vermilion-50'
                      : 'border-ink-100 hover:border-ink-200'
                  )}
                >
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', tone.color)}>
                    {tone.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink-800">{tone.label}</div>
                    <div className="text-xs text-ink-400">{tone.description}</div>
                  </div>
                  {selectedTone === tone.id && (
                    <div className="w-5 h-5 bg-vermilion rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 text-sm font-medium text-ink-600 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-vermilion rounded-lg hover:bg-vermilion-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    开始改写
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'expand' && (
        <Modal title="案例扩写" onClose={() => setActiveModal(null)}>
          <div className="p-5">
            <p className="text-sm text-ink-500 mb-4">AI将为选中内容补充具体案例和细节描述</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-medium text-ink-600 mb-1.5 block">扩写强度</label>
                <div className="flex gap-2">
                  {['轻度', '适中', '详细'].map((level, i) => (
                    <button
                      key={level}
                      className={cn(
                        'flex-1 py-2 text-sm rounded-lg transition-colors',
                        i === 1
                          ? 'bg-vermilion text-white'
                          : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-600 mb-1.5 block">补充数据和来源</label>
                <div className="flex items-center gap-2 p-3 bg-ink-50 rounded-lg">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-vermilion" />
                  <span className="text-sm text-ink-600">自动添加真实感数据</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 text-sm font-medium text-ink-600 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-moss rounded-lg hover:bg-moss-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <BookMarked className="w-4 h-4" />
                )}
                {isProcessing ? '扩写中...' : '开始扩写'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'golden' && (
        <Modal title="金句插入" onClose={() => setActiveModal(null)}>
          <div className="p-5">
            <p className="text-sm text-ink-500 mb-4">根据上下文生成契合主题的精彩金句</p>
            <div className="space-y-2 mb-5">
              {[
                '创作的本质，是用思想点亮他人的旅程。',
                '每一个字符背后，都是对世界更深的理解。',
                '技术为笔，思想为墨，书写属于这个时代的篇章。',
              ].map((sentence, i) => (
                <div
                  key={i}
                  className="p-3 bg-paper-100 border-l-4 border-gold-400 rounded-r-lg text-sm text-ink-700 italic font-serif"
                >
                  "{sentence}"
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 text-sm font-medium text-ink-600 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gold-400 to-gold-500 rounded-lg hover:from-gold-500 hover:to-gold-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Quote className="w-4 h-4" />
                )}
                {isProcessing ? '生成中...' : '插入首条'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'polish' && (
        <Modal title="段落润色" onClose={() => setActiveModal(null)}>
          <div className="p-5">
            <p className="text-sm text-ink-500 mb-4">优化语言表达，提升文章整体文采</p>
            <div className="space-y-2 mb-5">
              {['优化用词', '调整句式', '增强逻辑', '提升文采'].map((item, i) => (
                <div key={item} className="flex items-center gap-2 p-2.5 bg-ink-50 rounded-lg">
                  <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 text-vermilion" />
                  <span className="text-sm text-ink-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 text-sm font-medium text-ink-600 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-vermilion rounded-lg hover:bg-vermilion-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {isProcessing ? '润色中...' : '开始润色'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
