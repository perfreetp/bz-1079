import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { OutlineSection, AITone, AIOperation, AIOperationType, DraftVersion, DraftVersionSource } from '@/types';
import RichEditor from './RichEditor';
import AIToolbox from './AIToolbox';
import AIOperationHistory from './AIOperationHistory';
import DraftVersionPanel from './DraftVersionPanel';
import DraftDiffModal from './DraftDiffModal';
import WritingProgress from './WritingProgress';
import { useArticleStore } from '@/store/articleStore';
import { cn } from '@/lib/utils';
import { PenLine, ChevronLeft, ChevronRight, BookOpen, CheckCircle, GitBranch, Save, RotateCcw, AlertTriangle, X } from 'lucide-react';

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

const goldenSentences = [
  '创作的本质，是用思想点亮他人的旅程。',
  '每一个字符背后，都是对世界更深的理解。',
  '技术为笔，思想为墨，书写属于这个时代的篇章。',
];

const expandCaseTexts: Record<string, string> = {
  '轻度': `\n\n三、实战案例解析\n\n以某新锐茶饮品牌"茶语轩"为例，该品牌通过精准的数字化内容营销策略，在短短半年内实现了品牌知名度的显著提升。`,
  '适中': `\n\n三、实战案例解析\n\n以某新锐茶饮品牌"茶语轩"为例，该品牌通过精准的数字化内容营销策略，在短短半年内实现了品牌知名度87%的提升和线上订单量156%的增长。其核心策略在于：首先，通过数据分析锁定了25-35岁的都市白领人群，将其作为核心目标受众；其次，围绕"健康、品质、生活方式"三大关键词构建了完整的内容矩阵；最后，结合小红书、抖音等平台的特性，定制化产出符合平台生态的优质内容，形成了从种草到转化的完整闭环。`,
  '详细': `\n\n三、实战案例解析\n\n以某新锐茶饮品牌"茶语轩"为例，该品牌通过精准的数字化内容营销策略，在2024年上半年短短6个月内实现了品牌知名度87%的提升、线上订单量156%的增长以及会员复购率42%的优异成绩，成为新消费领域内容营销的标杆案例。\n\n其核心策略在于多维度的系统化布局：首先，通过全网用户行为数据分析，精准锁定了25-35岁的一二线城市都市白领人群，将其作为核心目标受众，并深度洞察了这一群体"追求品质生活、注重健康理念、乐于社交分享"的消费特征；其次，围绕"健康、品质、生活方式"三大核心关键词构建了完整的内容矩阵，涵盖产品故事、原料溯源、制茶工艺、生活美学等多个维度，确保内容的深度与广度；再次，结合小红书、抖音、微信公众号等主流平台的内容生态特性，定制化产出符合平台用户习惯的优质内容，小红书侧重图文笔记与达人种草，抖音侧重短视频与直播互动，公众号侧重深度品牌故事与用户社群运营；最后，建立了完善的数据监测与优化体系，通过实时追踪内容曝光量、互动率、转化率等关键指标，持续迭代内容策略，形成了从内容种草、用户互动到最终转化的完整营销闭环。该案例充分证明了，在数字化时代，系统化、数据驱动的内容创作策略能够为品牌带来持续且可观的商业价值。`,
};

const toneLabelMap = { formal: '正式', casual: '轻松', professional: '专业', literary: '文艺' };

