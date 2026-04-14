'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  BarChart2,
  Settings,
  CreditCard,
  MessageSquare,
  LineChart,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'

const navItems = [
  { label: 'Dashboard',      href: '/dashboard',           icon: LayoutDashboard },
  { label: 'My Bots',        href: '/dashboard/bots',      icon: Bot },
  { label: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
  { label: 'Analytics',      href: '/dashboard/analytics', icon: BarChart2 },
  { label: 'Settings',       href: '/dashboard/settings',  icon: Settings },
  { label: 'Billing',        href: '/dashboard/billing',   icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close, isCollapsed } = useSidebar()

  // Close mobile drawer on navigation
  useEffect(() => { close() }, [pathname, close])

  const botMatch = pathname.match(/^\/dashboard\/bots\/([^/]+)/)
  const currentBotId = botMatch?.[1]
  const showBotSubnav =
    currentBotId && currentBotId !== 'new' && pathname !== '/dashboard/bots'

  const botSubnav = showBotSubnav
    ? [
        { label: 'Analytics',     href: `/dashboard/bots/${currentBotId}/analytics`,     icon: LineChart },
        { label: 'Conversations', href: `/dashboard/bots/${currentBotId}/conversations`, icon: MessageSquare },
      ]
    : []

  const sidebarContent = (
    <aside
      className={cn(
        'flex h-full flex-shrink-0 flex-col border-r border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-[#ede9f8] dark:border-[#382b61] transition-all duration-200',
        isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
      )}>
        <Link
          href="/"
          aria-label="BotForge home"
          className="text-lg font-bold text-[#6C47FF] tracking-tight transition-all duration-200"
        >
          {isCollapsed ? 'BF' : 'BotForge'}
        </Link>
        {/* Mobile close button */}
        <button
          onClick={close}
          aria-label="Close menu"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6B6490] hover:bg-[#f0ebff] hover:text-[#6C47FF] transition-colors lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2" aria-label="Main navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href)

          return (
            <div key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? label : undefined}
                className={cn(
                  'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isCollapsed ? 'justify-center' : 'gap-3',
                  isActive
                    ? 'bg-[#f0ebff] text-[#6C47FF]'
                    : 'text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#faf8ff] dark:hover:bg-[#2d1f5e] hover:text-[#1A1035] dark:hover:text-[#f8f8ff]'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
                {!isCollapsed && <span>{label}</span>}
              </Link>

              {/* Bot sub-nav — only when expanded */}
              {!isCollapsed && href === '/dashboard/bots' && botSubnav.length > 0 && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-[#ede9f8] dark:border-[#382b61] pl-3">
                  {botSubnav.map(({ label: subLabel, href: subHref, icon: SubIcon }) => {
                    const isSubActive = pathname.startsWith(subHref)
                    return (
                      <Link
                        key={subHref}
                        href={subHref}
                        aria-current={isSubActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
                          isSubActive
                            ? 'bg-[#f0ebff] text-[#6C47FF]'
                            : 'text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#faf8ff] dark:hover:bg-[#2d1f5e]'
                        )}
                      >
                        <SubIcon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
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

      {/* Keyboard hints — only when expanded */}
      {!isCollapsed && (
        <div className="hidden border-t border-[#ede9f8] dark:border-[#382b61] px-4 py-3 lg:block space-y-1">
          <p className="text-[11px] text-[#6B6490] dark:text-[#a19bb8]">
            Press{' '}
            <kbd className="rounded border border-[#ede9f8] dark:border-[#382b61] bg-[#faf8ff] dark:bg-[#130b29] px-1 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>{' '}
            to open commands
          </p>
          <p className="text-[11px] text-[#6B6490] dark:text-[#a19bb8]">
            Press{' '}
            <kbd className="rounded border border-[#ede9f8] dark:border-[#382b61] bg-[#faf8ff] dark:bg-[#130b29] px-1 py-0.5 font-mono text-[10px]">
              ⌘B
            </kbd>{' '}
            to collapse sidebar
          </p>
        </div>
      )}
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebarContent}</div>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={close}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 flex lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  )
}
