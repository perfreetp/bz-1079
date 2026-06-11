import { cn } from '@/lib/utils'
import type { ArticleStatus } from '@/types'

export function getStatusText(status: ArticleStatus): string {
  const map: Record<ArticleStatus, string> = {
    draft: '草稿',
    topic: '选题阶段',
    outline: '大纲构建',
    writing: '撰写中',
    review: '待审核',
    ready: '待发布',
    published: '已发布',
    archived: '已归档',
  }
  return map[status]
}

export function getStatusColor(status: ArticleStatus): string {
  const map: Record<ArticleStatus, string> = {
    draft: 'tag-ink',
    topic: 'tag-gold',
    outline: 'tag-gold',
    writing: 'tag-vermilion',
    review: 'tag-gold',
    ready: 'tag-moss',
    published: 'tag-moss',
    archived: 'tag-ink',
  }
  return map[status]
}

interface StatusBadgeProps {
  status: ArticleStatus
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(getStatusColor(status), className)}>
      {getStatusText(status)}
    </span>
  )
}
