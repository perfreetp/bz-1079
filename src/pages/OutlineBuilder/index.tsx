import { useState } from 'react';
import type { OutlineSection, TitleOption } from '@/types';
import OutlineTree from './OutlineTree';
import SectionEditor from './SectionEditor';
import TitleOptions from './TitleOptions';
import { BookOpen } from 'lucide-react';

const mockOutline: OutlineSection[] = [
  {
    id: 'sec-1',
    articleId: 'art-1',
    title: '引言：数字化时代的内容创作',
    keyPoint: '阐述内容创作在数字化时代的重要性和变革趋势',
    wordEstimate: 800,
    imageSuggestion: '现代办公场景，多屏协同工作',
    orderIndex: 0,
    children: [
      {
        id: 'sec-1-1',
        articleId: 'art-1',
        title: '内容创作的演进历程',
        keyPoint: '从传统媒体到新媒体的转变过程',
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
    keyPoint: '人工智能辅助写作的应用场景和价值',
    wordEstimate: 1200,
    imageSuggestion: 'AI与人类协作的概念图',
    orderIndex: 1,
    children: [
      {
        id: 'sec-2-1',
        articleId: 'art-1',
        title: '智能大纲生成',
        keyPoint: 'AI自动生成文章结构的能力',
        wordEstimate: 400,
        imageSuggestion: '',
        orderIndex: 0,
        parentId: 'sec-2',
      },
      {
        id: 'sec-2-2',
        articleId: 'art-1',
        title: '内容润色与优化',
        keyPoint: 'AI对语言表达的提升作用',
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
    keyPoint: '从选题到发布的完整方法论',
    wordEstimate: 1000,
    imageSuggestion: '流程图或工作场景',
    orderIndex: 2,
  },
  {
    id: 'sec-4',
    articleId: 'art-1',
    title: '结语：人机协作的未来',
    keyPoint: '总结观点，展望未来发展方向',
    wordEstimate: 500,
    imageSuggestion: '',
    orderIndex: 3,
  },
];

const mockTitleOptions: TitleOption[] = [
  {
    id: 'title-1',
    articleId: 'art-1',
    title: 'AI时代的内容创作：效率与创意的完美平衡',
    isPrimary: true,
    votes: 24,
    aiSuggestion: '关键词覆盖全面，情感张力强',
  },
  {
    id: 'title-2',
    articleId: 'art-1',
    title: '从灵感触达到一键成稿：智能写作全流程解析',
    isPrimary: false,
    votes: 18,
    aiSuggestion: '行动导向，转化率高',
  },
  {
    id: 'title-3',
    articleId: 'art-1',
    title: '写作者的新伙伴：AI如何重塑内容生产方式',
    isPrimary: false,
    votes: 15,
    aiSuggestion: '引发好奇，讨论度高',
  },
  {
    id: 'title-4',
    articleId: 'art-1',
    title: '数字化写作革命：当创意遇上人工智能',
    isPrimary: false,
    votes: 12,
    aiSuggestion: '时代感强，传播性好',
  },
];

export default function OutlineBuilder() {
  const [outline, setOutline] = useState<OutlineSection[]>(mockOutline);
  const [titleOptions, setTitleOptions] = useState<TitleOption[]>(mockTitleOptions);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-2');

  const findSection = (sections: OutlineSection[], id: string): OutlineSection | null => {
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.children) {
        const found = findSection(section.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedSection = findSection(outline, selectedSectionId);

  const updateSection = (sectionId: string, updates: Partial<OutlineSection>) => {
    const updateRecursive = (sections: OutlineSection[]): OutlineSection[] => {
      return sections.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, ...updates };
        }
        if (sec.children) {
          return { ...sec, children: updateRecursive(sec.children) };
        }
        return sec;
      });
    };
    setOutline(updateRecursive(outline));
  };

  const addSection = (parentId?: string) => {
    const newSection: OutlineSection = {
      id: `sec-${Date.now()}`,
      articleId: 'art-1',
      title: '新章节',
      keyPoint: '',
      wordEstimate: 500,
      imageSuggestion: '',
      orderIndex: outline.length,
      parentId,
    };

    if (parentId) {
      const addToParent = (sections: OutlineSection[]): OutlineSection[] => {
        return sections.map((sec) => {
          if (sec.id === parentId) {
            return {
              ...sec,
              children: [...(sec.children || []), newSection],
            };
          }
          if (sec.children) {
            return { ...sec, children: addToParent(sec.children) };
          }
          return sec;
        });
      };
      setOutline(addToParent(outline));
    } else {
      setOutline([...outline, newSection]);
    }
    setSelectedSectionId(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    const deleteRecursive = (sections: OutlineSection[]): OutlineSection[] => {
      return sections
        .filter((sec) => sec.id !== sectionId)
        .map((sec) => ({
          ...sec,
          children: sec.children ? deleteRecursive(sec.children) : undefined,
        }));
    };
    setOutline(deleteRecursive(outline));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(outline[0]?.id || '');
    }
  };

  const setPrimaryTitle = (titleId: string) => {
    setTitleOptions(
      titleOptions.map((t) => ({
        ...t,
        isPrimary: t.id === titleId,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <header className="bg-white border-b border-ink-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-vermilion rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink-800">大纲构建</h1>
            <p className="text-sm text-ink-400">搭建文章结构，规划写作思路</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-400">预估总字数：3,700</span>
          <button className="px-4 py-2 bg-ink-800 text-white text-sm font-medium rounded-lg hover:bg-ink-700 transition-colors">
            进入写作
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[380px] border-r border-ink-100 bg-white overflow-y-auto">
          <OutlineTree
            data={outline}
            selectedId={selectedSectionId}
            onSelect={setSelectedSectionId}
            onAdd={addSection}
            onDelete={deleteSection}
            onRename={(id, title) => updateSection(id, { title })}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {selectedSection ? (
            <SectionEditor
              section={selectedSection}
              onSave={(updates) => updateSection(selectedSection.id, updates)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-ink-400">
              请选择一个章节进行编辑
            </div>
          )}

          <TitleOptions
            titleOptions={titleOptions}
            onSetPrimary={setPrimaryTitle}
          />
        </div>
      </div>
    </div>
  );
}
