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
      className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] px-4 sm:px-6"
    >
      {/* Left — collapse toggle (desktop) + hamburger (mobile) */}
      <div className="flex items-center gap-2">
        <MobileMenuButton />
        <CollapseButton />
      </div>

      {/* Right — theme + name + avatar */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {displayName && (
          <span className="hidden text-sm font-medium text-[#6B6490] dark:text-[#a19bb8] sm:block">
            {displayName}
          </span>
        )}
        <UserButton />
      </div>
    </header>
  )
}
