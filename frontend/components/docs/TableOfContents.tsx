'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const article = document.querySelector('article[data-docs-content]')
    if (!article) return

    const els = Array.from(article.querySelectorAll('h2, h3')) as HTMLElement[]
    setHeadings(
      els.map((el) => ({
        id: el.id,
        text: el.textContent ?? '',
        level: parseInt(el.tagName[1]),
      })).filter((h) => h.id)
    )
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-10% 0% -80% 0%', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (headings.length === 0) return null

  return (
    <div className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        On This Page
      </p>
      <ul className="space-y-1.5">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                'block transition-colors leading-snug hover:text-[#6C47FF]',
                level === 3 && 'pl-3',
                activeId === id
                  ? 'text-[#6C47FF] font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#2d1f5e] space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          Questions?
        </p>
        <a href="/docs" className="block text-gray-500 dark:text-gray-400 hover:text-[#6C47FF] transition-colors">
          Browse all docs
        </a>
        <a href="/sign-up" className="block text-gray-500 dark:text-gray-400 hover:text-[#6C47FF] transition-colors">
          Get started free
        </a>
      </div>

      <button
        onClick={scrollToTop}
        className="mt-6 flex items-center gap-1.5 text-gray-400 hover:text-[#6C47FF] transition-colors"
      >
        <span>↑</span>
        <span>Scroll to top</span>
      </button>
    </div>
  )
}
