'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import DocsSidebar from '@/components/docs/DocsSidebar'
import { DocsBreadcrumb } from '@/components/docs/DocsBreadcrumb'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3F3F5] text-[#1B1B1F] dark:bg-[#0E0820] dark:text-[#F4F1FF]">
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-[#E4E4E8] bg-[#F3F3F5]/95 px-4 backdrop-blur md:hidden dark:border-white/[0.08] dark:bg-[#0E0820]/90">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md border border-[#D7D7DC] p-2 text-[#5E5E66] dark:border-white/[0.08] dark:text-[#8B82B0]"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      <div className="p-0 md:p-3">
        <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden border border-[#E1E1E6] bg-white dark:border-white/[0.08] dark:bg-[#120C26] md:h-[calc(100dvh-1.5rem)] md:rounded-2xl">
          <DocsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="min-w-0 flex-1">
            <div className="h-full overflow-y-auto border-l border-[#ECECF1] px-4 py-4 sm:px-6 sm:py-6 md:px-8 dark:border-white/[0.08]">
              <DocsBreadcrumb />
              <div className="w-full max-w-none">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
