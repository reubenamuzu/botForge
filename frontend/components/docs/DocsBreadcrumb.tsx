'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ALL_DOC_PAGES } from '@/lib/docs'

export function DocsBreadcrumb() {
  const pathname = usePathname()
  if (pathname === '/docs') return null

  const page = ALL_DOC_PAGES.find((p) => p.href === pathname)
  const label = page?.label ?? ''

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
      <Link href="/docs" className="hover:text-[#6C47FF] transition-colors">
        Docs
      </Link>
      {label && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-600 dark:text-gray-300">{label}</span>
        </>
      )}
    </nav>
  )
}
