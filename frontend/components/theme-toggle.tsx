'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle({ variant = 'dashboard' }: { variant?: 'dashboard' | 'marketing' }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8" />

  const isDark = theme === 'dark'

  if (variant === 'marketing') {
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 dark:bg-white/10 border border-white/60 dark:border-white/20 backdrop-blur-md text-[#1A1035] dark:text-[#e8e0ff] hover:bg-white/60 dark:hover:bg-white/20 transition-colors"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ede9f8] dark:border-[#382b61] text-[#6B6490] dark:text-[#a19bb8] hover:bg-[#f0ebff] dark:hover:bg-[#2d1f5e] transition-colors"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
