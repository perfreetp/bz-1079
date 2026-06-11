import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import ProgressBar from '@/components/ui/ProgressBar'
import type { HotTopic } from '@/types'

interface HotTopicListProps {
  topics: HotTopic[]
  className?: string
}

function TrendIcon({ trend }: { trend: HotTopic['trend'] }) {
  if (trend === 'up') {
    return <TrendingUp className="w-4 h-4 text-vermilion" />
  }
  if (trend === 'down') {
    return <TrendingDown className="w-4 h-4 text-moss" />
  }
  return <Minus className="w-4 h-4 text-ink-400" />
}

function getRankClass(rank: number): string {
  if (rank === 1) return 'bg-vermilion text-paper-50'
  if (rank === 2) return 'bg-gold text-paper-50'
  if (rank === 3) return 'bg-gold-300 text-paper-50'
  return 'bg-paper-200 text-ink-500'
}

export default function HotTopicList({ topics, className }: HotTopicListProps) {
  const maxHeat = Math.max(...topics.map((t) => t.heat), 1)

  return (
    <div className={cn('space-y-3', className)}>
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-paper-50 transition-colors"
        >
          <span
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0',
              getRankClass(topic.rank)
            )}
          >
            {topic.rank}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-sm font-medium text-ink-800 truncate">{topic.title}</p>
              <span className="text-xs text-ink-400 flex-shrink-0">{topic.category}</span>
            </div>
            <ProgressBar value={topic.heat} max={maxHeat} color="vermilion" />
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-sm font-semibold text-ink-700">{topic.heat}</span>
            <TrendIcon trend={topic.trend} />
          </div>
        </div>
      ))}
    </div>
  )
}
