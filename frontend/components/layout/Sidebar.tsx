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

  const botMatch = pathname.match(/^\/dashboard\/bots\/([^/]+)/)
  const currentBotId = botMatch?.[1]

  const showBotSubnav =
    currentBotId &&
    currentBotId !== 'new' &&
    pathname !== '/dashboard/bots'

  const botSubnav = showBotSubnav
    ? [
        { label: 'Analytics', href: `/dashboard/bots/${currentBotId}/analytics`, icon: LineChart },
        { label: 'Conversations', href: `/dashboard/bots/${currentBotId}/conversations`, icon: MessageSquare },
      ]
    : []

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#ede9f8] dark:border-[#382b61] px-5">
        <Link href="/">
          <span className="text-lg font-bold text-[#6C47FF] tracking-tight">BotForge</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)

          return (
            <div key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#f0ebff] text-[#6C47FF]'
                    : 'text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#faf8ff] dark:bg-[#130b29] hover:text-[#1A1035] dark:text-[#f8f8ff]'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>

              {href === '/dashboard/bots' && botSubnav.length > 0 && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-[#ede9f8] dark:border-[#382b61] pl-3">
                  {botSubnav.map(({ label: subLabel, href: subHref, icon: SubIcon }) => {
                    const isSubActive = pathname.startsWith(subHref)
                    return (
                      <Link
                        key={subHref}
                        href={subHref}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                          isSubActive
                            ? 'bg-[#f0ebff] text-[#6C47FF]'
                            : 'text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#faf8ff] dark:bg-[#130b29] hover:text-[#1A1035] dark:text-[#f8f8ff]'
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
