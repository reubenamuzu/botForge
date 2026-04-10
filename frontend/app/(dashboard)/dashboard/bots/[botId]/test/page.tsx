'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  role: 'USER' | 'BOT'
  content: string
}

export default function BotTestPage() {
  const { botId } = useParams<{ botId: string }>()
  const [sessionId] = useState(() => crypto.randomUUID())
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'USER', content: text }])
    setLoading(true)

    try {
      const { data } = await api.post<{ reply: string }>('/chat', {
        botId,
        sessionId,
        message: text,
      })
      setMessages((prev) => [...prev, { role: 'BOT', content: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'BOT', content: 'Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-gray-200 px-6 py-4">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/bots/${botId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-base font-semibold text-gray-900">Test your bot</h1>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <p className="mt-12 text-center text-sm text-gray-400">
            Send a message to start testing your bot.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'USER'
                  ? 'rounded-br-sm bg-indigo-600 text-white'
                  : 'rounded-bl-sm bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex flex-shrink-0 items-center gap-3 border-t border-gray-200 px-6 py-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
