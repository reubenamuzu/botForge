'use client'

import { Menu } from 'lucide-react'
import { useSidebar } from './SidebarContext'

export function MobileMenuButton() {
  const { open } = useSidebar()
  return (
    <button
      onClick={open}
      aria-label="Open navigation menu"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ede9f8] dark:border-[#382b61] text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#f0ebff] dark:hover:bg-[#2d1f5e] transition-colors lg:hidden"
    >
      <Menu className="h-4 w-4" />
    </button>
  )
}
