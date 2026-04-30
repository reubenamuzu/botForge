'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  BookOpen,
  Circle,
  Compass,
  CreditCard,
  FileText,
  LayoutDashboard,
  Flag,
  Home,
  type LucideIcon,
  MessageSquare,
  Plug,
  X,
} from 'lucide-react'
import { DOC_SECTIONS } from '@/lib/docs'
import { cn } from '@/lib/utils'
import DocsSearch from '@/components/docs/DocsSearch'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { ReportIssueDialog } from '@/components/ReportIssueDialog'

interface DocsSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocsSidebar({ isOpen, onClose }: DocsSidebarProps) {
  const pathname = usePathname()
  const [reportOpen, setReportOpen] = useState(false)
  const items = DOC_SECTIONS.flatMap((section) => section.items)
  const iconByHref: Record<string, LucideIcon> = {
    '/docs/getting-started': Compass,
    '/docs/knowledge-base': BookOpen,
    '/docs/embedding': Plug,
    '/docs/conversations': MessageSquare,
    '/docs/billing': CreditCard,
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-30 flex h-full w-72 flex-col overflow-y-auto border-r border-[#ECECF1] bg-[#FAFAFB] pt-4 pb-8 transition-transform duration-200 dark:border-white/[0.08] dark:bg-[#0E0820]',
          'md:relative md:h-full md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-4">
          <Link href="/docs" className="mb-4 flex items-center gap-3">
            <Logo size={18} />
            <span>
              <span className="block text-sm font-semibold text-[#1B1B1F] dark:text-[#F4F1FF]">BotForge</span>
              <span className="block text-xs text-[#7B7B84] dark:text-[#8B82B0]">v1.0</span>
            </span>
          </Link>
          <DocsSearch />
        </div>

        <div className="mt-4 border-t border-dashed border-[#E3E3E8] px-4 pt-3 dark:border-white/[0.08]">
          <Link href="/" className="mb-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[#3E3E45] hover:bg-white dark:text-[#B7B1CC] dark:hover:bg-white/5">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/dashboard" className="mb-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[#3E3E45] hover:bg-white dark:text-[#B7B1CC] dark:hover:bg-white/5">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
        </div>

        <nav className="mt-3 space-y-1 px-4 py-2">
          <Link
            href="/docs"
            onClick={onClose}
            aria-current={pathname === '/docs' ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors',
              pathname === '/docs'
                ? 'bg-white text-[#111114] font-semibold dark:bg-white/5 dark:text-[#F4F1FF]'
                : 'text-[#4E4E56] hover:bg-white hover:text-[#1A1035] dark:text-[#8B82B0] dark:hover:bg-white/5 dark:hover:text-[#F4F1FF]'
            )}
          >
            <FileText className="h-4 w-4" />
            Documentation
          </Link>
          {items.map((item) => {
            const active = pathname === item.href
            const Icon = iconByHref[item.href] ?? Circle
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors',
                  active
                    ? 'bg-white text-[#111114] font-semibold dark:bg-white/5 dark:text-[#F4F1FF]'
                    : 'text-[#4E4E56] hover:bg-white hover:text-[#1A1035] dark:text-[#8B82B0] dark:hover:bg-white/5 dark:hover:text-[#F4F1FF]'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-dashed border-[#E3E3E8] px-4 pt-3 dark:border-white/[0.08]">
          <div className="mb-1 flex items-center justify-between rounded-md px-2 py-2 text-sm text-[#3E3E45] dark:text-[#B7B1CC]">
            <span>Theme</span>
            <ThemeToggle variant="dashboard" />
          </div>
          <button
            onClick={() => setReportOpen(true)}
            className="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-[#3E3E45] hover:bg-white dark:text-[#B7B1CC] dark:hover:bg-white/5"
          >
            <Flag className="h-4 w-4" />
            Report an Issue
          </button>
        </div>
      </aside>
      <ReportIssueDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  )
}
