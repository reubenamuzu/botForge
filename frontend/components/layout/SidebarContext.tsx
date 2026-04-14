'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface SidebarContextType {
  isOpen: boolean       // mobile drawer
  open: () => void
  close: () => void
  isCollapsed: boolean  // desktop collapse
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  isCollapsed: false,
  toggleCollapsed: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggleCollapsed = useCallback(() => setIsCollapsed((v) => !v), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggleCollapsed()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleCollapsed])

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, isCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}