export default function WritingDesk() {
  const { id } = useParams<{ id: string }>();
  const articleId = id || 'default';
  const storageKey = `mobi_draft_${articleId}`;
  const appendStorageKey = `mobi_draft_content_${articleId}`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [outlineCollapsed, setOutlineCollapsed] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('sec-2');
  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      let baseContent = saved || sampleContent;
      const appended = localStorage.getItem(appendStorageKey);
      if (appended && appended.length > 0) {
        baseContent = baseContent + appended;
        localStorage.removeItem(appendStorageKey);
      }
      return baseContent;
    } catch {
      return sampleContent;
    }
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { saveDraftVersion, getDraftVersions } = useArticleStore();
  const opsStorageKey = `mobi_ai_ops_${articleId}`;
  const MAX_OPERATIONS = 20;

  const [aiOperations, setAiOperations] = useState<AIOperation[]>(() => {
    try {
      const saved = localStorage.getItem(opsStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const wordCount = content.replace(/\s/g, '').length;
  const targetWordCount = 3700;

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draftNote, setDraftNote] = useState('');
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const [diffVersion, setDiffVersion] = useState<DraftVersion | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<DraftVersion | null>(null);
  const [draftVersions, setDraftVersions] = useState<DraftVersion[]>([]);

  const refreshDraftVersions = useCallback(() => {
    setDraftVersions(getDraftVersions(articleId));
  }, [articleId, getDraftVersions]);

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(opsStorageKey, JSON.stringify(aiOperations));
    } catch {
      // ignore
    }
  }, [aiOperations, opsStorageKey]);

  const addOperation = useCallback((op: Omit<AIOperation, 'id' | 'timestamp'>) => {
    const newOp: AIOperation = {
      ...op,
      id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setAiOperations((prev) => {
      const updated = [newOp, ...prev];
      return updated.slice(0, MAX_OPERATIONS);
    });
  }, []);

  const handleJumpTo = useCallback((position: number) => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const safePos = Math.min(Math.max(0, position), content.length);
    ta.setSelectionRange(safePos, safePos);
    const lineHeight = 24;
    const linesBefore = content.slice(0, safePos).split('\n').length;
    ta.scrollTop = Math.max(0, linesBefore * lineHeight - 100);
  }, [content]);

  const handleUndo = useCallback((opId: string) => {
    const op = aiOperations.find((o) => o.id === opId);
    if (!op) return;

    const sortedOps = [...aiOperations].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const latestOp = sortedOps[0];

    if (op.id !== latestOp?.id) {
      showToastMessage('只能撤销最近一次 AI 操作');
      return;
    }

    const currentText = content.slice(op.position, op.position + op.newText.length);
    if (currentText !== op.newText) {
      showToastMessage('内容已变更，无法撤销该操作');
      setAiOperations((prev) => prev.filter((o) => o.id !== opId));
      return;
    }

    const newContent = content.slice(0, op.position) + op.oldText + content.slice(op.position + op.newText.length);
    setContent(newContent);
    setAiOperations((prev) => prev.filter((o) => o.id !== opId));
    showToastMessage(`已撤销「${op.label}」`);

    setTimeout(() => {
      handleJumpTo(op.position);
    }, 50);
  }, [aiOperations, content, showToastMessage, handleJumpTo]);

  const handleUndoLatest = useCallback(() => {
    const sortedOps = [...aiOperations].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const latestOp = sortedOps[0];
    if (latestOp) {
      handleUndo(latestOp.id);
    }
  }, [aiOperations, handleUndo]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      let baseContent = saved || sampleContent;
      const appended = localStorage.getItem(appendStorageKey);
      if (appended && appended.length > 0) {
        baseContent = baseContent + appended;
        localStorage.removeItem(appendStorageKey);
      }
      setContent(baseContent);
    } catch {
      // ignore
    }
  }, [storageKey, appendStorageKey]);

  const onApplyTone = useCallback((tone: AITone, _selectedText?: string): string => {
    const ta = textareaRef.current;
    if (!ta) return content;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    let targetText: string;
    let replaceStart: number, replaceEnd: number;

    if (start !== end) {
      targetText = content.slice(start, end);
      replaceStart = start;
      replaceEnd = end;
    } else {
      const beforeCursor = content.slice(0, start);
      const afterCursor = content.slice(start);
      const paraStart = beforeCursor.lastIndexOf('\n\n') !== -1 ? beforeCursor.lastIndexOf('\n\n') + 2 : 0;
      const paraEnd = afterCursor.indexOf('\n\n') !== -1 ? start + afterCursor.indexOf('\n\n') : content.length;
      targetText = content.slice(paraStart, paraEnd);
      replaceStart = paraStart;
      replaceEnd = paraEnd;
    }

    let modified = targetText;
    switch (tone) {
      case 'formal':
        modified = modified.replace(/你/g, '您').replace(/所以/g, '据此，').replace(/但是/g, '然而，');
        if (!modified.includes('综上所述')) modified += '\n\n综上所述，以上分析充分体现了相关内容的重要价值。';
        break;
      case 'casual':
        modified = modified.replace(/因此/g, '所以呀').replace(/然而/g, '不过嘛').replace(/。/g, '~').replace(/！/g, '啦！');
        modified = modified.replace(/重要/g, '超级重要').replace(/需要/g, '得');
        break;
      case 'professional':
        modified = modified.replace(/用户/g, '目标受众').replace(/好处/g, '核心价值').replace(/用了/g, '采用了').replace(/很多/g, '大量');
        modified = modified.replace(/我觉得/g, '根据行业分析显示');
        break;
      case 'literary':
        modified = modified.replace(/重要/g, '至关重要且不可替代的').replace(/发展/g, '蓬勃向上的发展').replace(/好/g, '美好而令人向往');
        modified = modified.replace(/内容/g, '饱含温度的文字内容').replace(/写/g, '用心编织');
        break;
    }

    const newContent = content.slice(0, replaceStart) + modified + content.slice(replaceEnd);

    if (targetText !== modified) {
      addOperation({
        type: 'tone',
        label: `改写为${toneLabelMap[tone]}语气`,
        position: replaceStart,
        length: modified.length,
        oldText: targetText,
        newText: modified,
      });
    }

    setContent(newContent);

    if (targetText !== modified) {
      const note = `AI 改写为「${toneLabelMap[tone]}」语气`;
      setTimeout(() => {
        saveDraftVersion(articleId, newContent, note, 'ai_tone');
        refreshDraftVersions();
      }, 0);
    }

    showToastMessage(`已将${start !== end ? '所选内容' : '当前段落'}改写为「${toneLabelMap[tone]}」语气`);
    return newContent;
  }, [content, showToastMessage, addOperation, articleId, saveDraftVersion, refreshDraftVersions]);

  const onExpand = useCallback((level: string): string => {
    const ta = textareaRef.current;
    const caseText = expandCaseTexts[level] || expandCaseTexts['适中'];
    let insertPos = content.length;
    if (ta) {
      const cursorPos = ta.selectionStart;
      if (cursorPos > 0) {
        insertPos = cursorPos;
      }
    }

    addOperation({
      type: 'expand',
      label: `${level}案例扩写`,
      position: insertPos,
      length: caseText.length,
      oldText: '',
      newText: caseText,
    });

    const newContent = content.slice(0, insertPos) + caseText + content.slice(insertPos);
    setContent(newContent);

    const note = `AI 扩写案例（${level}）`;
    setTimeout(() => {
      saveDraftVersion(articleId, newContent, note, 'ai_expand');
      refreshDraftVersions();
    }, 0);

    showToastMessage(`已追加${level}案例段落`);
    return newContent;
  }, [content, showToastMessage, addOperation, articleId, saveDraftVersion, refreshDraftVersions]);

  const onInsertGolden = useCallback((index: number): string => {
    const ta = textareaRef.current;
    const actualIndex = index % goldenSentences.length;
    const golden = `「${goldenSentences[actualIndex]}」`;
    const insertedText = '\n\n' + golden + '\n\n';
    let insertPos: number;
    if (ta) {
      const cursorPos = ta.selectionStart;
      if (cursorPos > 0 && cursorPos < content.length) {
        insertPos = cursorPos;
      } else {
        insertPos = content.length;
        const lastParaBreak = content.lastIndexOf('\n\n');
        if (lastParaBreak !== -1) {
          insertPos = lastParaBreak + 2;
        }
      }
    } else {
      insertPos = content.length;
    }

    addOperation({
      type: 'golden',
      label: '插入金句',
      position: insertPos,
      length: insertedText.length,
      oldText: '',
      newText: insertedText,
    });

    const newContent = content.slice(0, insertPos) + insertedText + content.slice(insertPos);
    setContent(newContent);

    const note = 'AI 插入金句';
    setTimeout(() => {
      saveDraftVersion(articleId, newContent, note, 'ai_golden');
      refreshDraftVersions();
    }, 0);

    showToastMessage('金句已插入');
    return newContent;
  }, [content, showToastMessage, addOperation, articleId, saveDraftVersion, refreshDraftVersions]);

  const onPolish = useCallback((_options: string[]): string => {
    const oldContent = content;
    let newContent = content
      .replace(/非常/g, '尤为')
      .replace(/但是/g, '然而')
      .replace(/所以/g, '因此')
      .replace(/，，/g, '，')
      .replace(/。。/g, '。')
      .replace(/！！/g, '！')
      .replace(/？？/g, '？')
      .replace(/\s+([，。！？；：])/g, '$1');

    if (oldContent !== newContent) {
      addOperation({
        type: 'polish',
        label: '全文润色',
        position: 0,
        length: newContent.length,
        oldText: oldContent,
        newText: newContent,
      });
    }

    setContent(newContent);

    if (oldContent !== newContent) {
      const note = 'AI 全文润色';
      setTimeout(() => {
        saveDraftVersion(articleId, newContent, note, 'ai_tone');
        refreshDraftVersions();
      }, 0);
    }

    showToastMessage('润色完成');
    return newContent;
  }, [content, showToastMessage, addOperation, articleId, saveDraftVersion, refreshDraftVersions]);

  const handleSaveDraft = useCallback(() => {
    setDraftNote('');
    setShowSaveModal(true);
  }, []);

  const confirmSaveDraft = useCallback(() => {
    const note = draftNote.trim() || '手动保存';
    const newVersion = saveDraftVersion(articleId, content, note, 'manual');
    showToastMessage(`已保存第 ${newVersion.versionNumber} 版草稿`);
    setShowSaveModal(false);
    setDraftNote('');
    refreshDraftVersions();
  }, [articleId, content, draftNote, saveDraftVersion, showToastMessage, refreshDraftVersions]);

  const handleViewVersion = useCallback((version: DraftVersion) => {
    setDiffVersion(version);
  }, []);

  const handleRestoreVersion = useCallback((version: DraftVersion) => {
    setVersionToRestore(version);
    setShowRestoreConfirm(true);
  }, []);

  const confirmRestore = useCallback(() => {
    if (!versionToRestore) return;

    const preRestoreNote = `恢复前的版本（恢复到第 ${versionToRestore.versionNumber} 版前）`;
    saveDraftVersion(articleId, content, preRestoreNote, 'manual');

    setContent(versionToRestore.content);
    localStorage.setItem(storageKey, versionToRestore.content);

    showToastMessage(`已恢复到第 ${versionToRestore.versionNumber} 版`);
    setShowRestoreConfirm(false);
    setVersionToRestore(null);
    setDiffVersion(null);
    setShowVersionPanel(false);
    refreshDraftVersions();
  }, [versionToRestore, articleId, content, saveDraftVersion, storageKey, showToastMessage, refreshDraftVersions]);

  useEffect(() => {
    refreshDraftVersions();
  }, [refreshDraftVersions]);

  return (
    <div className="h-screen bg-paper-100 flex flex-col overflow-hidden relative">
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
          <div className="flex items-center gap-2 px-5 py-3 bg-ink-800/95 text-white rounded-xl shadow-lg backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 text-moss" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

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
          <button
            onClick={() => setShowVersionPanel(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink-600 bg-ink-50 rounded-lg hover:bg-ink-100 transition-colors"
          >
            <GitBranch className="w-4 h-4" />
            <span>版本历史</span>
            {draftVersions.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-vermilion text-white rounded-full">
                {draftVersions.length}
              </span>
            )}
          </button>
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-600 transition-colors"
          >
            <Save className="w-4 h-4" />
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
            <RichEditor ref={textareaRef} content={content} onChange={setContent} />
          </div>
          <WritingProgress
            currentWords={wordCount}
            targetWords={targetWordCount}
            outlineCompleteRate={65}
            estimatedTime="约45分钟"
          />
        </main>

        <aside className="w-72 bg-white border-l border-ink-100 overflow-y-auto flex-shrink-0">
          <AIToolbox
            onApplyTone={onApplyTone}
            onExpand={onExpand}
            onInsertGolden={onInsertGolden}
            onPolish={onPolish}
          />
          <AIOperationHistory
            operations={aiOperations}
            onJumpTo={handleJumpTo}
            onUndo={handleUndo}
            onUndoLatest={handleUndoLatest}
          />
        </aside>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-vermilion-50 rounded-xl flex items-center justify-center">
                  <Save className="w-4 h-4 text-vermilion" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink-800">保存草稿版本</h3>
                  <p className="text-xs text-ink-400">记录本次修改的内容</p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-ink-700 mb-2">
                  版本备注
                </label>
                <textarea
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="这个版本改了什么？可选..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-300 focus:outline-none focus:border-vermilion-300 focus:ring-2 focus:ring-vermilion-50 transition-all"
                  autoFocus
                />
              </div>
              <div className="text-xs text-ink-400 bg-ink-50 rounded-xl p-3 space-y-1">
                <p>将基于当前正文内容创建新版本快照</p>
                <p>版本号将自动递增</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-100 bg-ink-50">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-xl hover:bg-ink-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmSaveDraft}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-vermilion rounded-xl hover:bg-vermilion-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存版本
              </button>
            </div>
          </div>
        </div>
      )}

      {showVersionPanel && (
        <div className="fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-2xl border-l border-ink-100 animate-in slide-in-from-right duration-300">
          <DraftVersionPanel
            versions={draftVersions}
            currentContent={content}
            onView={handleViewVersion}
            onRestore={handleRestoreVersion}
            onClose={() => setShowVersionPanel(false)}
          />
        </div>
      )}

      {diffVersion && (
        <DraftDiffModal
          version={diffVersion}
          currentContent={content}
          onClose={() => setDiffVersion(null)}
          onRestore={() => {
            setVersionToRestore(diffVersion);
            setShowRestoreConfirm(true);
          }}
        />
      )}

      {showRestoreConfirm && versionToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-gold-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-ink-800 mb-1">确认恢复版本</h3>
                  <p className="text-sm text-ink-500">
                    确定要恢复到 <span className="font-semibold text-vermilion">第 {versionToRestore.versionNumber} 版</span> 吗？
                  </p>
                  <p className="text-xs text-ink-400 mt-2">
                    当前内容会被自动保存为新版本，以防后悔
                  </p>
                </div>
              </div>
              {versionToRestore.note && (
                <div className="mt-4 p-3 bg-ink-50 rounded-xl">
                  <p className="text-xs text-ink-400 mb-1">版本备注</p>
                  <p className="text-sm text-ink-600">{versionToRestore.note}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-100 bg-ink-50">
              <button
                onClick={() => {
                  setShowRestoreConfirm(false);
                  setVersionToRestore(null);
                }}
                className="px-4 py-2 text-sm font-medium text-ink-600 bg-white border border-ink-200 rounded-xl hover:bg-ink-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmRestore}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-vermilion rounded-xl hover:bg-vermilion-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                确认恢复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
