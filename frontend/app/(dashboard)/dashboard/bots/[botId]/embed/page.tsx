'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Code2, Copy, ExternalLink, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot } from '@/lib/types'
import { Button } from '@/components/ui/button'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(/\/api$/, '')

export default function EmbedPage() {
  const { botId } = useParams<{ botId: string }>()
  const { getToken } = useAuth()
  const [bot, setBot] = useState<Bot | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchBot = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await api.get<Bot>(`/bots/${botId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBot(data)
    } catch {
      toast.error('Failed to load bot')
    }
  }, [botId, getToken])

  useEffect(() => {
    fetchBot()
  }, [fetchBot])

  const snippet = `<script src="${API_BASE}/widget.js" data-bot-id="${botId}"></script>`

  function copySnippet() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Embed your bot</h1>
          {bot && <p className="text-sm text-gray-500 dark:text-gray-400">{bot.name}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          {/* Snippet card */}
          <div className="rounded-lg border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-6">
            <div className="mb-1 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#6C47FF]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Embed code</h2>
            </div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Paste this snippet before the{' '}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">&lt;/body&gt;</code>{' '}
              tag on your website.
            </p>

            <div className="relative rounded-md bg-gray-950 p-4">
              <pre className="overflow-x-auto pr-16 text-xs leading-relaxed text-emerald-400">
                <code>{snippet}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={copySnippet}
                className="absolute right-2 top-2 h-7 gap-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Go live checklist */}
          <div className="rounded-lg border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#6C47FF]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Go live checklist</h2>
            </div>
            <ol className="space-y-4">
              {[
                {
                  title: 'Copy the embed code',
                  desc: 'Click the copy button above to grab your unique widget snippet.',
                },
                {
                  title: 'Paste before </body>',
                  desc: "Open your website's HTML and paste the code just before the closing body tag.",
                },
                {
                  title: 'Test on your site',
                  desc: 'Visit your website — the chat bubble should appear in the bottom-right corner.',
                },
              ].map(({ title, desc }, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0ebff] text-xs font-semibold text-[#6C47FF]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right column — live preview */}
        <div className="rounded-lg border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-6">
          <div className="mb-1 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-[#6C47FF]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Live preview</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            See exactly how your bot will look on a real page.
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-[#382b61]" style={{ height: 480 }}>
            <iframe
              src={`${API_BASE}/demo.html?botId=${botId}`}
              className="h-full w-full"
              title="Widget preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
