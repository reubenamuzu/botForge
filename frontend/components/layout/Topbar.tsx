import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

export async function Topbar() {
  let displayName = ''
  try {
    const user = await currentUser()
    displayName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? ''
  } catch {
    // Clerk API unavailable — render without user info
  }

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#ede9f8] bg-white px-6">
      <span className="text-sm font-medium text-[#6B6490]">{displayName}</span>
      <UserButton />
    </header>
  )
}
