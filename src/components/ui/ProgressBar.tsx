import { cn } from '@/lib/utils'

type ProgressColor = 'vermilion' | 'moss' | 'gold' | 'ink'

interface ProgressBarProps {
  value: number
  max?: number
  color?: ProgressColor
  showLabel?: boolean
  className?: string
}

const colorClasses: Record<ProgressColor, string> = {
  vermilion: 'bg-vermilion',
  moss: 'bg-moss',
  gold: 'bg-gold',
  ink: 'bg-ink-800',
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'vermilion',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 w-full rounded-full bg-paper-200 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-out', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-ink-400">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}
