import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { ThemeToggle } from '@/components/theme-toggle'

export async function Topbar() {
  let displayName = ''
  try {
    const user = await currentUser()
    displayName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? ''
  } catch {
    // Clerk API unavailable — render without user info
  }

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] px-6">
      <span className="text-sm font-medium text-[#6B6490] dark:text-[#a19bb8]">{displayName}</span>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  )
}
