'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Bot as BotIcon, Plus, MessageSquare, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, Tone } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const gridStyle = {
  backgroundImage:
    'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

const defaultForm = { name: '', greeting: '', tone: 'FRIENDLY' as Tone }

export default function BotsPage() {
  const { getToken } = useAuth()
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchBots = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await api.get<Bot[]>('/bots', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBots(data)
    } catch {
      toast.error('Failed to load bots')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchBots()
  }, [fetchBots])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = await getToken()
      await api.post('/bots', form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchBots()
      setOpen(false)
      setForm(defaultForm)
      toast.success('Bot created')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { error?: string; code?: string } } }
      if (axiosErr.response?.status === 403 && axiosErr.response?.data?.code === 'LIMIT_EXCEEDED') {
        toast.error(axiosErr.response.data?.error ?? "You've reached your bot limit.", {
          action: { label: 'Upgrade', onClick: () => window.location.href = '/dashboard/billing' },
        })
      } else {
        toast.error('Failed to create bot')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Page header strip */}
      <div className="relative -mx-4 -mt-4 mb-8 overflow-hidden border-b border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF] dark:bg-[#0E0820] px-8 py-8 sm:-mx-8 sm:-mt-8">
        <div className="pointer-events-none absolute inset-0" style={gridStyle} />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
              MY BOTS
            </div>
            <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF]">
              My{' '}
              <em style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                Bots.
              </em>
            </h1>
            <p className="mt-2 font-mono text-[12px] text-[#6B6490] dark:text-[#8B82B0]">
              Manage and configure your AI customer support bots.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="shrink-0 rounded-xl bg-[#6C47FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5835ee] inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Bot
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new bot</DialogTitle>
              </DialogHeader>
              <DialogDescription className="sr-only">
                Fill in the details below to create a new AI support bot.
              </DialogDescription>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Bot name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Support Assistant"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="greeting">Greeting message</Label>
                  <Textarea
                    id="greeting"
                    placeholder="Hi! How can I help you today?"
                    value={form.greeting}
                    onChange={(e) => setForm({ ...form, greeting: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tone</Label>
                  <Select
                    value={form.tone}
                    onValueChange={(v) => setForm({ ...form, tone: v as Tone })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRIENDLY">Friendly</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="FORMAL">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#1A1035] dark:text-[#F4F1FF] transition-colors hover:border-[#6C47FF] hover:text-[#6C47FF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-[#6C47FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5835ee] disabled:opacity-60"
                  >
                    {submitting ? 'Creating...' : 'Create Bot'}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F0EDFA] dark:bg-white/5" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-32 rounded bg-[#F0EDFA] dark:bg-white/5" />
                  <div className="h-3 w-16 rounded bg-[#F0EDFA] dark:bg-white/5" />
                </div>
              </div>
              <div className="space-y-2 pb-3">
                <div className="h-3 w-full rounded bg-[#F0EDFA] dark:bg-white/5" />
                <div className="h-3 w-4/5 rounded bg-[#F0EDFA] dark:bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : bots.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden className="mb-2">
            <rect x="20" y="32" width="56" height="44" rx="12" fill="#f0ebff"/>
            <rect x="20" y="32" width="56" height="44" rx="12" stroke="#c4b5fd" strokeWidth="2"/>
            <circle cx="36" cy="52" r="6" fill="#a78bfa"/>
            <circle cx="60" cy="52" r="6" fill="#a78bfa"/>
            <rect x="36" y="63" width="24" height="4" rx="2" fill="#c4b5fd"/>
            <rect x="40" y="18" width="16" height="16" rx="4" fill="#ede9f8" stroke="#c4b5fd" strokeWidth="2"/>
            <line x1="48" y1="18" x2="48" y2="32" stroke="#c4b5fd" strokeWidth="2"/>
            <rect x="10" y="44" width="10" height="16" rx="5" fill="#ede9f8" stroke="#c4b5fd" strokeWidth="2"/>
            <rect x="76" y="44" width="10" height="16" rx="5" fill="#ede9f8" stroke="#c4b5fd" strokeWidth="2"/>
          </svg>
          <h3 className="mt-2 text-base font-semibold text-[#1A1035] dark:text-[#F4F1FF]">No bots yet</h3>
          <p className="mt-1 text-sm text-[#6B6490] dark:text-[#8B82B0]">
            Create your first bot and start answering customer questions automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/dashboard/bots/${bot.id}`}
              className="group flex flex-col rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6 transition-all hover:border-[#6C47FF]"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white">
                    {bot.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#1A1035] dark:text-[#F4F1FF]">{bot.name}</p>
                    <span className={cn(
                      'flex items-center gap-1.5 font-mono text-[11px]',
                      bot.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#6B6490] dark:text-[#8B82B0]'
                    )}>
                      <span className={`h-1.5 w-1.5 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                      {bot.isActive ? 'active' : 'inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mb-4 line-clamp-2 flex-1 text-sm text-[#6B6490] dark:text-[#8B82B0]">{bot.greeting}</p>

              <div className="flex items-center justify-between border-t border-[#E8E3F5] dark:border-white/[0.08] pt-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {(bot.conversationCount ?? 0).toLocaleString()} convos
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
                  <Clock className="h-3.5 w-3.5" />
                  {timeAgo(bot.lastActiveAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
