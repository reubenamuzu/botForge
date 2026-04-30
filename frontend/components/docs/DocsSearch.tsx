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
        className="flex w-full items-center gap-2 rounded-xl border border-[#E8E3F5] bg-white px-3 py-2 text-sm text-[#6B6490] transition-colors hover:border-[#6C47FF] dark:border-white/[0.08] dark:bg-white/5 dark:text-[#8B82B0]"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-[#E8E3F5] px-1.5 py-0.5 font-mono text-[11px] text-[#6B6490] dark:border-white/[0.08] dark:text-[#8B82B0] sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQuery('') }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Search documentation</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b border-[#E8E3F5] px-4 py-3 dark:border-white/[0.08]">
            <Search className="h-4 w-4 shrink-0 text-[#6B6490] dark:text-[#8B82B0]" />
            <input
              autoFocus
              type="text"
              placeholder="Search docs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1A1035] placeholder-[#8F87B1] outline-none dark:text-[#F4F1FF] dark:placeholder-[#8B82B0]"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-[#6B6490] dark:text-[#8B82B0]">
                No results for &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((page) => (
                <li key={page.href}>
                  <button
                    onClick={() => navigate(page.href)}
                    className={cn(
                      'flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-[#F0EDFA] dark:hover:bg-white/5'
                    )}
                  >
                    <span className="text-sm font-medium text-[#1A1035] dark:text-[#F4F1FF]">
                      {page.label}
                    </span>
                    <span className="line-clamp-1 text-xs text-[#6B6490] dark:text-[#8B82B0]">
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
