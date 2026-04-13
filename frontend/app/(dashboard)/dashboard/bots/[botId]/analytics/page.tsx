'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, TrendingUp, Calendar, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { api } from '@/lib/api'
import type { AnalyticsSummary, Bot, ConversationItem, ConversationListResponse } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: React.ElementType
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
        <Icon className="h-4 w-4 text-[#6C47FF]" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsPage() {
  const { botId } = useParams<{ botId: string }>()
  const { getToken } = useAuth()
  const [bot, setBot] = useState<Bot | null>(null)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [unanswered, setUnanswered] = useState<ConversationItem[]>([])
  const [unansweredLoading, setUnansweredLoading] = useState(false)

  const fetchUnanswered = useCallback(async () => {
    setUnansweredLoading(true)
    try {
      const token = await getToken()
      const { data } = await api.get<ConversationListResponse>(
        `/analytics/${botId}/conversations?unanswered=true&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUnanswered(data.items)
    } catch {
      // silently ignore
    } finally {
      setUnansweredLoading(false)
    }
  }, [botId, getToken])

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [botRes, summaryRes] = await Promise.all([
        api.get<Bot>(`/bots/${botId}`, { headers }),
        api.get<AnalyticsSummary>(`/analytics/${botId}/summary`, { headers }),
      ])
      setBot(botRes.data)
      setSummary(summaryRes.data)
    } catch {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [botId, getToken])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (summary && summary.unansweredCount > 0) fetchUnanswered()
  }, [summary, fetchUnanswered])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-[#2a1f4e]" />
          <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-[#2a1f4e]" />
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5">
              <div className="mb-3 h-3 w-24 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
              <div className="h-8 w-20 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]" />
          <div className="h-72 rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]" />
        </div>
      </div>
    )
  }

  if (!summary) return null

  const chartData = summary.dailyMessages.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    Messages: d.count,
  }))

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/bots/${botId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-sm font-semibold text-white">
          {bot ? bot.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h1>
          {bot && <p className="text-sm text-gray-500 dark:text-gray-400">{bot.name}</p>}
        </div>
      </div>

      {/* Metric cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Conversations"
          value={summary.totalConversations.toLocaleString()}
          icon={MessageSquare}
        />
        <MetricCard
          label="Total Messages"
          value={summary.totalMessages.toLocaleString()}
          icon={TrendingUp}
        />
        <MetricCard
          label="Messages This Month"
          value={summary.messagesThisMonth.toLocaleString()}
          icon={Calendar}
        />
        <MetricCard
          label="Avg Messages / Conv."
          value={summary.avgMessagesPerConversation}
          icon={AlertCircle}
        />
      </div>

      {/* Unanswered queue */}
      {summary.unansweredCount > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">!</span>
              Unanswered Questions
            </h2>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              {summary.unansweredCount} conversation{summary.unansweredCount !== 1 ? 's' : ''}
            </span>
          </div>
          <Card>
            <CardContent className="p-0">
              {unansweredLoading ? (
                <div className="animate-pulse divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 px-4 py-3">
                      <div className="h-3 w-24 rounded bg-gray-200" />
                      <div className="h-3 flex-1 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-[#382b61]">
                  {unanswered.map((conv) => (
                    <Link
                      key={conv.id}
                      href={`/dashboard/bots/${botId}/conversations`}
                      className={cn(
                        'flex items-center gap-4 px-4 py-3 text-sm transition-colors',
                        'hover:bg-gray-50 dark:hover:bg-[#1A1035]/50'
                      )}
                    >
                      <span className="font-mono text-xs text-gray-400">{conv.sessionId.slice(0, 12)}…</span>
                      <span className="flex-1 truncate text-gray-600 dark:text-gray-400">{conv.lastMessage}</span>
                      <span className="shrink-0 text-xs text-gray-400">
                        {new Date(conv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Badge variant="secondary" className="shrink-0">{conv.messageCount}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Messages — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary.totalMessages === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                No messages yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    cursor={{ fill: '#eef2ff' }}
                  />
                  <Bar dataKey="Messages" fill="#6C47FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top questions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Top Questions</CardTitle>
            {summary.unansweredCount > 0 && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {summary.unansweredCount} unanswered
              </span>
            )}
          </CardHeader>
          <CardContent>
            {summary.topQuestions.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-gray-400">
                No questions yet
              </div>
            ) : (
              <ol className="space-y-2">
                {summary.topQuestions.map(({ content, count }, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2.5"
                  >
                    <span className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">{content}</span>
                    <Badge
                      variant="secondary"
                      className="ml-auto shrink-0 bg-[#f0ebff] text-[#6C47FF] hover:bg-[#f0ebff]"
                    >
                      {count}
                    </Badge>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
