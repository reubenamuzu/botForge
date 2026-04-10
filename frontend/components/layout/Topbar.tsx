import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

export async function Topbar() {
  const user = await currentUser()
  const orgName =
    user?.organizationMemberships?.[0]?.organization?.name ?? 'Personal'

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <span className="text-sm font-medium text-gray-500">{orgName}</span>
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  )
}
