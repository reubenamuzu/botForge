'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { Wordmark } from '@/components/Logo'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing' },
  { label: 'Docs',     href: '/docs' },
] as const

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF]/90 dark:bg-[#0E0820]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="BotForge home">
            <Wordmark size={22} />
          </Link>
          <span className="rounded border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#6B6490] dark:text-white/40">
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

        <div className="flex items-center gap-3">
          <ThemeToggle variant="marketing" />
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-[#1A1035] dark:text-white/90 hover:text-[#6C47FF] dark:hover:text-[#8B6FFF] transition-colors"
              >
                Dashboard
              </Link>
              <UserButton />
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A1035] dark:bg-[#F4F1FF] px-4 py-2 text-sm font-semibold text-white dark:text-[#0E0820] transition-opacity hover:opacity-80"
              >
                Get started →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
