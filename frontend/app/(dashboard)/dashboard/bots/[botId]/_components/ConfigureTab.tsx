'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, Tone } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  bot: Bot
  onSaved: (bot: Bot) => void
}

export function ConfigureTab({ bot, onSaved }: Props) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    name: bot.name,
    greeting: bot.greeting,
    tone: bot.tone,
    fallbackMsg: bot.fallbackMsg,
    isActive: bot.isActive,
    leadCapture: bot.leadCapture,
  })
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const token = await getToken()
      const { data } = await api.patch<Bot>(`/bots/${bot.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onSaved(data)
      toast.success('Configuration saved')
    } catch {
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const token = await getToken()
      await api.delete(`/bots/${bot.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Bot deleted')
      router.push('/dashboard/bots')
    } catch {
      toast.error('Failed to delete bot')
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="max-w-xl space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="cfg-name">Bot name</Label>
              <Input
                id="cfg-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cfg-greeting">Greeting message</Label>
              <Textarea
                id="cfg-greeting"
                value={form.greeting}
                onChange={(e) => setForm({ ...form, greeting: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cfg-tone">Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(v) => setForm({ ...form, tone: v as Tone })}
              >
                <SelectTrigger id="cfg-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRIENDLY">Friendly</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="FORMAL">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cfg-fallback">Fallback message</Label>
              <Textarea
                id="cfg-fallback"
                value={form.fallbackMsg}
                onChange={(e) => setForm({ ...form, fallbackMsg: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="cfg-active"
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                aria-label="Bot active status"
              />
              <Label htmlFor="cfg-active">Active</Label>
            </div>

            <div className="flex items-start gap-3">
              <Switch
                id="cfg-lead"
                checked={form.leadCapture}
                onCheckedChange={(v) => setForm({ ...form, leadCapture: v })}
                aria-label="Lead capture"
              />
              <div>
                <Label htmlFor="cfg-lead">Lead capture</Label>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Ask visitors for their name and email before they start chatting.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <div className="mt-6 max-w-xl rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-5">
        <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Danger zone</h3>
        <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/70">
          Permanently delete this bot and all its knowledge, conversations, and analytics. This cannot be undone.
        </p>
        <Button
          variant="destructive"
          size="sm"
          className="mt-4"
          onClick={() => setDeleteOpen(true)}
        >
          Delete this bot
        </Button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete bot?"
        description={`"${bot.name}" and all its knowledge, conversations, and analytics will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete bot"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
