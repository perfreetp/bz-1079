import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Image,
  Undo,
  Redo,
} from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (value: string) => void;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title: string;
}

function ToolButton({ icon, active, onClick, title }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150',
        active
          ? 'bg-vermilion-100 text-vermilion'
          : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
      )}
    >
      {icon}
    </button>
  );
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  const wordCount = content.replace(/\s/g, '').length;
  const charCount = content.length;

  useEffect(() => {
    const lines = content.split('\n');
    setLineNumbers(lines.map((_, i) => i + 1));
  }, [content]);

  const tools = [
    { id: 'bold', icon: <Bold className="w-4 h-4" />, title: '加粗 (Ctrl+B)' },
    { id: 'italic', icon: <Italic className="w-4 h-4" />, title: '斜体 (Ctrl+I)' },
    { id: 'divider1', divider: true },
    { id: 'h1', icon: <Heading1 className="w-4 h-4" />, title: '标题 1' },
    { id: 'h2', icon: <Heading2 className="w-4 h-4" />, title: '标题 2' },
    { id: 'h3', icon: <Heading3 className="w-4 h-4" />, title: '标题 3' },
    { id: 'divider2', divider: true },
    { id: 'quote', icon: <Quote className="w-4 h-4" />, title: '引用' },
    { id: 'unordered', icon: <List className="w-4 h-4" />, title: '无序列表' },
    { id: 'ordered', icon: <ListOrdered className="w-4 h-4" />, title: '有序列表' },
    { id: 'divider3', divider: true },
    { id: 'image', icon: <Image className="w-4 h-4" />, title: '插入图片' },
    { id: 'divider4', divider: true },
    { id: 'undo', icon: <Undo className="w-4 h-4" />, title: '撤销 (Ctrl+Z)' },
    { id: 'redo', icon: <Redo className="w-4 h-4" />, title: '重做 (Ctrl+Y)' },
  ];

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    setTimeout(() => setActiveTool(null), 200);

    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = content.slice(start, end);

      let wrapped = '';
      let cursorOffset = 0;

      switch (toolId) {
        case 'bold':
          wrapped = `**${selected || '粗体文本'}**`;
          cursorOffset = selected ? wrapped.length : 2;
          break;
        case 'italic':
          wrapped = `*${selected || '斜体文本'}*`;
          cursorOffset = selected ? wrapped.length : 1;
          break;
        case 'h1':
          wrapped = `\n# ${selected || '一级标题'}\n`;
          cursorOffset = selected ? wrapped.length : 3;
          break;
        case 'h2':
          wrapped = `\n## ${selected || '二级标题'}\n`;
          cursorOffset = selected ? wrapped.length : 4;
          break;
        case 'h3':
          wrapped = `\n### ${selected || '三级标题'}\n`;
          cursorOffset = selected ? wrapped.length : 5;
          break;
        case 'quote':
          wrapped = `\n> ${selected || '引用文本'}\n`;
          cursorOffset = selected ? wrapped.length : 3;
          break;
        case 'unordered':
          wrapped = `\n- ${selected || '列表项'}\n`;
          cursorOffset = selected ? wrapped.length : 3;
          break;
        case 'ordered':
          wrapped = `\n1. ${selected || '列表项'}\n`;
          cursorOffset = selected ? wrapped.length : 4;
          break;
        case 'image':
          wrapped = `\n![图片描述](图片链接)\n`;
          cursorOffset = 3;
          break;
        default:
          return;
      }

      const newContent = content.slice(0, start) + wrapped + content.slice(end);
      onChange(newContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start + cursorOffset, start + cursorOffset);
        }
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-ink-100 px-6 py-2.5 flex items-center gap-1 sticky top-0 z-10">
        {tools.map((tool) =>
          tool.divider ? (
            <div
              key={tool.id}
              className="w-px h-5 bg-ink-100 mx-1"
            />
          ) : (
            <ToolButton
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              active={activeTool === tool.id}
              onClick={() => handleToolClick(tool.id)}
            />
          )
        )}
      </div>

      <div className="flex-1 flex justify-center py-8 px-4 overflow-x-auto">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-paper border border-paper-200 relative">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 31px,
                rgba(200, 75, 49, 0.05) 31px,
                rgba(200, 75, 49, 0.05) 32px
              )`,
            }}
          />

          <div className="relative flex min-h-[600px]">
            <div className="flex-shrink-0 py-8 px-4 bg-paper-50/50 border-r border-paper-200 rounded-l-xl select-none">
              <div className="space-y-[2px]">
                {lineNumbers.map((num) => (
                  <div
                    key={num}
                    className="text-xs text-ink-300 text-right font-mono leading-8 min-w-[2rem]"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 bg-transparent resize-none focus:outline-none p-8 text-ink-800 leading-8 font-serif text-base placeholder:text-ink-300"
              placeholder="开始写作..."
              spellCheck={false}
            />
          </div>

          <div className="absolute bottom-3 right-4 text-xs text-ink-400 flex items-center gap-3">
            <span>{wordCount.toLocaleString()} 字</span>
            <span className="text-ink-200">|</span>
            <span>{charCount.toLocaleString()} 字符</span>
          </div>
        </div>
      </div>
    </div>
  );
}
