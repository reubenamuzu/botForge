'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { DOC_SECTIONS } from '@/lib/docs'
import { cn } from '@/lib/utils'

interface DocsSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocsSidebar({ isOpen, onClose }: DocsSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function toggleSection(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
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
          'fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-[#0f0a24] border-r border-gray-100 dark:border-[#2d1f5e] flex flex-col pt-14 pb-8 overflow-y-auto transition-transform duration-200',
          'lg:sticky lg:top-14 lg:z-auto lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:transition-none',
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

        <nav className="px-3 py-4 space-y-1">
          {DOC_SECTIONS.map((section) => {
            const isCollapsed = collapsed[section.title] ?? false
            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-[#1a1035]"
                >
                  {section.title}
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isCollapsed && '-rotate-90')} />
                </button>

                {!isCollapsed && (
                  <ul className="mt-0.5 mb-2 space-y-0.5">
                    {section.items.map((item) => {
                      const active = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                              active
                                ? 'bg-[#f0ebff] dark:bg-[#2d1f5e] text-[#6C47FF] font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1035] hover:text-gray-900 dark:hover:text-gray-200'
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
