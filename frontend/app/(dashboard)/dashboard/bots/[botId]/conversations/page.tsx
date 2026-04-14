'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Users, X, Download, Search } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type {
  Bot,
  ConversationDetail,
  ConversationItem,
  ConversationListResponse,
  LeadItem,
  LeadListResponse,
} from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ConversationsPage() {
  const { botId } = useParams<{ botId: string }>()
  const { getToken } = useAuth()
  const [bot, setBot] = useState<Bot | null>(null)
  const [activeTab, setActiveTab] = useState<'conversations' | 'leads'>('conversations')

  // Conversations state
  const [data, setData] = useState<ConversationListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<ConversationDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Leads state
  const [leadsData, setLeadsData] = useState<LeadListResponse | null>(null)
  const [leadsPage, setLeadsPage] = useState(1)
  const [leadsLoading, setLeadsLoading] = useState(false)

  const fetchBot = useCallback(async () => {
    if (bot) return
    try {
      const token = await getToken()
      const { data: b } = await api.get<Bot>(`/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBot(b)
    } catch { /* silently ignore */ }
  }, [bot, botId, getToken])

  const fetchConversations = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const token = await getToken()
      const { data: res } = await api.get<ConversationListResponse>(
        `/analytics/${botId}/conversations?page=${p}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setData(res)
    } catch {
      toast.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [botId, getToken])

  const fetchLeads = useCallback(async (p: number) => {
    setLeadsLoading(true)
    try {
      const token = await getToken()
      const { data: res } = await api.get<LeadListResponse>(
        `/bots/${botId}/leads?page=${p}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLeadsData(res)
    } catch {
      toast.error('Failed to load leads')
    } finally {
      setLeadsLoading(false)
    }
  }, [botId, getToken])

  useEffect(() => { fetchBot() }, [fetchBot])
  useEffect(() => { fetchConversations(page) }, [fetchConversations, page])
  useEffect(() => {
    if (activeTab === 'leads') fetchLeads(leadsPage)
  }, [activeTab, fetchLeads, leadsPage])

  async function openConversation(id: string) {
    setSelectedId(id)
    setDetailLoading(true)
    try {
      const token = await getToken()
      const { data: d } = await api.get<ConversationDetail>(
        `/analytics/${botId}/conversations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setDetail(d)
    } catch {
      toast.error('Failed to load conversation')
    } finally {
      setDetailLoading(false)
    }
  }

  function closePanel() {
    setSelectedId(null)
    setDetail(null)
  }

  async function exportLeadsCSV() {
    try {
      const token = await getToken()
      // Fetch all leads for export
      const { data: all } = await api.get<LeadListResponse>(
        `/bots/${botId}/leads?page=1&limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const rows = [
        ['Name', 'Email', 'Date', 'Session', 'Messages'],
        ...all.items.map((l: LeadItem) => [
          l.leadName ?? '',
          l.leadEmail,
          formatDate(l.createdAt),
          l.sessionId,
          String(l.messageCount),
        ]),
      ]
      const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-${botId}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to export leads')
    }
  }

  const botInitial = bot ? bot.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="flex h-full gap-6">
      <div className={cn('flex flex-1 flex-col min-w-0', selectedId ? 'hidden lg:flex' : '')}>
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/dashboard/bots/${botId}`}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-sm font-semibold text-white">
            {botInitial}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Conversations</h1>
            {bot && <p className="text-sm text-gray-500 dark:text-gray-400">{bot.name}</p>}
          </div>
        </div>

        {/* Tab bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-[#382b61] bg-gray-50 p-1">
            <button
              onClick={() => setActiveTab('conversations')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === 'conversations'
                  ? 'bg-white dark:bg-[#1A1035] text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'
              )}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === 'leads'
                  ? 'bg-white dark:bg-[#1A1035] text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'
              )}
            >
              <Users className="h-3.5 w-3.5" />
              Leads
            </button>
          </div>

          {activeTab === 'leads' && leadsData && leadsData.total > 0 && (
            <Button variant="outline" size="sm" onClick={exportLeadsCSV} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Search bar — conversations tab only */}
        {activeTab === 'conversations' && !loading && data && data.items.length > 0 && (
          <div className="mb-3 relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035] py-2 pl-9 pr-4 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF]"
            />
          </div>
        )}

        {/* Conversations tab */}
        {activeTab === 'conversations' && (
          loading ? (
            <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b border-gray-100 dark:border-[#382b61] px-4 py-3 last:border-0">
                  <div className="h-3 w-24 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
                  <div className="h-3 w-32 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
                  <div className="h-5 w-8 rounded-full bg-gray-200 dark:bg-[#2a1f4e]" />
                  <div className="h-3 flex-1 rounded bg-gray-100 dark:bg-[#231942]" />
                </div>
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-[#382b61] py-20 text-center">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden className="mb-3">
                <rect x="8" y="16" width="40" height="30" rx="8" fill="#f0ebff" stroke="#c4b5fd" strokeWidth="1.5"/>
                <rect x="24" y="34" width="32" height="22" rx="8" fill="#ede9f8" stroke="#c4b5fd" strokeWidth="1.5"/>
                <circle cx="20" cy="31" r="3" fill="#a78bfa"/>
                <circle cx="28" cy="31" r="3" fill="#a78bfa"/>
                <circle cx="36" cy="31" r="3" fill="#a78bfa"/>
                <circle cx="36" cy="45" r="2.5" fill="#c4b5fd"/>
                <circle cx="44" cy="45" r="2.5" fill="#c4b5fd"/>
              </svg>
              <p className="text-sm font-semibold text-[#1A1035] dark:text-[#f8f8ff]">No conversations yet</p>
              <p className="mt-1 text-xs text-[#6B6490] dark:text-[#a19bb8]">Messages will appear once users start chatting with your bot.</p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium text-gray-600">Session</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Messages</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Last message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.filter((c) => !search || c.lastMessage.toLowerCase().includes(search.toLowerCase()) || c.sessionId.toLowerCase().includes(search.toLowerCase())).map((conv: ConversationItem) => (
                      <tr
                        key={conv.id}
                        onClick={() => openConversation(conv.id)}
                        className={cn(
                          'cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-[#f0ebff]/50',
                          selectedId === conv.id ? 'bg-[#f0ebff]' : ''
                        )}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                          {conv.sessionId.slice(0, 12)}…
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(conv.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{conv.messageCount}</Badge>
                        </td>
                        <td className="max-w-xs px-4 py-3">
                          <span className="line-clamp-1 text-gray-600">{conv.lastMessage}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Page {data.page} of {data.pages} ({data.total} total)</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={data.page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* Leads tab */}
        {activeTab === 'leads' && (
          leadsLoading ? (
            <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b border-gray-100 dark:border-[#382b61] px-4 py-3 last:border-0">
                  <div className="h-3 w-28 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
                  <div className="h-3 w-40 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
                  <div className="h-3 w-24 rounded bg-gray-100 dark:bg-[#231942]" />
                  <div className="h-5 w-8 rounded-full bg-gray-100 dark:bg-[#231942]" />
                </div>
              ))}
            </div>
          ) : !leadsData || leadsData.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-[#382b61] py-20 text-center">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden className="mb-3">
                <circle cx="36" cy="26" r="14" fill="#f0ebff" stroke="#c4b5fd" strokeWidth="1.5"/>
                <circle cx="36" cy="23" r="7" fill="#a78bfa"/>
                <path d="M14 58c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" fill="#ede9f8"/>
              </svg>
              <p className="text-sm font-semibold text-[#1A1035] dark:text-[#f8f8ff]">No leads yet</p>
              <p className="mt-1 text-xs text-[#6B6490] dark:text-[#a19bb8]">Enable lead capture in your bot settings to collect visitor details.</p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Messages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsData.items.map((lead: LeadItem) => (
                      <tr key={lead.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 text-gray-800">{lead.leadName ?? <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${lead.leadEmail}`} className="text-[#6C47FF] hover:underline">{lead.leadEmail}</a>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(lead.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{lead.messageCount}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {leadsData.pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Page {leadsData.page} of {leadsData.pages} ({leadsData.total} total)</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={leadsData.page <= 1} onClick={() => setLeadsPage((p) => p - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={leadsData.page >= leadsData.pages} onClick={() => setLeadsPage((p) => p + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* Conversation detail panel */}
      {selectedId && (
        <div className="w-full flex-shrink-0 lg:w-96">
          <div className="sticky top-0 flex h-full flex-col rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Conversation</p>
                <p className="font-mono text-xs text-gray-400">
                  {detail?.conversation.sessionId.slice(0, 16)}…
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={closePanel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {detailLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div className={`h-10 rounded-2xl bg-gray-200 dark:bg-[#2a1f4e] ${i % 2 === 0 ? 'w-3/5' : 'w-4/5'}`} />
                    </div>
                  ))}
                </div>
              ) : detail ? (
                <div className="space-y-3">
                  {detail.messages.map((msg, i) => (
                    <div key={i} className={cn('flex', msg.role === 'USER' ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
                        msg.role === 'USER' ? 'bg-[#6C47FF] text-white' : 'bg-gray-100 text-gray-800'
                      )}>
                        <p>{msg.content}</p>
                        <p className={cn('mt-1 text-right text-xs', msg.role === 'USER' ? 'text-white/60' : 'text-gray-400')}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
