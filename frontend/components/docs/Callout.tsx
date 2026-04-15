import { Info, Lightbulb, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  variant?: 'info' | 'tip' | 'warning' | 'danger'
  title?: string
  children: React.ReactNode
}

const config = {
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    containerClass: 'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500',
    titleClass: 'text-blue-700 dark:text-blue-400',
    bodyClass: 'text-blue-800 dark:text-blue-300',
  },
  tip: {
    icon: Lightbulb,
    iconClass: 'text-[#6C47FF]',
    containerClass: 'bg-[#f0ebff] dark:bg-[#2d1f5e] border-l-4 border-[#6C47FF]',
    titleClass: 'text-[#6C47FF]',
    bodyClass: 'text-[#1A1035] dark:text-gray-200',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-orange-500',
    containerClass: 'bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500',
    titleClass: 'text-orange-700 dark:text-orange-400',
    bodyClass: 'text-orange-800 dark:text-orange-300',
  },
  danger: {
    icon: AlertCircle,
    iconClass: 'text-red-500',
    containerClass: 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500',
    titleClass: 'text-red-700 dark:text-red-400',
    bodyClass: 'text-red-800 dark:text-red-300',
  },
}

export function Callout({ variant = 'tip', title, children }: CalloutProps) {
  const c = config[variant]
  const Icon = c.icon
  return (
    <div className={cn('rounded-r-lg px-4 py-3 my-6', c.containerClass)}>
      <div className="flex items-start gap-2.5">
        <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', c.iconClass)} />
        <div className="text-sm leading-relaxed">
          {title && <p className={cn('font-semibold mb-0.5', c.titleClass)}>{title}</p>}
          <div className={cn(c.bodyClass)}>{children}</div>
        </div>
      </div>
    </div>
  )
}
