'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import DocsSidebar from '@/components/docs/DocsSidebar'
import DocsSearch from '@/components/docs/DocsSearch'
import { TableOfContents } from '@/components/docs/TableOfContents'
import { DocsBreadcrumb } from '@/components/docs/DocsBreadcrumb'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0a24] text-[#1A1035] dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-gray-100 dark:border-[#2d1f5e] bg-white/90 dark:bg-[#0f0a24]/90 backdrop-blur-md flex items-center px-4 gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 p-1 rounded-md"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="shrink-0 font-bold text-[#6C47FF] text-lg tracking-tight">
          BotForge
        </Link>

        <div className="flex-1 max-w-xs">
          <DocsSearch />
        </div>

        <Link
          href="/dashboard"
          className="ml-auto shrink-0 rounded-lg bg-[#6C47FF] hover:bg-[#5D3BE8] text-white text-sm font-medium px-4 py-1.5 transition-colors"
        >
          Dashboard
        </Link>
      </header>

      <div className="flex">
        {/* Left sidebar */}
        <DocsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 min-w-0 lg:ml-64">
          <div className="max-w-3xl mx-auto px-6 py-10 xl:pr-72">
            <DocsBreadcrumb />
            {children}
          </div>
        </main>

        {/* Right sidebar — ToC */}
        <aside className="hidden xl:block fixed right-0 top-14 w-64 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8 border-l border-gray-100 dark:border-[#2d1f5e]">
          <TableOfContents />
        </aside>
      </div>
    </div>
  )
}
