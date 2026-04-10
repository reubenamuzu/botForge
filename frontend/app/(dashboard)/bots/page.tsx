'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Bot as BotIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, Tone } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
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
    } catch {
      toast.error('Failed to create bot')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Bots</h1>
          <p className="mt-1 text-sm text-gray-500">
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
        <div className="mt-8 text-sm text-gray-500">Loading...</div>
      ) : bots.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <BotIcon className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No bots yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first bot to get started.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Card key={bot.id}>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {bot.name.charAt(0).toUpperCase()}
                </div>
                <CardTitle className="flex-1 truncate text-base">{bot.name}</CardTitle>
                <Badge variant={bot.isActive ? 'success' : 'secondary'}>
                  {bot.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="line-clamp-2 text-sm text-gray-500">{bot.greeting}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/dashboard/bots/${bot.id}`}>Open</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
