'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  BarChart2,
  Settings,
  CreditCard,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const COMMANDS = [
  { label: 'Dashboard',     href: '/dashboard',           icon: LayoutDashboard, group: 'Navigate' },
  { label: 'My Bots',       href: '/dashboard/bots',      icon: Bot,             group: 'Navigate' },
  { label: 'Analytics',     href: '/dashboard/analytics', icon: BarChart2,       group: 'Navigate' },
  { label: 'Knowledge Base',href: '/dashboard/knowledge', icon: BookOpen,        group: 'Navigate' },
  { label: 'Billing',       href: '/dashboard/billing',   icon: CreditCard,      group: 'Navigate' },
  { label: 'Settings',      href: '/dashboard/settings',  icon: Settings,        group: 'Navigate' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        setQuery('')
        setActiveIndex(0)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const filtered = COMMANDS.filter(
    (c) => !query || c.label.toLowerCase().includes(query.toLowerCase())
  )

  function navigate(href: string) {
    router.push(href)
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      navigate(filtered[activeIndex].href)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg overflow-hidden p-0 shadow-2xl">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#382b61] px-4">
          <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages and actions…"
            aria-label="Command palette search"
            className="flex-1 bg-transparent py-4 text-sm text-gray-800 dark:text-gray-200 outline-none focus-visible:outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2" role="listbox" aria-label="Commands">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Navigate
              </p>
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.href}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => navigate(cmd.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-colors',
                    i === activeIndex
                      ? 'bg-[#f0ebff] dark:bg-[#2d1f5e] text-[#6C47FF]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A1035]'
                  )}
                >
                  <cmd.icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{cmd.label}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-100 dark:border-[#382b61] px-4 py-2.5">
          <p className="text-[11px] text-gray-400 flex items-center gap-3">
            <span><kbd className="rounded border border-gray-200 dark:border-[#382b61] bg-gray-50 dark:bg-[#1A1035] px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate</span>
            <span><kbd className="rounded border border-gray-200 dark:border-[#382b61] bg-gray-50 dark:bg-[#1A1035] px-1 py-0.5 font-mono text-[10px]">↵</kbd> open</span>
            <span><kbd className="rounded border border-gray-200 dark:border-[#382b61] bg-gray-50 dark:bg-[#1A1035] px-1 py-0.5 font-mono text-[10px]">⌘K</kbd> toggle</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
