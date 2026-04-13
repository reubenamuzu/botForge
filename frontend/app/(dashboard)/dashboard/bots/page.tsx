'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Bot as BotIcon, Plus, MessageSquare, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, Tone } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">My Bots</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and configure your AI customer support bots.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Bot
            </Button>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Bot'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-[#2a1f4e]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#2a1f4e]" />
                  <div className="h-3 w-16 rounded bg-gray-100 dark:bg-[#231942]" />
                </div>
              </div>
              <div className="space-y-2 pb-3">
                <div className="h-3 w-full rounded bg-gray-100 dark:bg-[#231942]" />
                <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-[#231942]" />
              </div>
              <div className="pt-3">
                <div className="h-8 w-full rounded-lg bg-gray-100 dark:bg-[#231942]" />
              </div>
            </div>
          ))}
        </div>
      ) : bots.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <BotIcon className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">No bots yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your first bot to get started.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/dashboard/bots/${bot.id}`}
              className="group flex flex-col rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-5 shadow-sm transition-all hover:border-[#6C47FF] hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#5835ee] text-sm font-bold text-white shadow-sm">
                    {bot.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#1A1035] dark:text-[#f8f8ff]">{bot.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${bot.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                      <span className="text-xs text-[#6B6490] dark:text-[#a19bb8]">{bot.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={bot.isActive ? 'success' : 'secondary'} className="shrink-0 text-xs">
                  {bot.isActive ? 'Live' : 'Off'}
                </Badge>
              </div>

              <p className="mb-4 line-clamp-2 flex-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">{bot.greeting}</p>

              <div className="flex items-center justify-between border-t border-[#f0ebff] dark:border-[#382b61] pt-3 text-xs text-[#6B6490] dark:text-[#a19bb8]">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {(bot.conversationCount ?? 0).toLocaleString()} convos
                </span>
                <span className="flex items-center gap-1">
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
