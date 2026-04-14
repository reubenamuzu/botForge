'use client'

import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { useSidebar } from './SidebarContext'

export function CollapseButton() {
  const { isCollapsed, toggleCollapsed } = useSidebar()
  return (
    <button
      onClick={toggleCollapsed}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-[#ede9f8] dark:border-[#382b61] text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#f0ebff] dark:hover:bg-[#2d1f5e] transition-colors"
    >
      {isCollapsed
        ? <PanelLeft className="h-4 w-4" />
        : <PanelLeftClose className="h-4 w-4" />}
    </button>
  )
}
