import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileMenuButton } from './MobileMenuButton'
import { CollapseButton } from './CollapseButton'

export async function Topbar() {
  let displayName = ''
  try {
    const user = await currentUser()
    displayName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? ''
  } catch {
    // Clerk API unavailable — render without user info
  }

  return (
    <header
      role="banner"
      className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] px-4 sm:px-6"
    >
      {/* Left — collapse toggle (desktop) + hamburger (mobile) */}
      <div className="flex items-center gap-2">
        <MobileMenuButton />
        <CollapseButton />
      </div>

      {/* Right — status pill + theme + name + avatar */}
      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0] sm:flex items-center gap-1">
          status:{' '}
          <span className="text-[#22A06B] dark:text-[#7CFFB2]">● operational</span>
        </span>
        <ThemeToggle />
        {displayName && (
          <span className="hidden text-sm font-medium text-[#6B6490] dark:text-[#8B82B0] sm:block">
            {displayName}
          </span>
        )}
        <UserButton />
      </div>
    </header>
  )
}
