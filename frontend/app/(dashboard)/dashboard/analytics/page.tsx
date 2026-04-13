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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1035] dark:text-[#f8f8ff]">Analytics</h1>
        <p className="mt-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">
          Performance overview across all your bots.
        </p>
      </div>

      {/* Aggregate stats */}
      <div className="grid gap-4 sm:grid-cols-3">
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
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0ebff]">
              <Icon className="h-5 w-5 text-[#6C47FF]" />
            </div>
            <p className="text-2xl font-bold text-[#1A1035] dark:text-[#f8f8ff]">{value}</p>
            <p className="mt-0.5 text-sm font-bold text-[#6B6490] dark:text-[#a19bb8]">{label}</p>
            <p className="mt-0.5 text-xs text-[#6B6490]/70 dark:text-[#a19bb8]/70">{sub}</p>
          </div>
        ))}
      </div>

      {/* Per-bot breakdown */}
      <div>
        <h2 className="mb-4 text-base font-bold text-[#1A1035] dark:text-[#f8f8ff]">Bot Breakdown</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#f4efff]" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ede9f8] dark:border-[#382b61] py-20 text-center">
            <BarChart2 className="mb-3 h-10 w-10 text-[#c4b5fd]" />
            <p className="text-sm font-semibold text-[#1A1035] dark:text-[#f8f8ff]">No bots yet</p>
            <p className="mt-1 text-xs text-[#6B6490] dark:text-[#a19bb8]">Create a bot to start seeing analytics.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map(({ bot, summary }) => (
              <div
                key={bot.id}
                className="flex items-center gap-4 rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm"
              >
                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white shadow-sm">
                  {bot.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-[#1A1035] dark:text-[#f8f8ff]">{bot.name}</p>
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`}
                    />
                    <span className="text-xs text-[#6B6490] dark:text-[#a19bb8]">
                      {bot.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-6">
                    {[
                      { label: 'Messages', value: summary?.totalMessages.toLocaleString() ?? '—' },
                      { label: 'Conversations', value: summary?.totalConversations.toLocaleString() ?? '—' },
                      { label: 'This month', value: summary?.messagesThisMonth.toLocaleString() ?? '—' },
                      { label: 'Unanswered', value: summary?.unansweredCount.toLocaleString() ?? '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-[#6B6490] dark:text-[#a19bb8]">{label}</p>
                        <p className="text-sm font-bold text-[#1A1035] dark:text-[#f8f8ff]">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/dashboard/bots/${bot.id}/analytics`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#ede9f8] dark:border-[#382b61] px-3 py-1.5 text-xs font-semibold text-[#6C47FF] transition-colors hover:bg-[#f0ebff]"
                  >
                    <BarChart2 className="h-3.5 w-3.5" />
                    Details
                  </Link>
                  <Link
                    href={`/dashboard/bots/${bot.id}/conversations`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#ede9f8] dark:border-[#382b61] px-3 py-1.5 text-xs font-semibold text-[#6B6490] dark:text-[#a19bb8] transition-colors hover:bg-[#faf8ff] dark:bg-[#130b29]"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Conversations
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
