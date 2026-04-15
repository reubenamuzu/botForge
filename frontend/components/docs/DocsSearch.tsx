'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ALL_DOC_PAGES, type DocPage } from '@/lib/docs'
import { cn } from '@/lib/utils'

export default function DocsSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const filtered: DocPage[] = query.trim()
    ? ALL_DOC_PAGES.filter((page) => {
        const q = query.toLowerCase()
        return (
          page.label.toLowerCase().includes(q) ||
          page.description.toLowerCase().includes(q) ||
          page.keywords.some((k) => k.toLowerCase().includes(q))
        )
      })
    : ALL_DOC_PAGES

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function navigate(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 rounded-lg border border-gray-200 dark:border-[#2d1f5e] bg-white dark:bg-[#1A1035]/60 px-3 py-2 text-sm text-gray-400 hover:border-[#6C47FF] transition-colors"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-[#2d1f5e] px-1.5 py-0.5 text-xs font-mono text-gray-400">
          <span>⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery('') }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Search documentation</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#2d1f5e] px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search docs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">
                No results for &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((page) => (
                <li key={page.href}>
                  <button
                    onClick={() => navigate(page.href)}
                    className={cn(
                      'w-full flex flex-col gap-0.5 px-4 py-2.5 text-left hover:bg-[#f0ebff] dark:hover:bg-[#2d1f5e] transition-colors'
                    )}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {page.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {page.description}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  )
}
