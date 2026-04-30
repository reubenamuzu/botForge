'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import {
  BookOpen,
  FileText,
  Globe,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, KnowledgeItem } from '@/lib/types'

interface BotWithKnowledge {
  bot: Bot
  items: KnowledgeItem[]
  expanded: boolean
}

function typeIcon(type: string) {
  if (type === 'FAQ') return <HelpCircle className="h-3.5 w-3.5 text-[#6C47FF]" />
  if (type === 'PDF') return <FileText className="h-3.5 w-3.5 text-amber-500" />
  return <Globe className="h-3.5 w-3.5 text-emerald-500" />
}

function typeBadge(type: string) {
  if (type === 'FAQ') return 'bg-[#f0ebff] dark:bg-[#6C47FF]/20 text-[#6C47FF] dark:text-[#8B6FFF]'
  if (type === 'PDF') return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
  return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
}

export default function KnowledgePage() {
  const { getToken } = useAuth()
  const [data, setData] = useState<BotWithKnowledge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const { data: bots } = await api.get<Bot[]>('/bots', { headers })

      const knowledgeResults = await Promise.all(
        bots.map((bot) =>
          api
            .get<KnowledgeItem[]>(`/bots/${bot.id}/knowledge`, { headers })
            .then((r) => r.data)
            .catch(() => [] as KnowledgeItem[])
        )
      )

      setData(bots.map((bot, i) => ({ bot, items: knowledgeResults[i], expanded: true })))
    } catch {
      toast.error('Failed to load knowledge base')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function toggleExpand(botId: string) {
    setData((prev) =>
      prev.map((d) => (d.bot.id === botId ? { ...d, expanded: !d.expanded } : d))
    )
  }

  const totalFaqs = data.reduce((s, d) => s + d.items.filter((i) => i.type === 'FAQ').length, 0)
  const totalPdfs = data.reduce((s, d) => s + d.items.filter((i) => i.type === 'PDF').length, 0)
  const totalUrls = data.reduce((s, d) => s + d.items.filter((i) => i.type === 'URL').length, 0)

  const gridStyle = { backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header strip */}
      <div className="relative -mx-3 -mt-3 mb-6 overflow-hidden border-b border-[#E8E3F5] bg-[#F8F8FF] px-4 py-6 dark:border-white/[0.08] dark:bg-[#0E0820] sm:-mx-6 sm:-mt-6 sm:mb-8 sm:px-8 sm:py-8 lg:-mx-8 lg:-mt-8">
        <div className="pointer-events-none absolute inset-0" style={gridStyle} />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
            KNOWLEDGE BASE
          </div>
          <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[32px]">
            Knowledge{' '}
            <em style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              Base.
            </em>
          </h1>
          <p className="mt-2 font-mono text-[12px] text-[#6B6490] dark:text-[#8B82B0]">
            Manage training data across all your bots.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'FAQs', value: totalFaqs, icon: HelpCircle, color: 'text-[#6C47FF]', bg: 'bg-[#f0ebff] dark:bg-[#6C47FF]/20' },
            { label: 'PDFs', value: totalPdfs, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'URLs', value: totalUrls, icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-[#1A1035] dark:text-[#f8f8ff]">{value}</p>
              <p className="mt-0.5 text-sm font-medium text-[#6B6490] dark:text-[#a19bb8]">{label} across all bots</p>
            </div>
          ))}
        </div>
      )}

      {/* Per-bot breakdown */}
      <div>
        <h2 className="mb-4 text-base font-bold text-[#1A1035] dark:text-[#f8f8ff]">By Bot</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#f4efff]" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#ede9f8] dark:border-[#382b61] py-20 text-center">
            <BookOpen className="mb-3 h-10 w-10 text-[#c4b5fd]" />
            <p className="text-sm font-semibold text-[#1A1035] dark:text-[#f8f8ff]">No bots yet</p>
            <p className="mt-1 text-xs text-[#6B6490] dark:text-[#a19bb8]">
              Create a bot to start adding knowledge.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map(({ bot, items, expanded }) => {
              const faqs = items.filter((i) => i.type === 'FAQ')
              const pdfs = items.filter((i) => i.type === 'PDF')
              const urls = items.filter((i) => i.type === 'URL')

              return (
                <div
                  key={bot.id}
                  className="overflow-hidden rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] shadow-sm"
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggleExpand(bot.id)}
                    className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#faf8ff] dark:bg-[#130b29]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white shadow-sm">
                      {bot.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1A1035] dark:text-[#f8f8ff]">{bot.name}</p>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`}
                        />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[#6B6490] dark:text-[#a19bb8]">
                        <span>{faqs.length} FAQs</span>
                        <span>{pdfs.length} PDFs</span>
                        <span>{urls.length} URLs</span>
                        {items.length === 0 && (
                          <span className="font-medium text-amber-600">No knowledge items</span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Link
                        href={`/dashboard/bots/${bot.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#ede9f8] dark:border-[#382b61] px-3 py-1.5 text-xs font-semibold text-[#6C47FF] transition-colors hover:bg-[#f0ebff]"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Manage
                      </Link>
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 text-[#6B6490] dark:text-[#a19bb8]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[#6B6490] dark:text-[#a19bb8]" />
                      )}
                    </div>
                  </button>

                  {/* Knowledge items */}
                  {expanded && items.length > 0 && (
                    <div className="divide-y divide-[#f4efff] dark:divide-white/[0.06] border-t border-[#f4efff] dark:border-white/[0.06]">
                      {items.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="shrink-0">{typeIcon(item.type)}</div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge(item.type)}`}
                          >
                            {item.type}
                          </span>
                          <span className="truncate text-sm text-[#514972] dark:text-[#8B82B0]">
                            {item.type === 'FAQ'
                              ? item.question
                              : item.sourceUrl ?? item.rawText?.slice(0, 80)}
                          </span>
                        </div>
                      ))}
                      {items.length > 5 && (
                        <div className="px-5 py-3 text-xs font-medium text-[#6B6490] dark:text-[#a19bb8]">
                          +{items.length - 5} more items —{' '}
                          <Link
                            href={`/dashboard/bots/${bot.id}`}
                            className="text-[#6C47FF] hover:underline"
                          >
                            view all
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {expanded && items.length === 0 && (
                    <div className="border-t border-[#f4efff] dark:border-white/[0.06] px-5 py-4 text-sm text-[#6B6490] dark:text-[#a19bb8]">
                      No knowledge items yet.{' '}
                      <Link
                        href={`/dashboard/bots/${bot.id}`}
                        className="font-semibold text-[#6C47FF] hover:underline"
                      >
                        Add some →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
