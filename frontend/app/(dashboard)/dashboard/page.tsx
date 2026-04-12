import { currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  let firstName: string | null = null
  try {
    const user = await currentUser()
    firstName = user?.firstName ?? null
  } catch {
    // Clerk API unavailable — render without user info
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {firstName ?? 'there'}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Here&apos;s an overview of your bots and activity.
      </p>
    </div>
  )
}
