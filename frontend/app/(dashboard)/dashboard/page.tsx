'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bot, Plus, ArrowRight, BarChart2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot as BotType, CurrentUser, UsageStats } from '@/lib/types'
import { Progress } from '@/components/ui/progress'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const PLAN_LABEL: Record<string, string> = {
  FREE: 'Free',
  STARTER: 'Starter',
  PRO: 'Pro',
  AGENCY: 'Agency',
}

const gridStyle = {
  backgroundImage:
    'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

export default function DashboardPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [bots, setBots] = useState<BotType[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [usageRes, botsRes, userRes] = await Promise.all([
        api.get<UsageStats>('/billing/usage', { headers }),
        api.get<BotType[]>('/bots', { headers }),
        api.get<CurrentUser>('/users/me', { headers }),
      ])
      if (!userRes.data.onboardingDone) {
        router.replace('/dashboard/onboarding')
        return
      }
      setUsage(usageRes.data)
      setBots(botsRes.data)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [getToken, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const msgLimit = usage?.limits.maxMessagesPerMonth ?? 50
  const msgPct = usage ? Math.min(100, Math.round((usage.messageCount / msgLimit) * 100)) : 0
  const botLimit = usage?.limits.maxBots === Infinity ? null : (usage?.limits.maxBots ?? 1)
  const botPct = botLimit ? Math.min(100, Math.round(((usage?.botCount ?? 0) / botLimit) * 100)) : 0
  const recentBots = bots.slice(0, 3)
  const firstName = user?.firstName ?? 'there'

  return (
    <div className="space-y-8">
      {/* Page header strip */}
      <div className="relative -mx-4 -mt-4 mb-8 overflow-hidden border-b border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF] dark:bg-[#0E0820] px-8 py-8 sm:-mx-8 sm:-mt-8">
        <div className="pointer-events-none absolute inset-0" style={gridStyle} />
        <div className="relative">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
            {getGreeting()}
          </div>
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF]">
            {firstName}
            <em style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontWeight: 400 }}>, welcome back.</em>
          </h1>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Bots created */}
        <div className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0]">
            Bots created
          </div>
          <div className="font-mono text-[36px] font-bold leading-none tracking-[-0.03em] text-[#1A1035] dark:text-[#F4F1FF]">
            {loading ? '—' : (usage?.botCount ?? 0)}
          </div>
          {botLimit && (
            <>
              <div className="mt-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
                {usage?.botCount ?? 0} / {botLimit} used
              </div>
              <Progress value={botPct} className="mt-3 h-1 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]" />
            </>
          )}
        </div>

        {/* Messages */}
        <div className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0]">
            Messages this month
          </div>
          <div className="font-mono text-[36px] font-bold leading-none tracking-[-0.03em] text-[#1A1035] dark:text-[#F4F1FF]">
            {loading ? '—' : (usage?.messageCount.toLocaleString() ?? 0)}
          </div>
          <div className="mt-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
            {usage ? `${usage.messageCount.toLocaleString()} / ${msgLimit === Infinity ? '∞' : msgLimit.toLocaleString()} used` : ''}
          </div>
          <Progress value={msgPct} className="mt-3 h-1 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]" />
          {msgPct >= 90 && (
            <p className="mt-1.5 font-mono text-[11px] text-amber-600">Almost at your limit</p>
          )}
        </div>

        {/* Current plan */}
        <div className="rounded-2xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] p-6 text-white">
          <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">
            Current plan
          </div>
          <div className="font-mono text-[36px] font-bold leading-none tracking-[-0.03em] text-white">
            {loading ? '—' : (PLAN_LABEL[usage?.plan ?? 'FREE'] ?? 'Free')}
          </div>
          <div className="mt-1 font-mono text-[11px] text-white/70">
            {usage?.plan === 'FREE' ? 'Upgrade to unlock more' : 'Active subscription'}
          </div>
          <Link
            href="/dashboard/billing"
            className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-white/80 transition-colors hover:text-white"
          >
            Manage billing <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
          Quick Actions
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/dashboard/bots', icon: Plus, label: 'Create a Bot' },
            { href: '/dashboard/analytics', icon: BarChart2, label: 'View Analytics' },
            { href: '/dashboard/billing', icon: CreditCard, label: 'Manage Billing' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#1A1035] dark:text-[#F4F1FF] transition-colors hover:border-[#6C47FF] hover:text-[#6C47FF]"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent bots */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
            Your Bots
          </div>
          <Link
            href="/dashboard/bots"
            className="font-mono text-[11px] text-[#6C47FF] hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#F0EDFA] dark:bg-white/5" />
            ))}
          </div>
        ) : recentBots.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E3F5] dark:border-white/[0.08] py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EDFA]">
              <Bot className="h-7 w-7 text-[#6C47FF]" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#1A1035] dark:text-[#F4F1FF]">No bots yet</h3>
            <p className="mt-1 text-sm text-[#6B6490] dark:text-[#8B82B0]">Create your first bot to get started.</p>
            <Link
              href="/dashboard/bots"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#6C47FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5835ee]"
            >
              <Plus className="h-3.5 w-3.5" /> Create Bot
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recentBots.map((bot) => (
              <Link
                key={bot.id}
                href={`/dashboard/bots/${bot.id}`}
                className="group flex flex-col rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6 transition-all duration-200 hover:border-[#6C47FF]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white">
                    {bot.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#1A1035] dark:text-[#F4F1FF]">{bot.name}</p>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
                      <span className={`h-1.5 w-1.5 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                      {bot.isActive ? 'active' : 'inactive'}
                    </span>
                  </div>
                </div>
                <p className="line-clamp-2 flex-1 text-xs text-[#6B6490] dark:text-[#8B82B0]">{bot.greeting}</p>
                <div className="mt-3 flex items-center gap-1 font-mono text-[11px] font-semibold text-[#6C47FF] opacity-0 transition-opacity group-hover:opacity-100">
                  Open bot <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade nudge — free plan only */}
      {!loading && usage?.plan === 'FREE' && (
        <div className="rounded-2xl bg-gradient-to-r from-[#6C47FF] to-[#9b72ff] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold">Unlock more with Starter</p>
              <p className="mt-1 text-sm text-white/80">
                Get 2 bots, 1,000 messages/month, and remove BotForge branding.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#6C47FF] transition-colors hover:bg-[#F0EDFA]"
            >
              Upgrade now
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
