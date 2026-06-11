import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onClick?: () => void
  className?: string
}

export default function TaskCard({ task, onClick, className }: TaskCardProps) {
  return (
    <div
      className={cn(
        'card-paper card-paper-hover p-5 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-base font-semibold text-ink-800 line-clamp-1">
          {task.title}
        </h3>
        <StatusBadge status={task.status} />
      </div>

      <p className="text-sm text-ink-400 mb-4 line-clamp-1">{task.topic}</p>

      <div className="space-y-3">
        <ProgressBar value={task.progress} color="vermilion" />

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-ink-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>截止 {task.deadline}</span>
          </div>
          <span className="text-ink-500 font-medium">{task.progress}%</span>
        </div>
      </div>
    </div>
  )
}
