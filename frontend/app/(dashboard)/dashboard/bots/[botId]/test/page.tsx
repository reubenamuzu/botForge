'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(/\/api$/, '')

interface Message {
  role: 'user' | 'bot'
  content: string
}

function mkSession() {
  return 'test-' + Math.random().toString(36).slice(2, 10)
}

export default function BotTestPage() {
  const { botId } = useParams<{ botId: string }>()
  const { getToken } = useAuth()
  const [bot, setBot] = useState<Bot | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(mkSession)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchBot = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await api.get<Bot>(`/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBot(data)
      setMessages([{ role: 'bot', content: data.greeting }])
    } catch {
      toast.error('Failed to load bot')
    }
  }, [botId, getToken])

  useEffect(() => { fetchBot() }, [fetchBot])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId, sessionId, message: text }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      setMessages((prev) => [...prev, { role: 'bot', content: data.reply ?? 'No reply' }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setMessages((prev) => [...prev, { role: 'bot', content: `⚠️ ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setSessionId(mkSession())
    setMessages(bot ? [{ role: 'bot', content: bot.greeting }] : [])
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/bots/${botId}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-sm font-semibold text-white">
          {bot ? bot.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Test Bot</h1>
          {bot && <p className="text-sm text-gray-500 dark:text-gray-400">{bot.name}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset conversation
        </Button>
      </div>

      {/* Chat */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035]">
        {/* Status bar */}
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-[#0E0820] px-4 py-2">
          <span className={cn('h-2 w-2 rounded-full flex-shrink-0', bot?.isActive ? 'bg-green-400' : 'bg-gray-300')} />
          <span className="truncate text-xs text-gray-500 dark:text-gray-400">
            {bot?.isActive ? 'Active' : 'Inactive'} · session <code className="font-mono">{sessionId}</code>
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-[#6C47FF] text-white'
                    : 'rounded-bl-sm bg-gray-100 dark:bg-white/[0.08] text-gray-900 dark:text-[#F4F1FF]'
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-white/[0.08] px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 dark:border-white/[0.06] p-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a test message…"
            disabled={loading || !bot}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim() || !bot}
            className="shrink-0 bg-[#6C47FF] hover:bg-[#5835ee]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
