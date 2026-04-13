'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Bot, MessageSquare, Zap, Plus, ArrowRight, BarChart2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot as BotType, UsageStats } from '@/lib/types'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

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

export default function DashboardPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [bots, setBots] = useState<BotType[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [usageRes, botsRes] = await Promise.all([
        api.get<UsageStats>('/billing/usage', { headers }),
        api.get<BotType[]>('/bots', { headers }),
      ])
      setUsage(usageRes.data)
      setBots(botsRes.data)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [getToken])

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1035] dark:text-[#f8f8ff]">
          {getGreeting()}, {firstName}
        </h1>
        <p className="mt-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">
          Here&apos;s an overview of your bots and activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Bots used */}
        <div className="rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <Bot className="h-5 w-5 text-[#6C47FF]" />
            </div>
            {usage && (
              <span className="text-xs font-semibold text-[#6B6490] dark:text-[#a19bb8]">
                {usage.botCount} / {botLimit ?? '∞'}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-[#1A1035] dark:text-[#f8f8ff]">
            {loading ? '—' : (usage?.botCount ?? 0)}
          </p>
          <p className="mt-0.5 text-sm font-medium text-[#6B6490] dark:text-[#a19bb8]">Bots created</p>
          {botLimit && (
            <Progress
              value={botPct}
              className="mt-3 h-1.5 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]"
            />
          )}
        </div>

        {/* Messages */}
        <div className="rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <MessageSquare className="h-5 w-5 text-[#6C47FF]" />
            </div>
            {usage && (
              <span className="text-xs font-semibold text-[#6B6490] dark:text-[#a19bb8]">
                {usage.messageCount.toLocaleString()} /{' '}
                {msgLimit === Infinity ? '∞' : msgLimit.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-[#1A1035] dark:text-[#f8f8ff]">
            {loading ? '—' : (usage?.messageCount.toLocaleString() ?? 0)}
          </p>
          <p className="mt-0.5 text-sm font-medium text-[#6B6490] dark:text-[#a19bb8]">Messages this month</p>
          <Progress
            value={msgPct}
            className="mt-3 h-1.5 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]"
          />
          {msgPct >= 90 && (
            <p className="mt-1.5 text-xs font-medium text-amber-600">Almost at your limit</p>
          )}
        </div>

        {/* Current plan */}
        <div className="rounded-2xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] p-5 shadow-sm text-white">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 dark:bg-[#1A1035]/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <Badge className="border-0 bg-white/20 dark:bg-[#1A1035]/20 text-white hover:bg-white/30 dark:bg-[#1A1035]/30 text-xs">
              {PLAN_LABEL[usage?.plan ?? 'FREE'] ?? 'Free'}
            </Badge>
          </div>
          <p className="text-2xl font-bold">Current Plan</p>
          <p className="mt-0.5 text-sm text-white/80">
            {usage?.plan === 'FREE' ? 'Upgrade to unlock more' : 'Active subscription'}
          </p>
          <Link
            href="/dashboard/billing"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/80 transition-colors hover:text-white"
          >
            Manage billing <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B6490] dark:text-[#a19bb8]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/dashboard/bots', icon: Plus, label: 'Create a Bot' },
            { href: '/dashboard/analytics', icon: BarChart2, label: 'View Analytics' },
            { href: '/dashboard/billing', icon: CreditCard, label: 'Manage Billing' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] px-4 py-2.5 text-sm font-semibold text-[#1A1035] dark:text-[#f8f8ff] shadow-sm transition-colors hover:border-[#6C47FF] hover:text-[#6C47FF]"
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
          <h2 className="text-base font-bold text-[#1A1035] dark:text-[#f8f8ff]">Your Bots</h2>
          <Link
            href="/dashboard/bots"
            className="flex items-center gap-1 text-sm font-semibold text-[#6C47FF] hover:underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#f4efff]" />
            ))}
          </div>
        ) : recentBots.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ede9f8] dark:border-[#382b61] py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0ebff]">
              <Bot className="h-7 w-7 text-[#6C47FF]" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#1A1035] dark:text-[#f8f8ff]">No bots yet</h3>
            <p className="mt-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">Create your first bot to get started.</p>
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
                className="group flex flex-col rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm transition-all duration-200 hover:border-[#6C47FF] hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white shadow-sm">
                    {bot.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#1A1035] dark:text-[#f8f8ff]">{bot.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`}
                      />
                      <span className="text-xs text-[#6B6490] dark:text-[#a19bb8]">
                        {bot.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="line-clamp-2 flex-1 text-xs text-[#6B6490] dark:text-[#a19bb8]">{bot.greeting}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#6C47FF] opacity-0 transition-opacity group-hover:opacity-100">
                  Open bot <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade nudge — free plan only */}
      {!loading && usage?.plan === 'FREE' && (
        <div className="rounded-2xl bg-gradient-to-r from-[#6C47FF] to-[#9b72ff] p-6 text-white shadow-lg shadow-[#6C47FF]/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold">Unlock more with Starter</p>
              <p className="mt-1 text-sm text-white/80">
                Get 2 bots, 1,000 messages/month, and remove BotForge branding.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="shrink-0 rounded-xl bg-white dark:bg-[#1A1035] px-5 py-2.5 text-sm font-bold text-[#6C47FF] shadow-sm transition-colors hover:bg-[#f0ebff]"
            >
              Upgrade now
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
