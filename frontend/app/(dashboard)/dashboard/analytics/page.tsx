'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { MessageSquare, TrendingUp, Bot, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot as BotType, AnalyticsSummary } from '@/lib/types'

interface BotWithAnalytics {
  bot: BotType
  summary: AnalyticsSummary | null
}

const gridStyle = {
  backgroundImage:
    'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

export default function AnalyticsPage() {
  const { getToken } = useAuth()
  const [data, setData] = useState<BotWithAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const { data: bots } = await api.get<BotType[]>('/bots', { headers })

      const summaries = await Promise.all(
        bots.map((bot) =>
          api
            .get<AnalyticsSummary>(`/analytics/${bot.id}/summary`, { headers })
            .then((r) => r.data)
            .catch(() => null)
        )
      )

      setData(bots.map((bot, i) => ({ bot, summary: summaries[i] })))
    } catch {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalMessages = data.reduce((s, d) => s + (d.summary?.totalMessages ?? 0), 0)
  const totalConversations = data.reduce((s, d) => s + (d.summary?.totalConversations ?? 0), 0)
  const activeBots = data.filter((d) => d.bot.isActive).length

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header strip */}
      <div className="relative -mx-3 -mt-3 mb-6 overflow-hidden border-b border-[#E8E3F5] bg-[#F8F8FF] px-4 py-6 dark:border-white/[0.08] dark:bg-[#0E0820] sm:-mx-6 sm:-mt-6 sm:mb-8 sm:px-8 sm:py-8 lg:-mx-8 lg:-mt-8">
        <div className="pointer-events-none absolute inset-0" style={gridStyle} />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
            ANALYTICS
          </div>
          <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[32px]">
            Your{' '}
            <em style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              Analytics.
            </em>
          </h1>
          <p className="mt-2 font-mono text-[12px] text-[#6B6490] dark:text-[#8B82B0]">
            Performance overview across all your bots.
          </p>
        </div>
      </div>

      {/* Aggregate stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: 'Total Messages',
            value: loading ? '—' : totalMessages.toLocaleString(),
            sub: 'All time, all bots',
            icon: MessageSquare,
          },
          {
            label: 'Total Conversations',
            value: loading ? '—' : totalConversations.toLocaleString(),
            sub: 'All time, all bots',
            icon: TrendingUp,
          },
          {
            label: 'Active Bots',
            value: loading ? '—' : activeBots.toString(),
            sub: `${data.length} bots total`,
            icon: Bot,
          },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
            <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0]">
              {label}
            </div>
            <div className="font-mono text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[36px]">
              {value}
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">{sub}</div>
          </div>
        ))}
      </div>

      {/* Per-bot breakdown */}
      <div>
        <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
          Bot Breakdown
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#F0EDFA] dark:bg-white/5" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E3F5] dark:border-white/[0.08] py-20 text-center">
            <BarChart2 className="mb-3 h-10 w-10 text-[#c4b5fd]" />
            <p className="text-sm font-semibold text-[#1A1035] dark:text-[#F4F1FF]">No bots yet</p>
            <p className="mt-1 text-xs text-[#6B6490] dark:text-[#8B82B0]">Create a bot to start seeing analytics.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map(({ bot, summary }) => (
              <div
                key={bot.id}
                className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white">
                    {bot.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-[#1A1035] dark:text-[#F4F1FF]">{bot.name}</p>
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                        {bot.isActive ? 'active' : 'inactive'}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-6">
                      {[
                        { label: 'Messages', value: summary?.totalMessages.toLocaleString() ?? '—' },
                        { label: 'Conversations', value: summary?.totalConversations.toLocaleString() ?? '—' },
                        { label: 'This month', value: summary?.messagesThisMonth.toLocaleString() ?? '—' },
                        { label: 'Unanswered', value: summary?.unansweredCount.toLocaleString() ?? '—' },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0]">{label}</div>
                          <div className="font-mono text-[18px] font-bold leading-none tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF]">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/dashboard/bots/${bot.id}/analytics`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-semibold text-[#6C47FF] transition-colors hover:border-[#6C47FF]"
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                      Details
                    </Link>
                    <Link
                      href={`/dashboard/bots/${bot.id}/conversations`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-semibold text-[#6B6490] dark:text-[#8B82B0] transition-colors hover:border-[#6C47FF] hover:text-[#6C47FF]"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Conversations
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
