'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  Flag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'
import { ReportIssueDialog } from '@/components/ReportIssueDialog'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { Logo } from '@/components/Logo'

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
  const [reportOpen, setReportOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

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

  const gridOverlay = (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />
  )

  const sidebarContent = (
    <aside
      className={cn(
        'flex h-full flex-shrink-0 flex-col border-r border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo header band */}
      <div className={cn(
        'relative flex h-16 items-center overflow-hidden border-b border-[#E8E3F5] dark:border-white/[0.08] transition-all duration-200',
        isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
      )}>
        {gridOverlay}
        <Link
          href="/"
          aria-label="BotForge home"
          className="relative flex items-center gap-2 transition-all duration-200"
        >
          <Logo size={18} />
          {!isCollapsed && (
            <span className="text-[15px] font-bold tracking-tight text-[#1A1035] dark:text-[#F4F1FF]">
              BotForge
            </span>
          )}
        </Link>
        {!isCollapsed && (
          <span className="relative ml-auto font-mono text-[10px] text-[#6B6490] dark:text-[#8B82B0]">
            v1.0
          </span>
        )}
        {/* Mobile close button */}
        <button
          onClick={close}
          aria-label="Close menu"
          className="relative flex h-7 w-7 items-center justify-center rounded-lg text-[#6B6490] hover:bg-[#F0EDFA] hover:text-[#6C47FF] transition-colors lg:hidden"
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
                    ? 'bg-[#F0EDFA] dark:bg-white/[0.06] text-[#6C47FF] dark:text-[#8B6FFF] border-l-2 border-[#6C47FF]'
                    : 'text-[#6B6490] dark:text-[#8B82B0] hover:bg-[#F8F8FF] dark:hover:bg-white/[0.04] hover:text-[#1A1035] dark:hover:text-[#F4F1FF]'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden />
                {!isCollapsed && <span>{label}</span>}
              </Link>

              {/* Bot sub-nav — only when expanded */}
              {!isCollapsed && href === '/dashboard/bots' && botSubnav.length > 0 && (
                <div className="ml-7 mt-0.5 space-y-0.5 border-l border-[#E8E3F5] dark:border-white/[0.08] pl-3">
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
                            ? 'bg-[#F0EDFA] dark:bg-white/[0.06] text-[#6C47FF] dark:text-[#8B6FFF]'
                            : 'text-[#6B6490] dark:text-[#8B82B0] hover:bg-[#F8F8FF] dark:hover:bg-white/[0.04]'
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

      {/* Footer: Docs + Report + Shortcuts */}
      <div className={cn('border-t border-[#E8E3F5] dark:border-white/[0.08] p-2 space-y-0.5', isCollapsed && 'flex flex-col items-center')}>
        <Link
          href="/docs"
          title="Documentation"
          className={cn(
            'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors w-full text-[#6B6490] dark:text-[#8B82B0] hover:bg-[#F8F8FF] dark:hover:bg-white/[0.04] hover:text-[#1A1035] dark:hover:text-[#F4F1FF]',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <BookOpen className="h-4 w-4 flex-shrink-0" aria-hidden />
          {!isCollapsed && <span>Documentation</span>}
        </Link>

        <button
          onClick={() => setReportOpen(true)}
          title="Report an Issue"
          className={cn(
            'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors w-full text-[#6B6490] dark:text-[#8B82B0] hover:bg-[#F8F8FF] dark:hover:bg-white/[0.04] hover:text-[#1A1035] dark:hover:text-[#F4F1FF]',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <Flag className="h-4 w-4 flex-shrink-0" aria-hidden />
          {!isCollapsed && <span>Report an Issue</span>}
        </button>

        <button
          onClick={() => setShortcutsOpen(true)}
          title="Keyboard shortcuts"
          className={cn(
            'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors w-full text-[#6B6490] dark:text-[#8B82B0] hover:bg-[#F8F8FF] dark:hover:bg-white/[0.04] hover:text-[#1A1035] dark:hover:text-[#F4F1FF]',
            isCollapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none">?</span>
          {!isCollapsed && <span>Keyboard shortcuts</span>}
        </button>
      </div>
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
          <div className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-[320px] lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}

      <ReportIssueDialog open={reportOpen} onClose={() => setReportOpen(false)} />
      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  )
}
