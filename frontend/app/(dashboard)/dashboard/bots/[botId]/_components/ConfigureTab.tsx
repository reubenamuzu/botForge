'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, Tone } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  const [form, setForm] = useState({
    name: bot.name,
    greeting: bot.greeting,
    tone: bot.tone,
    fallbackMsg: bot.fallbackMsg,
    isActive: bot.isActive,
  })
  const [saving, setSaving] = useState(false)

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

  return (
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
            />
            <Label htmlFor="cfg-active">Active</Label>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
