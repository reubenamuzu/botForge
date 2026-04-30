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
    <nav className="mb-6 flex items-center gap-2 text-sm text-[#86868F] dark:text-[#8B82B0]" aria-label="Breadcrumb">
      <Link href="/docs" className="transition-colors hover:text-[#4A4A52] dark:hover:text-[#F4F1FF]">
        Documentation
      </Link>
      {label && (
        <>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#34343B] dark:text-[#F4F1FF]">{label}</span>
        </>
      )}
    </nav>
  )
}
