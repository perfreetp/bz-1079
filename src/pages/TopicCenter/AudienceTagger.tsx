import { useState } from 'react';
import { Users, Plus, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagGroup {
  category: string;
  options: string[];
}

const TAG_GROUPS: TagGroup[] = [
  {
    category: '年龄',
    options: ['18岁以下', '18-24岁', '25-34岁', '35-44岁', '45-54岁', '55岁以上'],
  },
  {
    category: '性别',
    options: ['男性', '女性', '不限'],
  },
  {
    category: '地域',
    options: ['一线城市', '新一线城市', '二线城市', '三四线城市', '下沉市场', '海外'],
  },
  {
    category: '职业',
    options: ['学生', '职场新人', '白领', '管理层', '创业者', '自由职业', '退休人群'],
  },
  {
    category: '兴趣爱好',
    options: ['科技数码', '时尚美妆', '运动健身', '美食烹饪', '旅游出行', '投资理财', '育儿亲子', '文娱影视', '读书学习'],
  },
];

export default function AudienceTagger() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['25-34岁', '白领', '科技数码']);
  const [customTag, setCustomTag] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string>('年龄');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
      setCustomTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <Users className="w-4 h-4 text-vermilion-500" />
          受众标注
        </h3>
        <span className="text-xs text-ink-400">
          已选 <span className="text-vermilion-500 font-medium">{selectedTags.length}</span> 个标签
        </span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-ink-500 mb-2">已选标签</p>
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-paper-50 rounded-lg border border-paper-200">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-vermilion-50 text-vermilion-600 text-xs rounded-md font-medium"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 hover:text-vermilion-800 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[36px] bg-paper-50 rounded-lg border border-dashed border-paper-200 text-xs text-ink-400">
            暂未选择标签，请从下方选择
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="输入自定义标签..."
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-4 py-2 bg-paper-50 border border-paper-200 rounded-lg text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-vermilion-200 focus:border-vermilion-300 transition-all"
          />
        </div>
        <button
          onClick={addCustomTag}
          disabled={!customTag.trim()}
          className="px-4 py-2 bg-ink-800 text-paper text-xs font-medium rounded-lg hover:bg-ink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          添加
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3">
        {TAG_GROUPS.map((group) => {
          const isExpanded = expandedCategory === group.category;
          const selectedCount = group.options.filter((o) => selectedTags.includes(o)).length;

          return (
            <div key={group.category} className="border border-paper-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? '' : group.category)}
                className="w-full flex items-center justify-between px-4 py-3 bg-paper-50 hover:bg-paper-100 transition-colors"
              >
                <span className="text-sm font-medium text-ink-700 flex items-center gap-2">
                  {group.category}
                  {selectedCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-vermilion-500 text-paper text-[10px] font-bold rounded">
                      {selectedCount}
                    </span>
                  )}
                </span>
                <X
                  className={cn(
                    'w-4 h-4 text-ink-400 transition-transform',
                    !isExpanded && '-rotate-45'
                  )}
                />
              </button>
              {isExpanded && (
                <div className="p-3 flex flex-wrap gap-1.5 bg-paper">
                  {group.options.map((option) => {
                    const isSelected = selectedTags.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => toggleTag(option)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                          isSelected
                            ? 'bg-vermilion-500 text-white shadow-sm'
                            : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
