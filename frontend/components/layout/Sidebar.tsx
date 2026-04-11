'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  BarChart2,
  Settings,
  CreditCard,
  MessageSquare,
  LineChart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Bots', href: '/dashboard/bots', icon: Bot },
  { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  // Extract botId when navigating within a specific bot's pages
  const botMatch = pathname.match(/^\/dashboard\/bots\/([^/]+)/)
  const currentBotId = botMatch?.[1]

  // Don't show bot sub-nav on the bots list page itself
  const showBotSubnav =
    currentBotId &&
    currentBotId !== 'new' &&
    pathname !== '/dashboard/bots'

  const botSubnav = showBotSubnav
    ? [
        {
          label: 'Analytics',
          href: `/dashboard/bots/${currentBotId}/analytics`,
          icon: LineChart,
        },
        {
          label: 'Conversations',
          href: `/dashboard/bots/${currentBotId}/conversations`,
          icon: MessageSquare,
        },
      ]
    : []

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-xl font-bold text-indigo-600">BotForge</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)

          return (
            <div key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>

              {/* Bot sub-nav — shown under "My Bots" when on a bot's page */}
              {href === '/dashboard/bots' && botSubnav.length > 0 && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
                  {botSubnav.map(({ label: subLabel, href: subHref, icon: SubIcon }) => {
                    const isSubActive = pathname.startsWith(subHref)
                    return (
                      <Link
                        key={subHref}
                        href={subHref}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                          isSubActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                        )}
                      >
                        <SubIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        {subLabel}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
