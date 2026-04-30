'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Wordmark } from '@/components/Logo'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing' },
  { label: 'Docs',     href: '/docs' },
] as const

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastYRef = useRef(0)

  useEffect(() => {
    lastYRef.current = window.pageYOffset || document.documentElement.scrollTop || 0
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0

      // Always visible near top.
      if (y <= 16) {
        setHidden(false)
      } else if (y > lastYRef.current) {
        // Scrolling down (immediate)
        setHidden(true)
      } else if (y < lastYRef.current) {
        // Scrolling up (immediate)
        setHidden(false)
      }

      lastYRef.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setHidden(false)
      return
    }
  }, [open])

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 w-full border-b border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF]/90 dark:bg-[#0E0820]/90 backdrop-blur-md transition-transform duration-300 ${hidden ? '-translate-y-[110%]' : 'translate-y-0'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="BotForge home">
            <Wordmark size={22} />
          </Link>
          <span className="hidden rounded border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#6B6490] dark:text-white/40 sm:inline">
            v1.0
          </span>
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[14px] font-medium text-[#3D3163] dark:text-white/60 transition-colors hover:text-[#6C47FF] dark:hover:text-[#8B6FFF]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle variant="marketing" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E3F5] text-[#1A1035] transition-colors hover:bg-white sm:hidden dark:border-white/10 dark:text-[#F4F1FF] dark:hover:bg-white/10"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-sm font-semibold text-[#1A1035] dark:text-white/90 hover:text-[#6C47FF] dark:hover:text-[#8B6FFF] transition-colors sm:inline"
              >
                Dashboard
              </Link>
              <div className="hidden sm:block">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden text-sm font-medium text-[#1A1035] dark:text-white/70 hover:text-[#6C47FF] dark:hover:text-[#8B6FFF] transition-colors sm:block"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#1A1035] dark:bg-[#F4F1FF] px-4 py-2 text-sm font-semibold text-white dark:text-[#0E0820] transition-opacity hover:opacity-80"
              >
                Get started →
              </Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-[#E8E3F5] bg-[#F8F8FF] px-4 py-3 sm:hidden dark:border-white/[0.08] dark:bg-[#0E0820]">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-[#3D3163] transition-colors hover:bg-white hover:text-[#6C47FF] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-[#8B6FFF]"
              >
                {label}
              </Link>
            ))}
            {!isLoaded ? null : isSignedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-[#1A1035] px-3 py-2 text-sm font-semibold text-white dark:bg-[#F4F1FF] dark:text-[#0E0820]"
              >
                Dashboard
              </Link>
            ) : (
              <div className="mt-1 flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-[#E8E3F5] px-3 py-2 text-center text-sm font-medium text-[#1A1035] dark:border-white/10 dark:text-[#F4F1FF]"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg bg-[#1A1035] px-3 py-2 text-center text-sm font-semibold text-white dark:bg-[#F4F1FF] dark:text-[#0E0820]"
                >
                  Get started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
    <div className="h-[57px] sm:h-[65px]" aria-hidden />
    </>
  )
}
