import { useState } from 'react';
import type { OutlineSection } from '@/types';
import RichEditor from './RichEditor';
import AIToolbox from './AIToolbox';
import WritingProgress from './WritingProgress';
import { cn } from '@/lib/utils';
import { PenLine, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const mockOutline: OutlineSection[] = [
  {
    id: 'sec-1',
    articleId: 'art-1',
    title: '引言：数字化时代的内容创作',
    keyPoint: '阐述内容创作在数字化时代的重要性和变革趋势',
    wordEstimate: 800,
    imageSuggestion: '',
    orderIndex: 0,
    children: [
      {
        id: 'sec-1-1',
        articleId: 'art-1',
        title: '内容创作的演进历程',
        keyPoint: '',
        wordEstimate: 300,
        imageSuggestion: '',
        orderIndex: 0,
        parentId: 'sec-1',
      },
    ],
  },
  {
    id: 'sec-2',
    articleId: 'art-1',
    title: 'AI技术如何改变写作方式',
    keyPoint: '',
    wordEstimate: 1200,
    imageSuggestion: '',
    orderIndex: 1,
    children: [
      {
        id: 'sec-2-1',
        articleId: 'art-1',
        title: '智能大纲生成',
        keyPoint: '',
        wordEstimate: 400,
        imageSuggestion: '',
        orderIndex: 0,
        parentId: 'sec-2',
      },
      {
        id: 'sec-2-2',
        articleId: 'art-1',
        title: '内容润色与优化',
        keyPoint: '',
        wordEstimate: 400,
        imageSuggestion: '',
        orderIndex: 1,
        parentId: 'sec-2',
      },
    ],
  },
  {
    id: 'sec-3',
    articleId: 'art-1',
    title: '高效内容创作的工作流程',
    keyPoint: '',
    wordEstimate: 1000,
    imageSuggestion: '',
    orderIndex: 2,
  },
  {
    id: 'sec-4',
    articleId: 'art-1',
    title: '结语：人机协作的未来',
    keyPoint: '',
    wordEstimate: 500,
    imageSuggestion: '',
    orderIndex: 3,
  },
];

const sampleContent = `AI时代的内容创作：效率与创意的完美平衡

在数字化浪潮席卷全球的今天，内容创作正经历着一场前所未有的深刻变革。从传统的纸笔书写，到电脑键盘的敲击，再到如今人工智能辅助下的智能创作，每一次技术的进步都在重塑着创作者与内容之间的关系。

一、内容创作的演进历程

回顾内容创作的发展历程，我们可以清晰地看到技术进步所留下的足迹。在印刷术发明之前，知识的传播依赖于手抄本，每一份文献都凝聚着抄写者的心血。工业革命带来了机械化印刷，使得大规模内容生产成为可能。而互联网的出现，则彻底打破了信息传播的壁垒，让每个人都有机会成为内容的创作者。

进入21世纪第二个十年，人工智能技术的突破为内容创作领域注入了全新的活力。机器学习算法能够分析海量文本数据，学习语言的规律和表达的艺术，从而在一定程度上辅助甚至模拟人类的创作过程。

二、AI技术如何改变写作方式

2.1 智能大纲生成

传统写作中，搭建文章结构往往需要耗费大量时间和心力。创作者需要反复思考论点的排布、论据的选择以及段落之间的逻辑衔接。而AI辅助写作工具可以根据主题关键词，在短短数秒内生成一份结构合理、层次清晰的文章大纲。

这些智能生成的大纲不仅涵盖了主要论点，还会提供丰富的子论点和案例建议，为创作者提供坚实的思考框架。创作者可以在此基础上进行调整和完善，将更多精力投入到深度思考和创意表达中。

2.2 内容润色与优化

好的文章不仅要有深刻的思想，还需要优美的表达。AI工具在语言润色方面展现出了令人惊叹的能力。它可以识别文中的语法错误、措辞不当之处，并提供专业的修改建议。

更重要的是，AI能够根据目标读者群体和写作场景，调整文章的语气风格。无论是面向专业人士的严谨论述，还是面向大众读者的轻松科普，AI都能帮助创作者找到最合适的表达方式。`;

interface OutlinePanelProps {
  data: OutlineSection[];
  collapsed: boolean;
  activeSectionId: string;
  onSelect: (id: string) => void;
}

function OutlinePanel({ data, collapsed, activeSectionId, onSelect }: OutlinePanelProps) {
  if (collapsed) {
    return null;
  }

  const renderNode = (node: OutlineSection, depth: number = 0) => (
    <div key={node.id}>
      <button
        onClick={() => onSelect(node.id)}
        className={cn(
          'w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-150 truncate',
          activeSectionId === node.id
            ? 'bg-vermilion-50 text-vermilion font-medium border-l-2 border-vermilion'
            : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800'
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {node.title}
      </button>
      {node.children?.map((child) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div className="p-4 space-y-1">
      <div className="flex items-center gap-2 px-3 py-2 mb-2">
        <BookOpen className="w-4 h-4 text-vermilion" />
        <span className="text-sm font-semibold text-ink-700">文章大纲</span>
      </div>
      {data.map((node) => renderNode(node))}
    </div>
  );
}

export default function WritingDesk() {
  const [outlineCollapsed, setOutlineCollapsed] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('sec-2');
  const [content, setContent] = useState(sampleContent);

  const wordCount = content.replace(/\s/g, '').length;
  const targetWordCount = 3700;

  return (
    <div className="h-screen bg-paper-100 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-ink-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-moss rounded-xl flex items-center justify-center">
            <PenLine className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-ink-800">
              AI时代的内容创作：效率与创意的完美平衡
            </h1>
            <p className="text-xs text-ink-400">智能写作模式 · 专注创作</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-500">
            已写 <span className="font-semibold text-ink-800">{wordCount.toLocaleString()}</span> 字
          </span>
          <button className="px-4 py-2 bg-moss text-white text-sm font-medium rounded-lg hover:bg-moss-600 transition-colors">
            保存草稿
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={cn(
            'bg-white border-r border-ink-100 transition-all duration-300 flex-shrink-0 relative',
            outlineCollapsed ? 'w-12' : 'w-64'
          )}
        >
          <button
            onClick={() => setOutlineCollapsed(!outlineCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border border-ink-100 rounded-full flex items-center justify-center text-ink-400 hover:text-ink-700 hover:border-ink-300 transition-all shadow-sm z-10"
          >
            {outlineCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>

          {outlineCollapsed ? (
            <div className="flex flex-col items-center pt-20 gap-3">
              <BookOpen className="w-5 h-5 text-vermilion" />
              <span className="text-xs text-ink-400 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
                大纲
              </span>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <OutlinePanel
                data={mockOutline}
                collapsed={outlineCollapsed}
                activeSectionId={activeSectionId}
                onSelect={setActiveSectionId}
              />
            </div>
          )}
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <RichEditor content={content} onChange={setContent} />
          </div>
          <WritingProgress
            currentWords={wordCount}
            targetWords={targetWordCount}
            outlineCompleteRate={65}
            estimatedTime="约45分钟"
          />
        </main>

        <aside className="w-72 bg-white border-l border-ink-100 overflow-y-auto flex-shrink-0">
          <AIToolbox />
        </aside>
      </div>
    </div>
  );
}
