'use client'

import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { ChevronRight, ArrowUpRight } from 'lucide-react'

const NAV_LINKS = ['features', 'how-it-works', 'pricing'] as const

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <header className="fixed top-0 w-full z-50 py-4 md:py-6 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-[#6C47FF]">BotForge</span>
        </Link>

        <nav className="hidden items-center gap-8 rounded-full bg-white/50 px-8 py-3 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-white/60 sm:flex">
          {NAV_LINKS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm font-semibold capitalize text-[#1A1035] hover:text-[#9a70ff] transition-colors hover:scale-105 transform"
            >
              {id.replace('-', ' ')}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-semibold text-[#1A1035] hover:text-[#9a70ff] transition-colors">
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hidden text-sm font-semibold text-[#1A1035] hover:text-[#9a70ff] transition-colors sm:block">
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#dabdff] to-[#c1a0ff] px-6 py-2.5 text-sm font-semibold text-[#1a1035] hover:opacity-90 transition-opacity shadow-md border border-[#e5d4ff] hover:scale-105 transform"
              >
                Get started <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
