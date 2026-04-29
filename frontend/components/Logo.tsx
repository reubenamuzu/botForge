import { cn } from '@/lib/utils'

export function Logo({
  size = 28,
  className,
  color,
}: {
  size?: number
  className?: string
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('text-[#6C47FF] dark:text-[#8B6FFF]', className)}
      aria-hidden
    >
      <path
        d="M16 2 L19 13 L30 16 L19 19 L16 30 L13 19 L2 16 L13 13 Z"
        fill={color ?? 'currentColor'}
      />
      <path
        d="M16 9 L17.2 14.8 L23 16 L17.2 17.2 L16 23 L14.8 17.2 L9 16 L14.8 14.8 Z"
        fill="black"
        opacity="0.18"
      />
    </svg>
  )
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Logo size={size} />
      <span className="text-[17px] font-bold tracking-[-0.02em] text-[#1A1035] dark:text-white">
        BotForge
      </span>
    </span>
  )
}
