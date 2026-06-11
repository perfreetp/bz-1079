import { useState } from 'react';
import type { OutlineSection } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';

interface OutlineTreeProps {
  data: OutlineSection[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: (parentId?: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

interface TreeNodeProps {
  section: OutlineSection;
  depth: number;
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: (parentId?: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

function TreeNode({ section, depth, selectedId, onSelect, onAdd, onDelete, onRename }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(section.title);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const hasChildren = section.children && section.children.length > 0;
  const isSelected = selectedId === section.id;

  const handleStartRename = () => {
    setEditValue(section.title);
    setIsEditing(true);
  };

  const handleConfirmRename = () => {
    if (editValue.trim()) {
      onRename(section.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditValue(section.title);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'select-none',
        isDragOver && 'border-l-2 border-vermilion'
      )}
    >
      <div
        className={cn(
          'group flex items-center gap-1 py-2 px-2 rounded-lg cursor-pointer transition-all duration-150',
          isDragging && 'opacity-50',
          isSelected ? 'bg-vermilion-50 border border-vermilion-100' : 'hover:bg-ink-50',
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        draggable
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          setIsDragOver(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={() => setIsDragOver(false)}
        onClick={() => onSelect(section.id)}
      >
        <span className="cursor-grab active:cursor-grabbing text-ink-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
        </span>

        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-ink-400 hover:text-ink-700 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5 h-5 flex-shrink-0" />
        )}

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-vermilion-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-vermilion"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirmRename();
                if (e.key === 'Escape') handleCancelRename();
              }}
            />
            <button
              onClick={handleConfirmRename}
              className="p-1 text-moss hover:bg-moss-50 rounded transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelRename}
              className="p-1 text-ink-400 hover:bg-ink-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-sm text-ink-700 truncate">
              {section.title}
            </span>

            <span className="flex-shrink-0 px-2 py-0.5 text-xs text-gold-600 bg-gold-50 rounded-full font-medium">
              {section.wordEstimate.toLocaleString()}
            </span>

            <div className="flex-shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(section.id);
                }}
                className="p-1 text-ink-400 hover:text-moss hover:bg-moss-50 rounded transition-colors"
                title="添加子章节"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartRename();
                }}
                className="p-1 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded transition-colors"
                title="重命名"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('确定删除此章节及其子章节吗？')) {
                    onDelete(section.id);
                  }
                }}
                className="p-1 text-ink-400 hover:text-vermilion hover:bg-vermilion-50 rounded transition-colors"
                title="删除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {hasChildren && expanded && (
        <div>
          {section.children!.map((child) => (
            <TreeNode
              key={child.id}
              section={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAdd={onAdd}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OutlineTree({ data, selectedId, onSelect, onAdd, onDelete, onRename }: OutlineTreeProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink-700">文章大纲</h2>
          <span className="text-xs text-ink-400">{data.length} 个一级章节</span>
        </div>
        <button
          onClick={() => onAdd()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-vermilion text-white text-sm font-medium rounded-lg hover:bg-vermilion-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加章节
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {data.map((section) => (
          <TreeNode
            key={section.id}
            section={section}
            depth={0}
            selectedId={selectedId}
            onSelect={onSelect}
            onAdd={onAdd}
            onDelete={onDelete}
            onRename={onRename}
          />
        ))}
      </div>
    </div>
  );
}
