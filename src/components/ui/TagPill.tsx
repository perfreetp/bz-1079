import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TagVariant = 'default' | 'vermilion' | 'moss' | 'gold' | 'ink'

interface TagPillProps {
  label: string
  variant?: TagVariant
  selected?: boolean
  closable?: boolean
  onClose?: () => void
  onClick?: () => void
  className?: string
}

const variantClasses: Record<TagVariant, { base: string; selected: string }> = {
  default: {
    base: 'bg-paper-100 text-ink-600 hover:bg-paper-200',
    selected: 'bg-ink-800 text-paper-50',
  },
  vermilion: {
    base: 'bg-vermilion-50 text-vermilion-600 hover:bg-vermilion-100',
    selected: 'bg-vermilion text-paper-50',
  },
  moss: {
    base: 'bg-moss-50 text-moss-600 hover:bg-moss-100',
    selected: 'bg-moss text-paper-50',
  },
  gold: {
    base: 'bg-gold-50 text-gold-600 hover:bg-gold-100',
    selected: 'bg-gold text-paper-50',
  },
  ink: {
    base: 'bg-ink-50 text-ink-600 hover:bg-ink-100',
    selected: 'bg-ink-800 text-paper-50',
  },
}

export default function TagPill({
  label,
  variant = 'default',
  selected = false,
  closable = false,
  onClose,
  onClick,
  className,
}: TagPillProps) {
  const variantStyle = variantClasses[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150',
        selected ? variantStyle.selected : variantStyle.base,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {label}
      {closable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose?.()
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}
