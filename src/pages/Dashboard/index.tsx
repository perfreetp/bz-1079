import {

  Eye,
  Heart,
  Share2,
  FileCheck,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Flame,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { tasks, hotTopics, weeklyMetrics } from '@/data/articles';
import type { Task, HotTopic, ArticleStatus } from '@/types';
import CalendarPanel from './CalendarPanel';

const statusTextMap: Record<ArticleStatus, string> = {
  draft: '草稿',
  topic: '选题',
  outline: '大纲',
  writing: '撰写中',
  review: '审核中',
  ready: '待发布',
  published: '已发布',
  archived: '已归档',
};

const statusColorMap: Record<ArticleStatus, string> = {
  draft: 'bg-ink-100 text-ink-500',
  topic: 'bg-gold-50 text-gold-600',
  outline: 'bg-moss-50 text-moss-500',
  writing: 'bg-vermilion-50 text-vermilion-600',
  review: 'bg-ink-200 text-ink-600',
  ready: 'bg-moss-100 text-moss-600',
  published: 'bg-paper-300 text-ink-600',
  archived: 'bg-ink-100 text-ink-400',
};

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  iconBg,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-paper rounded-2xl p-5 shadow-paper hover:shadow-paper-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend === 'up' ? 'text-moss-500' : 'text-vermilion-500'
          )}
        >
          {trend === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-ink-800 font-serif">{value}</div>
        <div className="text-sm text-ink-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'published';
  const daysLeft = Math.ceil(
    (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-paper rounded-xl p-4 shadow-paper hover:shadow-paper-hover transition-all hover:-translate-y-0.5 cursor-pointer group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-ink-800 text-sm line-clamp-1 group-hover:text-vermilion transition-colors">
            {task.title}
          </h4>
          <p className="text-xs text-ink-400 mt-1">{task.topic}</p>
        </div>
        <span
          className={cn(
            'shrink-0 text-xs px-2 py-0.5 rounded-md font-medium',
            statusColorMap[task.status]
          )}
        >
          {statusTextMap[task.status]}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-ink-400 mb-1.5">
          <span>进度 {task.progress}%</span>
          <span className={cn('flex items-center gap-1', isOverdue && 'text-vermilion-500')}>
            {isOverdue ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {isOverdue ? `已逾期${Math.abs(daysLeft)}天` : `剩余${daysLeft}天`}
          </span>
        </div>
        <div className="h-1.5 bg-paper-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              task.progress === 100
                ? 'bg-moss-500'
                : task.progress >= 70
                ? 'bg-moss-400'
                : task.progress >= 30
                ? 'bg-gold-400'
                : 'bg-vermilion-400'
            )}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function HotTopicItem({ topic }: { topic: HotTopic }) {
  return (
    <div className="flex items-center gap-3 py-2.5 hover:bg-paper-100 -mx-2 px-2 rounded-lg transition-colors cursor-pointer group">
      <span
        className={cn(
          'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0',
          topic.rank === 1
            ? 'bg-vermilion-500 text-white'
            : topic.rank === 2
            ? 'bg-gold-400 text-white'
            : topic.rank === 3
            ? 'bg-gold-300 text-white'
            : 'bg-paper-200 text-ink-500'
        )}
      >
        {topic.rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-700 line-clamp-1 group-hover:text-vermilion transition-colors">
          {topic.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-ink-400">{topic.category}</span>
          <span className="text-xs text-ink-300">·</span>
          <span className="text-xs text-ink-400">{(topic.heat / 1000).toFixed(1)}k</span>
        </div>
      </div>
      {topic.trend === 'up' ? (
        <TrendingUp className="w-3.5 h-3.5 text-vermilion-500 shrink-0" />
      ) : topic.trend === 'down' ? (
        <TrendingDown className="w-3.5 h-3.5 text-moss-500 shrink-0" />
      ) : (
        <div className="w-3.5 h-0.5 bg-ink-300 rounded shrink-0" />
      )}
    </div>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-ink-800 font-serif flex items-center gap-2">
        {title === '待写任务' && <Clock className="w-4 h-4 text-vermilion-500" />}
        {title === '近期热点' && <Flame className="w-4 h-4 text-vermilion-500" />}
        {title}
      </h3>
      <button className="flex items-center gap-0.5 text-sm text-ink-400 hover:text-vermilion transition-colors">
        查看全部
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const totalReads = weeklyMetrics.reduce((sum, m) => sum + m.reads, 0);
  const totalFavorites = weeklyMetrics.reduce((sum, m) => sum + m.favorites, 0);
  const totalShares = weeklyMetrics.reduce((sum, m) => sum + m.shares, 0);
  const completedArticles = tasks.filter((t) => t.progress === 100).length;

  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-800 font-serif">工作台</h1>
          <p className="text-sm text-ink-400 mt-1">欢迎回来，今天也要好好创作哦～</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Eye}
            label="近7天阅读数"
            value={totalReads.toLocaleString()}
            change="12.5%"
            trend="up"
            iconBg="bg-vermilion-50"
            iconColor="text-vermilion-500"
          />
          <StatCard
            icon={Heart}
            label="近7天收藏数"
            value={totalFavorites.toLocaleString()}
            change="8.3%"
            trend="up"
            iconBg="bg-gold-50"
            iconColor="text-gold-500"
          />
          <StatCard
            icon={Share2}
            label="近7天转发数"
            value={totalShares.toLocaleString()}
            change="3.2%"
            trend="down"
            iconBg="bg-moss-50"
            iconColor="text-moss-500"
          />
          <StatCard
            icon={FileCheck}
            label="完成文章数"
            value={`${completedArticles}篇`}
            change="1篇"
            trend="up"
            iconBg="bg-ink-100"
            iconColor="text-ink-600"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <div className="bg-paper rounded-2xl p-5 shadow-paper h-full">
              <SectionHeader title="待写任务" to="/tasks" />
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-paper rounded-2xl p-5 shadow-paper h-full">
              <SectionHeader title="近期热点" to="/hot" />
              <div className="-my-1">
                {hotTopics.slice(0, 6).map((topic) => (
                  <HotTopicItem key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <CalendarPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
