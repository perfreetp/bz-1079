import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calendarItems } from '@/data/articles';
import type { ArticleStatus } from '@/types';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const statusBgMap: Record<ArticleStatus, string> = {
  draft: 'bg-ink-100',
  topic: 'bg-gold-100',
  outline: 'bg-moss-100',
  writing: 'bg-vermilion-100',
  review: 'bg-ink-200',
  ready: 'bg-moss-200',
  published: 'bg-moss-300',
  archived: 'bg-ink-100',
};

const statusDotMap: Record<ArticleStatus, string> = {
  draft: 'bg-ink-400',
  topic: 'bg-gold-500',
  outline: 'bg-moss-500',
  writing: 'bg-vermilion-500',
  review: 'bg-ink-500',
  ready: 'bg-moss-600',
  published: 'bg-moss-700',
  archived: 'bg-ink-300',
};

export default function CalendarPanel() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getItemsForDay = (day: number) => {
    const dateStr = formatDate(day);
    return calendarItems.filter((item) => item.date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells: Array<{ day: number | null; items: typeof calendarItems }> = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: null, items: [] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, items: getItemsForDay(day) });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, items: [] });
  }

  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-vermilion-500" />
          发布日历
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-paper-100 text-ink-400 hover:text-ink-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-ink-700 w-20 text-center">
            {year}年{month + 1}月
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-paper-100 text-ink-400 hover:text-ink-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            className={cn(
              'text-center text-xs font-medium py-1.5',
              index === 0 || index === 6 ? 'text-vermilion-500' : 'text-ink-400'
            )}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {cells.map((cell, index) => {
          if (cell.day === null) {
            return <div key={index} className="aspect-square" />;
          }

          const weekday = index % 7;
          const hasItems = cell.items.length > 0;
          const primaryItem = cell.items[0];
          const todayFlag = isToday(cell.day);

          return (
            <div key={index} className="aspect-square relative group">
              <div
                className={cn(
                  'absolute inset-0.5 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all',
                  hasItems && primaryItem ? statusBgMap[primaryItem.status] : 'hover:bg-paper-100',
                  todayFlag && 'ring-2 ring-vermilion-500 ring-offset-1'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    todayFlag
                      ? 'text-vermilion-600'
                      : weekday === 0 || weekday === 6
                      ? 'text-vermilion-400'
                      : hasItems
                      ? 'text-ink-700'
                      : 'text-ink-500'
                  )}
                >
                  {cell.day}
                </span>
                {hasItems && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {cell.items.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className={cn('w-1 h-1 rounded-full', statusDotMap[item.status])}
                      />
                    ))}
                  </div>
                )}
              </div>

              {hasItems && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none">
                  <div className="bg-ink-800 text-paper text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap min-w-[160px]">
                    {cell.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 py-0.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusDotMap[item.status])} />
                        <span className="line-clamp-1">{item.title}</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-2 h-2 bg-ink-800 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-paper-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-moss-700" />
          <span className="text-xs text-ink-500">已发布</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-moss-600" />
          <span className="text-xs text-ink-500">待发布</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-vermilion-500" />
          <span className="text-xs text-ink-500">撰写中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
          <span className="text-xs text-ink-500">选题</span>
        </div>
      </div>
    </div>
  );
}
